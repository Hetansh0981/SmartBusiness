import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import OnboardingForm from './OnboardingForm';
import Navbar from '@/components/Navbar';

export const instant = false;

export const metadata: Metadata = {
  title: 'Set Up Your Store — DukaanOS',
  description: 'Enter your business details to launch your digital store.',
};

export default async function OnboardingPage() {
  await connection();

  const supabase = await createClient();

  // Defense in depth: Verify session directly on server
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // If merchant already created a store, take them straight to dashboard
  const { data: existingStore } = await supabase
    .from('stores')
    .select('id')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (existingStore) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 sm:py-10 flex items-center justify-center">
        <OnboardingForm />
      </main>
    </div>
  );
}
