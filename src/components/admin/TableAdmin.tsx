'use client';

import { Edit, Search } from 'lucide-react';
import { useState } from 'react';
import Table from '../ui/Table';
import TableEmployees from './TableEmployees';

interface TableAdminProps {
    page: number;
    MENU: [string, string][];
}

export default function TableAdmin({ page, MENU }: TableAdminProps) {
    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(false);

    return (
        <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-200">
                <div className="flex items-end justify-between mb-4 px-6">
                    <h2 className="text-2xl font-bold  text-gray-800">
                        {MENU[page][0]}
                    </h2>
                    <div className="flex gap-4 mr-2">
                        <div
                            className={` p-1 rounded-md duration-150 cursor-pointer ${
                                searchMode
                                    ? 'bg-blue-600 border border-blue-600 text-white'
                                    : 'bg-white border border-gray-300 hover:bg-gray-100 '
                            }`}
                            onClick={() => setSearchMode((prev) => !prev)}
                        >
                            <Search className="w-5" />
                        </div>

                        <div
                            className={`p-1 border rounded-md duration-150 cursor-pointer ${
                                editMode
                                    ? 'bg-blue-600 border border-blue-600 text-white'
                                    : 'bg-white border border-gray-300 hover:bg-gray-100 '
                            }`}
                            onClick={() => setEditMode((prev) => !prev)}
                        >
                            <Edit className="w-5" />
                        </div>
                    </div>
                </div>

                <hr className="border-gray-300 mx-6 mb-6" />
                {page === 0 ? (
                    <TableEmployees
                        searchMode={searchMode}
                        editMode={editMode}
                        page={MENU[page]}
                    />
                ) : (
                    ''
                )}
            </div>
        </main>
    );
}
