import { enDictionary } from '../src/lib/i18n/translations/en.ts';
import { hiDictionary } from '../src/lib/i18n/translations/hi.ts';
import { BasicFallbackDesignProvider } from '../src/lib/ai/BasicFallbackDesignProvider.ts';
import { validateStorefrontConfig } from '../src/lib/customizer/schema.ts';

console.log('====================================================');
console.log('🧪 DUKAANOS M6 TEST SUITE: AI DESIGNER & HINDI I18N');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// ----------------------------------------------------------------------------
// TEST 1: Complete i18n Dictionary Parity & Coverage
// ----------------------------------------------------------------------------
console.log('Test Group 1: i18n Translation Dictionary Parity');

const enKeys = Object.keys(enDictionary);
const hiKeys = Object.keys(hiDictionary);

assert(enKeys.length > 0, `English dictionary contains ${enKeys.length} keys`);
assert(hiKeys.length > 0, `Hindi dictionary contains ${hiKeys.length} keys`);
assert(enKeys.length === hiKeys.length, `Key counts match exactly: EN (${enKeys.length}) === HI (${hiKeys.length})`);

const missingInHindi = enKeys.filter((k) => !(k in hiDictionary));
assert(missingInHindi.length === 0, `Zero missing keys in Hindi dictionary (found ${missingInHindi.length})`);

const missingInEnglish = hiKeys.filter((k) => !(k in enDictionary));
assert(missingInEnglish.length === 0, `Zero missing keys in English dictionary (found ${missingInEnglish.length})`);

let emptyValues = 0;
for (const key of enKeys) {
  if (!enDictionary[key]?.trim() || !hiDictionary[key]?.trim()) {
    emptyValues++;
  }
}
assert(emptyValues === 0, `Zero empty translation strings across all keys`);

// ----------------------------------------------------------------------------
// TEST 2: BasicFallbackDesignProvider (Deterministic Local Engine)
// ----------------------------------------------------------------------------
console.log('\nTest Group 2: BasicFallbackDesignProvider Engine');

const provider = new BasicFallbackDesignProvider();

const mockStore = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Jaipur Handloom & Sarees',
  slug: 'jaipur-handloom',
  category: 'fashion',
  whatsapp_number: '+919876543210',
  city: 'Jaipur',
  state: 'Rajasthan',
  is_published: true,
  created_at: new Date().toISOString(),
};

const mockCatalog = {
  products: [
    { name: 'Pure Silk Bandhani Saree', price: 4500, in_stock: true, category: 'Sarees' },
    { name: 'Handcrafted Bridal Lehenga', price: 18500, in_stock: true, category: 'Bridal' },
  ],
  categories: ['Sarees', 'Bridal', 'Dupattas'],
};

// 2a: Business understanding
console.log('  Testing business understanding extraction...');
const understandResult = await provider.understandBusiness(
  'I run a premium ethnic wear boutique in Jaipur selling handcrafted sarees and lehengas. I want a royal heritage luxury Indian look.',
  { businessName: mockStore.name, category: mockStore.category }
);

assert(understandResult.isUnderstood, 'Prompt successfully understood');
const profile = understandResult.profile;
assert(!!profile, 'Profile object returned');
assert(profile.businessName === 'Jaipur Handloom & Sarees', `Extracted business name correctly (${profile.businessName})`);
assert(profile.category === 'clothing' || profile.category === 'fashion', `Extracted category correctly (${profile.category})`);
assert(profile.pricePositioning === 'luxury', `Understood luxury price positioning correctly (${profile.pricePositioning})`);

// 2b: Concept Brainstorming
console.log('  Testing creative concepts generation (3 distinct concepts)...');
const concepts = await provider.brainstormConcepts(profile, mockCatalog);

assert(Array.isArray(concepts), 'Concepts is an array');
assert(concepts.length === 3, 'Generated exactly 3 differentiated design concepts');
assert(concepts[0].name !== concepts[1].name, 'Concept 1 and 2 are differentiated');
assert(concepts[0].colorPalette.primary !== concepts[1].colorPalette.primary, 'Distinct color palettes across concepts');

// 2c: Full StorefrontConfig Generation & Zod Validation
console.log('  Testing full StorefrontConfig generation and strict Zod validation...');
for (const concept of concepts) {
  const config = await provider.synthesizeStorefrontConfig(concept, profile, mockCatalog);
  const validation = validateStorefrontConfig(config);
  assert(validation.success, `Concept "${concept.name}" produces 100% Zod-valid StorefrontConfig`);
  
  // Verify M5 invariants
  const headerCount = config.sections.filter((s) => s.type === 'header' && s.enabled).length;
  const footerCount = config.sections.filter((s) => s.type === 'footer' && s.enabled).length;
  const productGridCount = config.sections.filter((s) => s.type === 'product_grid' && s.enabled).length;
  assert(headerCount === 1, `Contains exactly 1 enabled header`);
  assert(footerCount === 1, `Contains exactly 1 enabled footer`);
  assert(productGridCount >= 1, `Contains at least 1 enabled product grid`);
}

// ----------------------------------------------------------------------------
// TEST 3: Conversational Edits & Patch Engine Safety
// ----------------------------------------------------------------------------
console.log('\nTest Group 3: Conversational Edits & Safety Constraints');

const baseConfig = await provider.synthesizeStorefrontConfig(concepts[0], profile, mockCatalog);

// 3a: Font family change
console.log('  Testing conversational edit: "change font to Playfair"...');
const edit1Result = await provider.refineStorefrontConfig(baseConfig, 'Please change the font to Playfair and make it elegant', mockCatalog);
const edit1 = edit1Result.updatedConfig;
assert(edit1.theme.fontFamily === 'Playfair', `Font successfully updated to Playfair (${edit1.theme.fontFamily})`);
assert(validateStorefrontConfig(edit1).success, 'Edited config passes Zod validation');

// 3b: Button style change
console.log('  Testing conversational edit: "make buttons pill shaped"...');
const edit2Result = await provider.refineStorefrontConfig(edit1, 'make all buttons pill shaped', mockCatalog);
const edit2 = edit2Result.updatedConfig;
assert(edit2.theme.buttonStyle === 'pill', `Button style successfully updated to pill (${edit2.theme.buttonStyle})`);
assert(edit2.theme.fontFamily === 'Playfair', 'Font family was preserved across subsequent edit');
assert(validateStorefrontConfig(edit2).success, 'Edited config passes Zod validation');

// 3c: Theme color change
console.log('  Testing conversational edit: "change primary color to deep maroon"...');
const edit3Result = await provider.refineStorefrontConfig(edit2, 'use deep maroon for primary color', mockCatalog);
const edit3 = edit3Result.updatedConfig;
assert(edit3.theme.primaryColor === '#800020' || edit3.theme.primaryColor === '#800000', `Primary color updated to deep maroon (${edit3.theme.primaryColor})`);
assert(edit3.theme.buttonStyle === 'pill', 'Button style preserved');
assert(validateStorefrontConfig(edit3).success, 'Edited config passes Zod validation');

console.log('\n====================================================');
console.log(`🎉 ALL TESTS PASSED! (${passedTests}/${totalTests} assertions passed)`);
console.log('====================================================\n');
