'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { loginAction, type AuthActionResult } from '@/app/auth/actions';
import { Button, Input, Card, CardContent } from '@/components/ui';

export default function LoginForm() {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const [state, formAction, isPending] = useActionState<AuthActionResult | null, FormData>(
    loginAction,
    null
  );

  const displayError = state?.error || urlError;

  return (
    <Card className="max-w-md w-full mx-auto shadow-md border-[#e6dfd8]">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <div className="inline-flex h-11 w-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-white items-center justify-center font-bold text-xl mb-3 shadow-xs">
            D
          </div>
          <h1 className="text-2xl font-display text-[#141413] tracking-tight">
            Log in to your store
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-[#6c6a64] font-body">
            Welcome back! Enter your merchant credentials.
          </p>
        </div>

        {displayError && (
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
            <span>{displayError}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            placeholder="merchant@example.com"
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full mt-2"
            isLoading={isPending}
          >
            Sign In &rarr;
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#e6dfd8] text-center">
          <p className="text-xs text-[#6c6a64]">
            Don&apos;t have a store account yet?{' '}
            <Link
              href="/signup"
              className="font-semibold text-[#d97706] hover:text-[#b45309] underline underline-offset-2 transition"
            >
              Create one here
            </Link>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
