'use client';

import { Suspense } from 'react';
import ShareClient from './ShareClient';

function Loading() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="animate-pulse space-y-3">
        <div className="h-8 bg-gray-200 rounded w-3/5" />
        <div className="h-5 bg-gray-200 rounded w-2/5" />
        <div className="h-20 bg-gray-100 rounded" />
      </div>
    </main>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ShareClient />
    </Suspense>
  );
}
