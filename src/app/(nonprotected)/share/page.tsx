'use client';

import HeaderShare from '@/components/share/HeaderShare';
import ShareClient from '@/components/share/ShareClient';
import { Suspense } from 'react';
export default function SharePage() {
    return (
        <Suspense fallback={<div>Загрузка...</div>}>
            <HeaderShare />
            <main className="max-w-[56rem] ml-auto mr-auto p-10">
                <ShareClient />
            </main>
        </Suspense>
    );
}
