'use client';

import { useEffect, useState } from 'react';
import { Application } from '@/dtos/ApplicationDto';
import Button from '../ui/Button';
import { CalendarArrowDown, CalendarArrowUp } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';
import formatDate from '@/lib/formatDate';
import FilterSideBar from './FilterSideBar';
import CreateApplicationModal from '../modals/CreateApplicationModal';

interface ApplicationsListProps {
    applications: any[];
    connected: boolean;
    onClickApplicationModal: (app: Application) => void;
}

export default function ApplicationsList({
    applications,
    connected,
    onClickApplicationModal,
}: ApplicationsListProps) {
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(true);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        toPosition: 'all',
        search: '',
    });
    const [sortByNewest, setSortByNewest] = useState<boolean>(true);
    const { user } = useUser();
    const [createModal, setCreateModal] = useState<boolean>(false);

    const handleSubmitCreateModal = () => {};

    // console.log(applications);

    useEffect(() => {
        setLoading(!connected);
        let filtered: Application[] = [...applications];

        // Filter by tab
        if (activeTab === 'new') {
            filtered = filtered.filter((app) => app.status === 'new');
        } else if (activeTab === 'closed') {
            filtered = filtered.filter((app) => app.status === 'closed');
        } else if (activeTab === 'in_progress') {
            filtered = filtered.filter((app) => app.status === 'in_progress');
        }

        // Filter by sideBar
        if (filters.status !== 'all') {
            filtered = filtered.filter((app) => app.status === filters.status);
        }

        // Filter by recipient
        if (filters.toPosition !== 'all') {
            filtered = filtered.filter(
                (app: Application) =>
                    app.toPosition.employee.fio === filters.toPosition,
            );
        }
        // Filter by time
        filtered.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return sortByNewest ? dateB - dateA : dateA - dateB;
        });

        setFilteredApplications(filtered as any);
    }, [applications, activeTab, connected, sortByNewest, filters]);

    type StatusKey = 'new' | 'in_progress' | 'closed';

    const getStatusText = (status: string) => {
        const statusMap: Record<StatusKey, string> = {
            new: 'Необработанная',
            in_progress: 'В работе',
            closed: 'Закрыта',
        };
        return (statusMap as Record<string, string>)[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<StatusKey, string> = {
            new: 'bg-red-100 text-red-700 border-red-200',
            in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            closed: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return (
            (colorMap as Record<string, string>)[status] ||
            'bg-gray-100 text-gray-700'
        );
    };

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
        <div className="flex flex-col lg:flex-row gap-6">
            <FilterSideBar
                user={user}
                setCreateModal={() => setCreateModal(true)}
                uniqueToPosition={[
                    ...new Set(
                        applications.map(
                            (app: Application) => app.toPosition.employee.fio,
                        ),
                    ),
                ]}
                filters={filters}
                countApp={filteredApplications.length}
                setFilters={setFilters}
                setActiveTab={setActiveTab}
            />
            <main className="flex-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                    {/* Tabs */}
                    <div className=" hidden border-b sm:flex items-center justify-between border-gray-200 px-6 pt-4">
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                data-testid="tab-all"
                                onClick={() => {
                                    // setFilters({
                                    //     ...filters,
                                    //     status: 'all',
                                    //     toSend: 'all',
                                    // });
                                    setActiveTab('all');
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                    activeTab === 'all'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                        : 'cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                Все заявки ({stats.total})
                            </button>
                            <button
                                data-testid="tab-new"
                                onClick={() => {
                                    // setFilters({
                                    //     ...filters,
                                    //     status: 'all',
                                    //     toSend: 'all',
                                    // });
                                    setActiveTab('new');
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                    activeTab === 'new'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                        : 'cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                Поступившие ({stats.new})
                            </button>
                            <button
                                data-testid="tab-in_progress"
                                onClick={() => {
                                    // setFilters({
                                    //     ...filters,
                                    //     status: 'all',
                                    //     toSend: 'all',
                                    // });
                                    setActiveTab('in_progress');
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                    activeTab === 'in_progress'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                        : 'cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                В работе ({stats.in_progress})
                            </button>
                            {/* <button
                                data-testid="tab-completed"
                                onClick={() => {
                                    // setFilters({
                                    //     ...filters,
                                    //     status: 'all',
                                    //     toSend: 'all',
                                    // });
                                    setActiveTab('completed');
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                    activeTab === 'completed'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                        : 'cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                Обработанные ({stats.completed})
                            </button> */}
                            <button
                                data-testid="tab-closed"
                                onClick={() => {
                                    // setFilters({
                                    //     ...filters,
                                    //     status: 'all',
                                    //     toSend: 'all',
                                    // });
                                    setActiveTab('closed');
                                }}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                    activeTab === 'closed'
                                        ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                        : 'cursor-pointer text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                Закрытые ({stats.closed})
                            </button>
                        </div>
                        {filteredApplications.length !== 1 &&
                            filteredApplications.length !== 0 && (
                                <div
                                    className="cursor-pointer"
                                    onClick={() =>
                                        setSortByNewest((prev) => !prev)
                                    }
                                >
                                    {sortByNewest ? (
                                        <CalendarArrowDown className="text-gray-700 w-5 h-5 hover:scale-110 transition-all duration-150" />
                                    ) : (
                                        <CalendarArrowUp className="text-gray-700 w-5 h-5 hover:scale-110 transition-all duration-150" />
                                    )}
                                </div>
                            )}
                    </div>

                    {/* Applications */}
                    <div className="p-6 select-none">
                        {loading ? (
                            <div className="text-center py-12 text-gray-500">
                                Загрузка заявок...
                            </div>
                        ) : filteredApplications.length === 0 ? (
                            <div className="text-center py-12">
                                <svg
                                    className="w-16 h-16 text-gray-300 mx-auto mb-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                                <p className="text-gray-500">
                                    Нет заявок для отображения
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {filteredApplications.map(
                                    (app: Application, index: number) => (
                                        <div
                                            key={app.id}
                                            data-testid={`application-card-${app.id}`}
                                            onClick={() =>
                                                onClickApplicationModal(app)
                                            }
                                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="sm:flex items-center gap-2 mb-2">
                                                        <span
                                                            className={`status-indicator status-${app.status}`}
                                                        ></span>
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                                app.status,
                                                            )}`}
                                                        >
                                                            {getStatusText(
                                                                app.status,
                                                            )}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        <span className="font-medium">
                                                            Тема:
                                                        </span>{' '}
                                                        {app.theme}
                                                    </p>
                                                    <p className="text-sm text-gray-600 mb-1">
                                                        <span className="font-medium">
                                                            К кому приём:
                                                        </span>{' '}
                                                        {
                                                            app.toPosition
                                                                .employee.fio
                                                        }
                                                    </p>
                                                    <p className="text-sm text-gray-500 line-clamp-2">
                                                        {app.question}
                                                    </p>
                                                </div>

                                                <div className="hidden sm:flex text-right flex-shrink-0">
                                                    <div className="text-xs md:text-sm text-gray-500">
                                                        {formatDate(
                                                            app.createdAt,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {createModal && (
                    <CreateApplicationModal
                        onClose={() => setCreateModal(false)}
                    />
                )}
            </main>
        </div>
    );
}
