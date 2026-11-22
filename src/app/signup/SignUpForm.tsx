'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signUpAction, type AuthActionResult } from '@/app/auth/actions';
import { Button, Input, Card, CardContent } from '@/components/ui';

export default function SignUpForm() {
  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    signUpAction,
    null
  );

  if (state?.requiresEmailConfirmation) {
    return (
      <Card className="max-w-md w-full mx-auto">
        <CardContent className="text-center py-10">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Check your email</h2>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
            We sent a verification link to your email address. Please click the link to confirm your account and start setting up your store.
          </p>
          <div className="mt-6 pt-6 border-t border-slate-100">
            <Link href="/login">
              <Button variant="secondary" className="w-full">
                Back to Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md w-full mx-auto shadow-md border-[#e6dfd8]">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white items-center justify-center font-bold text-xl mb-3 shadow-xs">
            D
          </div>
          <h1 className="text-2xl font-display text-[#141413] tracking-tight">
            Create your DukaanOS account
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6c6a64] font-body">
            Join thousands of Indian shop owners selling online
          </p>
        </div>

        {state?.error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0 text-rose-500"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="sharma.sweets@gmail.com"
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="At least 6 characters"
            required
            autoComplete="new-password"
            helperText="Minimum 6 characters for security."
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isPending}
          >
            Create Store Account &rarr;
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#e6dfd8] text-center">
          <p className="text-xs text-[#6c6a64]">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#d97706] hover:text-[#b45309] underline underline-offset-2 transition"
            >
              Log in here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
