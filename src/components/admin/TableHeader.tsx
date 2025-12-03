'use client';

import { Plus, Edit, Search } from 'lucide-react';

interface TableHeaderProps {
    title: string;
    setShowAddModal: (newState: boolean) => void;
    role: string | undefined;
    searchMode: boolean;
    onClickSearch: () => void;
    editMode: boolean;
    onClickEdit: () => void;
}
export default function TableHeader({
    title,
    setShowAddModal,
    role,
    editMode,
    onClickEdit,
    searchMode,
    onClickSearch,
}: TableHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-4 px-6">
            <h2 className="text-2xl font-bold  text-gray-800">{title}</h2>
            <div className="flex gap-4 mr-2">
                <div
                    className={` p-1 rounded-md duration-150 cursor-pointer bg-white border border-gray-300 hover:bg-gray-100`}
                    onClick={() => setShowAddModal(true)}
                >
                    <Plus className="w-5" />
                </div>
                <div
                    className={` p-1 rounded-md duration-150 cursor-pointer ${
                        searchMode
                            ? 'bg-blue-600 border border-blue-600 text-white'
                            : 'bg-white border border-gray-300 hover:bg-gray-100 '
                    }`}
                    onClick={onClickSearch}
                >
                    <Search className="w-5" />
                </div>

                {role === 'admin' && (
                    <div
                        className={`p-1 border rounded-md duration-150 cursor-pointer ${
                            editMode
                                ? 'bg-blue-600 border border-blue-600 text-white'
                                : 'bg-white border border-gray-300 hover:bg-gray-100 '
                        }`}
                        onClick={onClickEdit}
                    >
                        <Edit className="w-5" />
                    </div>
                )}
            </div>
        </div>
    );
}
