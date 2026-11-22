'use server';

import { createClient } from '@/lib/supabase/server';
import { GeminiAiDesignProvider } from './GeminiAiDesignProvider';
import { BasicFallbackDesignProvider } from './BasicFallbackDesignProvider';
import type {
  SafeProviderStatus,
  AiConversationMessage,
  BusinessProfile,
  DesignConcept,
  CatalogContext,
} from './types';
import type { StorefrontConfig } from '@/types/customizer';
import type { PublicStore } from '@/types';

function getProvider() {
  const hasKey = !!process.env.GEMINI_API_KEY;
  return hasKey ? new GeminiAiDesignProvider() : new BasicFallbackDesignProvider();
}

/**
 * Verify merchant owns store
 */
async function verifyStoreOwnership(storeId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('UNAUTHORIZED');
  }

  const { data: store, error } = await supabase
    .from('stores')
    .select('id, owner_id, name, slug, category, city, state, whatsapp_number, is_published, created_at')
    .eq('id', storeId)
    .single();

  if (error || !store || store.owner_id !== user.id) {
    throw new Error('UNAUTHORIZED_STORE_ACCESS');
  }

  return { user, store };
}

/**
 * Fetch Catalog Context (categories, sample products) without customer PII
 */
async function getCatalogContext(storeId: string, storeName: string, category: string, city: string, state: string): Promise<CatalogContext> {
  const supabase = await createClient();

  const [catRes, prodRes] = await Promise.all([
    supabase.from('categories').select('id, name').eq('store_id', storeId).limit(10),
    supabase.from('products').select('name, price, description').eq('store_id', storeId).limit(8),
  ]);

  return {
    storeName,
    category,
    city: city || 'Local City',
    state: state || 'India',
    categories: (catRes.data as Array<{ id: string; name: string }>) || [],
    sampleProducts: (prodRes.data as Array<{ name: string; price: number; description?: string | null }>) || [],
  };
}

/**
 * Action 1: Get Safe Provider Status
 */
export async function getAiProviderStatusAction(storeId: string): Promise<SafeProviderStatus> {
  await verifyStoreOwnership(storeId);
  const provider = getProvider();
  return provider.inspectAvailability();
}

/**
 * Action 2: Get Existing Conversation
 */
export async function getAiConversationAction(storeId: string) {
  const { user } = await verifyStoreOwnership(storeId);
  const supabase = await createClient();

  const { data } = await supabase
    .from('store_ai_conversations')
    .select('*')
    .eq('store_id', storeId)
    .maybeSingle();

  if (!data) {
    return {
      messages: [] as AiConversationMessage[],
      stage: 'understanding' as const,
      businessProfile: null as BusinessProfile | null,
      concepts: [] as DesignConcept[],
      languagePreference: 'en' as const,
    };
  }

  return {
    messages: (data.messages as unknown as AiConversationMessage[]) || [],
    stage: data.stage as 'understanding' | 'concepts' | 'generated' | 'refining',
    businessProfile: data.business_profile as unknown as BusinessProfile | null,
    concepts: (data.concepts as unknown as DesignConcept[]) || [],
    languagePreference: data.language_preference as 'en' | 'hi' | 'hinglish',
  };
}

/**
 * Action 3: Send AI Prompt (Understanding, Concepts, or Refinements)
 */
