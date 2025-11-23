import type { Metadata } from 'next';
import './globals.css';

import AuthProvicer from 'src/shared/providers/AuthProvider';
import { Toaster } from 'src/shared/components/ui/sonner';

const SITE = process.env.NEXT_PUBLIC_SITE_NAME;
export const metadata: Metadata = {
  title: { default: SITE || '', template: '%s | ' + SITE },
  description: 'Chụp ảnh cùng bạn bè',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvicer>{children}</AuthProvicer>
        <Toaster />
      </body>
    </html>
  );
}
