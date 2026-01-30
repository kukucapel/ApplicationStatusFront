'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';
import Select from 'react-select';
import { User } from '@/contexts/UserContext';

interface FilterSideBarProps {
    filters: { status: string; toPosition: string; search: string };
    setFilters: (newState: {
        status: string;
        toPosition: string;
        search: string;
    }) => void;
    countApp: number;
    setActiveTab: (newState: string) => void;
    uniqueToPosition: string[];
    setCreateModal: () => void;
    user: User | null;
}

export default function FilterSideBar({
    filters,
    setFilters,
    setActiveTab,
    uniqueToPosition,
    countApp,
    user,
    setCreateModal,
}: FilterSideBarProps) {
    const selectOptions = [
        { value: 'all', label: 'Все руководители' },
        ...uniqueToPosition.map((p) => ({
            value: p,
            label: p,
        })),
    ];
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
                        <label className="select-none mb-2 block text-sm font-medium text-gray-700">
                            К кому на приём
                        </label>

                        <Select
                            inputId="filter-recipient-select"
                            options={selectOptions}
                            value={selectOptions.find(
                                (option) => option.value === filters.toPosition,
                            )}
                            onChange={(option) => {
                                if (!option) return;
                                setFilters({
                                    ...filters,
                                    toPosition: option.value,
                                });
                            }}
                            placeholder="Все руководители"
                            className="mb-2"
                            classNamePrefix="react-select"
                        />

                        {(filters.status !== 'all' ||
                            filters.toPosition !== 'all' ||
                            filters.search !== '') && (
                            <span className="select-none text-sm font-medium">
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
                        filters.toPosition !== 'all' ||
                        filters.search) && (
                        <Button
                            onClick={() =>
                                setFilters({
                                    status: 'all',
                                    toPosition: 'all',
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
            {user?.role === 'admin' && user?.login === 'admin@example.com' && (
                <Button
                    styleColor="blue"
                    onClick={setCreateModal}
                    className="w-[100%] py-2"
                >
                    Создать заявку
                </Button>
            )}
        </aside>
    );
}
