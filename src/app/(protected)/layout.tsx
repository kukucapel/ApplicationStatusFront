'use client';

import Header from '@/components/dashboard/Header';
import { useState } from 'react';
import CreateApplicationModal from '@/components/modals/CreateApplicationModal';
import { createApplication } from '@/lib/createApplication';
import { UserProvider } from '@/contexts/UserContext';

export default function ProtectedLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    const [showCreateModal, setShowCreateModal] = useState(false);

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
