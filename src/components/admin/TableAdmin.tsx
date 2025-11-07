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
    const [searchModeActive, setSearchModeActive] = useState<boolean>(false);
    const [editModeActive, setEditModeActive] = useState<boolean>(false);
    console.log(searchModeActive);
    return (
        <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-200">
                <div className="flex items-end justify-between mb-4 px-6">
                    <h2 className="text-2xl font-bold  text-gray-800">
                        {MENU[page][0]}
                    </h2>
                    <div className="flex gap-4 mr-2">
                        <Search
                            className="w-5 cursor-pointer"
                            onClick={() => setSearchModeActive((prev) => !prev)}
                        />
                        <Edit className="w-5" />
                    </div>
                </div>

                <hr className="border-gray-300 mx-6 mb-6" />
                {page === 0 ? (
                    <TableEmployees
                        searchModeActive={searchModeActive}
                        setSearchModeActive={setSearchModeActive}
                        editModeActive={editModeActive}
                        setEditModeActive={setEditModeActive}
                        page={MENU[page]}
                    />
                ) : (
                    ''
                )}
            </div>
        </main>
    );
}
