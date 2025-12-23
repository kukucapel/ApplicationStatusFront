'use client';

import ApplicationsList from './ApplicationsList';
import CounterApplication from './CounterApplication';
import { useEffect, useState } from 'react';
import { useAppWS } from '@/lib/useAppWS';
import { Application } from '@/dtos/ApplicationDto';
import { ApplicationModal } from '../modals/ApplicationModal';
import FilterSideBar from './FilterSideBar';

export function getCookie(name: string): string | null {
    const match = document.cookie.match(
        new RegExp('(^| )' + name + '=([^;]+)')
    );
    return match ? decodeURIComponent(match[2]) : null;
}

export default function BodyDashboard() {
    const [token, setToken] = useState<string | null>(null);
    const [showApplicationModal, setShowApplicationModal] =
        useState<Application | null>(null);

    function onClickApplicationModal(app: Application) {
        setShowApplicationModal(app);
    }

    useEffect(() => {
        const jwt = getCookie('token');
        setToken(jwt);
    }, []);

    const { connected, applications } = useAppWS(token);
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
                <ApplicationsList
                    applications={applications}
                    connected={connected}
                    onClickApplicationModal={onClickApplicationModal}
                />
            </div>

            {showApplicationModal !== null && (
                <ApplicationModal
                    application={showApplicationModal}
                    onClose={() => setShowApplicationModal(null)}
                />
            )}
        </>
    );
}
