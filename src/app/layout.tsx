import type { Metadata } from 'next';
import './globals.css';

import AuthProvicer from 'src/shared/providers/AuthProvider';

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
      </body>
    </html>
  );
}
