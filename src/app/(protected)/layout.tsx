'use client';

import Header from '@/components/ui/Header';

import { useUser } from '@/contexts/UserContext';

export default function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { loading } = useUser();

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Header />
            {children}
        </>
    );
}
