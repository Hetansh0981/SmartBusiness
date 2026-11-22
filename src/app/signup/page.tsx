import type { Metadata } from 'next';
import SignUpForm from './SignUpForm';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Sign Up — DukaanOS',
  description: 'Create your merchant account on DukaanOS and launch your digital store in 5 minutes.',
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#faf9f5] flex flex-col selection:bg-[#d97706] selection:text-white">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <SignUpForm />
      </main>
    </div>
  );
}
