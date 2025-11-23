'use client';

import { useSession } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';

import { LogoLoading } from 'src/shared/components/loading';
import AvatarMenu from 'src/shared/components/user-avatar/AvatarMenu';

const SITE = process.env.NEXT_PUBLIC_SITE_NAME;

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  if (status === 'loading') return <LogoLoading />;
  if (!session && pathname !== '/') redirect('/');
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-xl">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mx-4">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-xl font-bold text-gray-900 ">{SITE}</h1>
            <AvatarMenu namePosition="left" session={session} />
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
