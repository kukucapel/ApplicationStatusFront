'use client';

import { Filter } from 'lucide-react';
import { useState } from 'react';
import Button from '../ui/Button';

export default function FilterSideBar() {
    const [filters, setFilters] = useState({
        status: 'all',
        recipient: 'all',
        search: '',
    });

    return (
        <aside className="lg:w-64 space-y-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-4 h-4 text-blue-600" />
                    <h3 className="font-semibold text-gray-900">Фильтры</h3>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Статус
                        </label>
                        <select
                            data-testid="filter-status-select"
                            value={filters.status}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    status: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Все статусы</option>
                            <option value="new">Необработанная</option>
                            <option value="in_progress">В работе</option>
                            <option value="completed">Обработана</option>
                            <option value="closed">Закрыта</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Руководитель
                        </label>
                        <select
                            data-testid="filter-recipient-select"
                            value={filters.recipient}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    recipient: e.target.value,
                                })
                            }
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">Все руководители</option>
                            {/* {uniqueRecipients.map((recipient) => (
                      <option key={recipient} value={recipient}>
                        {recipient}
                      </option>
                    ))} */}
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Поиск
                        </label>
                        <input
                            data-testid="filter-search-input"
                            type="text"
                            value={filters.search}
                            onChange={(e) =>
                                setFilters({
                                    ...filters,
                                    search: e.target.value,
                                })
                            }
                            placeholder="ФИО или тема..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {(filters.status !== 'all' ||
                        filters.recipient !== 'all' ||
                        filters.search) && (
                        <Button
                            onClick={() =>
                                setFilters({
                                    status: 'all',
                                    recipient: 'all',
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
        </aside>
    );
}
