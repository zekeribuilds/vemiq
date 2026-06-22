'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MobileLogbookPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/logbook');
  }, [router]);

  return null;
}
