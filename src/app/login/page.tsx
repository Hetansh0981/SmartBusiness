import { Suspense } from 'react';
import type { Metadata } from 'next';
import LoginForm from './LoginForm';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Log In — DukaanOS',
  description: 'Access your DukaanOS merchant dashboard to manage orders and your storefront.',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col selection:bg-[#d97706] selection:text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <Suspense fallback={<div className="text-sm text-[#6c6a64]">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
    </div>
  );
}
