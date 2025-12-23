'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

interface FilterSideBarProps {
    filters: { status: string; toSend: string; search: string };
    setFilters: (newState: {
        status: string;
        toSend: string;
        search: string;
    }) => void;
    countApp: number;
    setActiveTab: (newState: string) => void;
    uniqueToSend: string[];
    setCreateModal: () => void;
}

export default function FilterSideBar({
    filters,
    setFilters,
    setActiveTab,
    uniqueToSend,
    countApp,
    setCreateModal,
}: FilterSideBarProps) {
    return (
        <aside className="lg:w-64 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-900 select-none">
                        Фильтры
                    </h3>
                </div>

                <div className="space-y-4">
                    {/* <div>
                        <label className="select-none text-sm font-medium text-gray-700 mb-2 block">
                            Статус
                        </label>
                        <select
                            data-testid="filter-status-select"
                            value={filters.status}
                            onChange={(e) => {
                                setActiveTab('');
                                setFilters({
                                    ...filters,
                                    status: e.target.value,
                                });
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Все статусы</option>
                            <option value="new">Необработанная</option>
                            <option value="in_progress">В работе</option>
                            <option value="completed">Обработана</option>
                            <option value="closed">Закрыта</option>
                        </select>
                    </div> */}

                    <div>
                        <label className="select-none text-sm font-medium text-gray-700 mb-2 block">
                            Руководитель
                        </label>
                        <select
                            data-testid="filter-recipient-select"
                            value={filters.toSend}
                            onChange={(e) => {
                                // setActiveTab('');
                                setFilters({
                                    ...filters,
                                    toSend: e.target.value,
                                });
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none mb-2 focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Все руководители</option>
                            {uniqueToSend.map((recipient) => (
                                <option key={recipient} value={recipient}>
                                    {recipient}
                                </option>
                            ))}
                        </select>
                        {(filters.status !== 'all' ||
                            filters.toSend !== 'all' ||
                            filters.search !== '') && (
                            <span className="select-none text-sm font-medium ">
                                Найдено: {countApp}
                            </span>
                        )}
                    </div>

                    {/* <div>
                        <label className="select-none text-sm font-medium text-gray-700 mb-2 block">
                            Поиск по теме
                        </label>
                        <input
                            data-testid="filter-search-input"
                            type="text"
                            value={filters.search}
                            onChange={(e) => {
                                setActiveTab('');
                                setFilters({
                                    ...filters,
                                    search: e.target.value,
                                });
                            }}
                            placeholder="Тема..."
                            className="w-full border mb-1 border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                       
                    </div> */}

                    {(filters.status !== 'all' ||
                        filters.toSend !== 'all' ||
                        filters.search) && (
                        <Button
                            onClick={() =>
                                setFilters({
                                    status: 'all',
                                    toSend: 'all',
                                    search: '',
                                })
                            }
                            styleColor="blue"
                            className="w-full text-sm py-2"
                        >
                            Сбросить фильтры
                        </Button>
                    )}
                </div>
            </div>
            <Button
                styleColor="blue"
                onClick={setCreateModal}
                className="w-[100%] py-2"
            >
                Создать заявку
            </Button>
        </aside>
    );
}
