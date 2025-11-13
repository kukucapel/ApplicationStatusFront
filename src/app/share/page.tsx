// app/share/page.tsx
'use client';

import { Suspense } from 'react';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import ShareClient from './ShareClient';
import Header from '@/components/header';

export default function SharePage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <Header />
            <ShareClient />
        </Suspense>
    );
}
