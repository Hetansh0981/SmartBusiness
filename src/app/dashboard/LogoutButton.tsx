'use client';

import { useTransition } from 'react';
import { logoutAction } from '@/app/auth/actions';
import { Button } from '@/components/ui';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction();
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      isLoading={isPending}
      className="text-[#6b7280] hover:text-[#dc2626] hover:bg-[#fef2f2]"
    >
      <LogOut className="w-3.5 h-3.5 mr-1" />
      Sign Out
    </Button>
  );
}
