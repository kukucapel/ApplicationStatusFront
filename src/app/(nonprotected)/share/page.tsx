'use client';

import HeaderShare from '@/components/share/HeaderShare';
import ShareClient from '@/components/share/ShareClient';
export default function SharePage() {
    return (
        <>
            <HeaderShare />
            <main className="max-w-[56rem] ml-auto mr-auto p-10">
                <ShareClient />
            </main>
        </>
    );
}
