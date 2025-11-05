'use client';

import ApplicationsList from './ApplicationsList';
import FilterSideBar from './FilterSideBar';
import CounterApplication from './CounterApplication';
import { useEffect, useState } from 'react';
import { Application, useAppWS } from '@/lib/useAppWS';
import CreateApplicationModal from '../modals/CreateApplicationModal';
import { createApplication } from '@/lib/createApplication';
import { ApplicationModal } from '../modals/ApplicationModal';

interface BodyDashboardProps {
    showCreateModal: boolean;
    onCloseCreateModal: () => void;
}

export function getCookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
}

export default function BodyDashboard({
    showCreateModal,
    onCloseCreateModal,
}: BodyDashboardProps) {
    const [token, setToken] = useState<string | null>(null);
    const [showApplicationModal, setShowApplicationModal] =
        useState<Application | null>(null);

    function onClickApplicationModal(app: Application) {
        console.log(app);
        setShowApplicationModal(app);
    }

    useEffect(() => {
        const jwt = getCookie('token');
        setToken(jwt);
    }, []);

    const { connected, applications, send } = useAppWS(token);
    const stats = {
        total: applications.length,
        new: applications.filter((app) => app.status === 'new').length,
        in_progress: applications.filter((app) => app.status === 'in_progress')
            .length,
        completed: applications.filter((app) => app.status === 'completed')
            .length,
        closed: applications.filter((app) => app.status === 'closed').length,
    };

    return (
        <>
            <CounterApplication stats={stats} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <FilterSideBar />
                    <ApplicationsList
                        applications={applications}
                        connected={connected}
                        onClickApplicationModal={onClickApplicationModal}
                    />
                </div>
            </div>

            {showCreateModal && (
                <CreateApplicationModal
                    onClose={onCloseCreateModal}
                    handleSubmit={createApplication}
                />
            )}
            {showApplicationModal !== null && (
                <ApplicationModal
                    application={showApplicationModal}
                    onClose={() => setShowApplicationModal(null)}
                />
            )}
        </>
    );
}