export async function sendAiPromptAction(
  storeId: string,
  userPrompt: string,
  currentConfig?: StorefrontConfig,
  currentStage: 'understanding' | 'concepts' | 'refining' = 'understanding'
) {
  const { user, store } = await verifyStoreOwnership(storeId);
  const trimmed = userPrompt.trim().slice(0, 1000);
  if (!trimmed) {
    throw new Error('PROMPT_CANNOT_BE_EMPTY');
  }

  const supabase = await createClient();
  const provider = getProvider();
  const catalog = await getCatalogContext(store.id, store.name, store.category, store.city, store.state);

  // Retrieve current conversation record
  const { data: convData } = await supabase
    .from('store_ai_conversations')
    .select('*')
    .eq('store_id', storeId)
    .maybeSingle();

  const existingMessages: AiConversationMessage[] = (convData?.messages as unknown as AiConversationMessage[]) || [];
  let existingProfile: BusinessProfile | undefined = convData?.business_profile as unknown as BusinessProfile;

  const userMsg: AiConversationMessage = {
    id: `msg_u_${Date.now()}`,
    role: 'user',
    content: trimmed,
    stage: currentStage,
    createdAt: new Date().toISOString(),
  };

  let assistantMsg: AiConversationMessage;
  let nextStage = currentStage;
  let conceptsOut: DesignConcept[] = (convData?.concepts as unknown as DesignConcept[]) || [];
  let updatedConfigOut: StorefrontConfig | undefined;

  if (currentStage === 'understanding' || !existingProfile) {
    // Stage 1: Business Understanding
    const understandRes = await provider.understandBusiness(trimmed, existingProfile);

    if (understandRes.isUnderstood && understandRes.profile) {
      existingProfile = understandRes.profile;
      // Auto-transition to Stage 2: Generate Concepts
      conceptsOut = await provider.brainstormConcepts(existingProfile, catalog);
      nextStage = 'concepts';

      assistantMsg = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: `I have analyzed your business profile for "${existingProfile.businessName}". Here are 3 bespoke design concepts tailored to your brand:`,
        stage: 'concepts',
        createdAt: new Date().toISOString(),
        concepts: conceptsOut,
      };
    } else {
      assistantMsg = {
        id: `msg_a_${Date.now()}`,
        role: 'assistant',
        content: understandRes.followUpQuestion || 'Could you provide a few more details about your shop products and customers?',
        stage: 'understanding',
        createdAt: new Date().toISOString(),
        missingFields: understandRes.missingFields,
      };
    }
  } else if (currentStage === 'refining' && currentConfig) {
    // Stage 5: Conversational Refinement
    const refineRes = await provider.refineStorefrontConfig(currentConfig, trimmed, existingMessages);
    updatedConfigOut = refineRes.updatedConfig;

    assistantMsg = {
      id: `msg_a_${Date.now()}`,
      role: 'assistant',
      content: refineRes.explanation,
      stage: 'refining',
      createdAt: new Date().toISOString(),
      explanation: refineRes.patchSummary,
    };
  } else {
    // Fallback: regenerate concepts
    conceptsOut = await provider.brainstormConcepts(existingProfile, catalog);
    nextStage = 'concepts';

    assistantMsg = {
      id: `msg_a_${Date.now()}`,
      role: 'assistant',
      content: 'Here are 3 refreshed creative concepts for your storefront:',
      stage: 'concepts',
      createdAt: new Date().toISOString(),
      concepts: conceptsOut,
    };
  }

  // Update conversation in database
  const updatedMessages = [...existingMessages, userMsg, assistantMsg].slice(-50);

  await supabase
    .from('store_ai_conversations')
    .upsert(
      {
        store_id: storeId,
        merchant_id: user.id,
        stage: nextStage,
        business_profile: existingProfile || {},
        concepts: conceptsOut,
        messages: updatedMessages,
        language_preference: existingProfile?.languagePreference || 'en',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'store_id' }
    );

  return {
    userMessage: userMsg,
    assistantMessage: assistantMsg,
    nextStage,
    concepts: conceptsOut,
    updatedConfig: updatedConfigOut,
  };
}

/**
 * Action 4: Synthesize & Apply Selected Concept
 */
export async function applyAiConceptAction(
  storeId: string,
  concept: DesignConcept
): Promise<StorefrontConfig> {
  const { store } = await verifyStoreOwnership(storeId);
  const provider = getProvider();
  const catalog = await getCatalogContext(store.id, store.name, store.category, store.city, store.state);

  const publicStore: PublicStore = {
    id: store.id,
    name: store.name,
    slug: store.slug,
    category: store.category,
    city: store.city,
    state: store.state,
    whatsapp_number: store.whatsapp_number,
    is_published: store.is_published,
    created_at: store.created_at,
  };

  const synthesizedConfig = await provider.synthesizeStorefrontConfig(concept, publicStore, catalog);

  // Update conversation stage to 'refining'
  const supabase = await createClient();
  await supabase
    .from('store_ai_conversations')
    .update({
      stage: 'refining',
      selected_concept_id: concept.id,
      updated_at: new Date().toISOString(),
    })
    .eq('store_id', storeId);

  return synthesizedConfig;
}

/**
 * Action 5: Reset / Clear Conversation
 */
export async function clearAiConversationAction(storeId: string) {
  const { user } = await verifyStoreOwnership(storeId);
  const supabase = await createClient();

  await supabase
    .from('store_ai_conversations')
    .delete()
    .eq('store_id', storeId)
    .eq('merchant_id', user.id);

  return { success: true };
}
