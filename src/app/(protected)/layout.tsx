'use client';

import Header from '@/components/dashboard/Header';
import { useState } from 'react';
import CreateApplicationModal from '@/components/modals/CreateApplicationModal';
import { createApplication } from '@/lib/createApplication';
import { useUser } from '@/contexts/UserContext';

export default function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const { loading } = useUser();
    const [showCreateModal, setShowCreateModal] = useState(false);

    if (loading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <Header handleClickModal={() => setShowCreateModal(true)} />
            {children}
            {showCreateModal && (
                <CreateApplicationModal
                    onClose={() => setShowCreateModal(false)}
                    handleSubmit={createApplication}
                />
            )}
        </>
    );
}
