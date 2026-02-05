'use client';

import ModalAlert from '@/components/modals/ModalAlert';
import HeaderShare from '@/components/share/HeaderShare';
import ShareClient from '@/components/share/ShareClient';
import { Suspense, useState } from 'react';
export default function SharePage() {
    const [alert, setAlert] = useState<boolean>(true);

    return (
        <Suspense
            fallback={
                <div className="mt-20  flex items-center justify-center bg-white">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                </div>
            }
        >
            <HeaderShare />
            <main className="max-w-[56rem] ml-auto mr-auto p-10">
                <ShareClient />
            </main>
            {/* {alert && (
                <ModalAlert
                    onClose={() => setAlert(false)}
                    subTitle="Внимание, это тестовая версия системы"
                />
            )} */}
        </Suspense>
    );
}
