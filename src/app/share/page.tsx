// app/share/page.tsx
'use client';

import { Suspense } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ShareClient from './ShareClient';

export default function SharePage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ShareClient />
    </Suspense>
  );
}
