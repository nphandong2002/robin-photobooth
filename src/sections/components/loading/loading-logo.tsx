'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function LogoLoading() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, [setMounted]);

  if (!mounted) {
    return null;
  }
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center">
      <Image src="/logo.png" alt="Logo" width={120} height={120} className="animate-pulse duration-700" />
    </div>
  );
}
