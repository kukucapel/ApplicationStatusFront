'use client';

import BodyDashboard from '@/components/dashboard/BodyDashboard';
import CounterApplication from '@/components/dashboard/CounterApplication';
import Header from '@/components/dashboard/Header';
import { useState } from 'react';
import CreateApplicationModal from '@/components/modals/CreateApplicationModal';
import { createApplication } from '@/lib/createApplication';

export default function Dashboard() {
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <>
            <Header onClickModal={() => setShowCreateModal(true)} />
            <CounterApplication />
            <BodyDashboard />
            {showCreateModal && (
                <CreateApplicationModal
                    onClose={() => setShowCreateModal(false)}
                    handleSubmit={createApplication}
                />
            )}
        </>
    );
}
