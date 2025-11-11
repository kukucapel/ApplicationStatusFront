'use client';

import { Edit, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import TableEmployees from './TableEmployees';
import { Employee, Role } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import { useUser } from '@/contexts/UserContext';

interface TableAdminProps {
    page: number;
    MENU: [string, string][];
}

export default function TableAdmin({ page, MENU }: TableAdminProps) {
    const { user } = useUser();

    const [searchMode, setSearchMode] = useState<boolean>(false);
    const [editMode, setEditMode] = useState<boolean>(
        user?.role === 'admin' && true
    );
    const [showAddModal, setShowAddModal] = useState<boolean>(false);

    const [employeeItems, setEmployeeItems] = useState<Employee[] | null>(null);
    const [roleItems, setRoleItems] = useState<Role[] | null>(null);

    const loadEmployees = async function () {
        const employeeData = await adminData('/dispatcher/employees');
        setEmployeeItems(employeeData.items);
    };

    useEffect(() => {
        async function load() {
            const [employeeData, roleData] = await Promise.all([
                adminData('/dispatcher/employees'),
                user?.role === 'admin' && adminData('/admin/roles'),
            ]);
            if (user?.role === 'admin') {
                setRoleItems(roleData.items);
            }

            setEmployeeItems(employeeData.items);
        }
        load();
    }, []);

    return (
        <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 border-gray-200">
                <div className="flex items-end justify-between mb-4 px-6">
                    <h2 className="text-2xl font-bold  text-gray-800">
                        {MENU[page][0]}
                    </h2>
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
                            onClick={() => setSearchMode((prev) => !prev)}
                        >
                            <Search className="w-5" />
                        </div>

                        {user?.role === 'admin' && (
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
                        )}
                    </div>
                </div>

                <hr className="border-gray-300 mx-6 mb-6" />
                {page === 0 ? (
                    <TableEmployees
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        roleItems={roleItems}
                        employeeItems={employeeItems}
                        searchMode={searchMode}
                        editMode={editMode}
                        page={MENU[page]}
                        loadEmployees={loadEmployees}
                    />
                ) : (
                    ''
                )}
            </div>
        </main>
    );
}
