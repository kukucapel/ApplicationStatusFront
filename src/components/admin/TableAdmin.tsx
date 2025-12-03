'use client';

import { Edit, Plus, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import TableEmployees from './TableEmployees';
import { Employee, Role } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import { useUser } from '@/contexts/UserContext';
import TableHeader from './TableHeader';

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
                <TableHeader
                    title={MENU[0][0]}
                    setShowAddModal={setShowAddModal}
                    role={user?.role}
                    searchMode={searchMode}
                    onClickSearch={() => setSearchMode((prev) => !prev)}
                    editMode={editMode}
                    onClickEdit={() => setEditMode((prev) => !prev)}
                />

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
