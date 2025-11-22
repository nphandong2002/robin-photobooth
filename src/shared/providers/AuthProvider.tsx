'use client';

import { SessionProvider } from 'next-auth/react';

function AuthProvicer({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export default AuthProvicer;
