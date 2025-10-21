'use client';

import { useState } from 'react';

export default function ApplicationsList() {
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState('all');
    const [loading, setLoading] = useState(false);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    type StatusKey = 'new' | 'in_progress' | 'completed' | 'closed';

    const getStatusText = (status: string) => {
        const statusMap: Record<StatusKey, string> = {
            new: 'Необработанная',
            in_progress: 'В работе',
            completed: 'Обработана',
            closed: 'Закрыта',
        };
        return (statusMap as Record<string, string>)[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: Record<StatusKey, string> = {
            new: 'bg-red-100 text-red-700 border-red-200',
            in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
            completed: 'bg-green-100 text-green-700 border-green-200',
            closed: 'bg-gray-100 text-gray-700 border-gray-200',
        };
        return (
            (colorMap as Record<string, string>)[status] ||
            'bg-gray-100 text-gray-700'
        );
    };

    //   const stats = {
    //     total: applications.length,
    //     new: applications.filter((app:) => app.status === 'new').length,
    //     in_progress: applications.filter((app) => app.status === 'in_progress').length,
    //     completed: applications.filter((app) => app.status === 'completed').length,
    //     closed: applications.filter((app) => app.status === 'closed').length,
    //   };

    return (
        <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-6 pt-4">
                    <div className="flex gap-2 overflow-x-auto">
                        <button
                            data-testid="tab-all"
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                activeTab === 'all'
                                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Все заявки
                            {/* Все заявки ({stats.total}) */}
                        </button>
                        <button
                            data-testid="tab-new"
                            onClick={() => setActiveTab('new')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                activeTab === 'new'
                                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Поступившие
                            {/* Поступившие ({stats.new}) */}
                        </button>
                        <button
                            data-testid="tab-completed"
                            onClick={() => setActiveTab('completed')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                activeTab === 'completed'
                                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Обработаные
                            {/* Обработанные ({stats.completed}) */}
                        </button>
                        <button
                            data-testid="tab-closed"
                            onClick={() => setActiveTab('closed')}
                            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                                activeTab === 'closed'
                                    ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                            }`}
                        >
                            Закрытые
                            {/* Закрытые ({stats.closed}) */}
                        </button>
                    </div>
                </div>

                {/* Applications */}
                <div className="p-6">
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
                            {/* {filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        data-testid={`application-card-${app.id}`}
                        onClick={() => setSelectedApp(app)}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`status-indicator status-${app.status}`}></span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                  getStatusColor(app.status)
                                }`}
                              >
                                {getStatusText(app.status)}
                              </span>
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {app.full_name}
                            </h3>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-medium">Тема:</span> {app.subject}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {app.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-xs text-gray-500">
                              {new Date(app.created_at).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="text-xs text-blue-600 font-medium mt-1">
                              {app.recipient}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))} */}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
