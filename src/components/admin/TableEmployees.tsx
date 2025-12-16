'use client';

import { useEffect, useState } from 'react';
import { Employee, Role } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import TableRow from '../ui/Table/TableRow';
import TableHeader from '../ui/Table/TableHeader';
import { useMemo } from 'react';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';
import ModalAdminMainBody from '../ui/ModalUi/ModalAdminMainBody';
import ModalAdminEmployee from '../modals/admin/ModalAdminEmployee';
import { useUser } from '@/contexts/UserContext';
import { Trash2 } from 'lucide-react';

interface TableProps {
    page: [string, string];
    searchMode: boolean;
    editMode: boolean;
    employeeItems: Employee[] | null;
    roleItems: Role[] | null;
    loadEmployees: () => Promise<void>;
    showAddModal: boolean;
    deleteMode: boolean;
    setShowAddModal: (newState: boolean) => void;
}

const HEADER = [
    ['ID', 'id'],
    ['ФИО', 'fio'],
    ['Email', 'email'],
    ['Роль', 'role'],
    ['Поздразделение', 'unit_name'],
];

export default function TableEmployees({
    page,
    searchMode,
    editMode,
    employeeItems = null,
    roleItems = null,
    loadEmployees,
    showAddModal,
    deleteMode,
    setShowAddModal,
}: TableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [sort, setSort] = useState<[number, number]>([0, 0]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [modalIsActive, setModalIsActive] = useState<number | null>(null);
    const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);

    const { user } = useUser();

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        setShowAddModal(false);
        if (user?.role === 'admin') {
            if (employeeItems !== null && roleItems !== null) {
                setLoading(false);
            }
        } else {
            if (employeeItems !== null) {
                setLoading(false);
            }
        }
    }, [employeeItems, roleItems]);

    const filtredAndSortedItems = useMemo(() => {
        if (!employeeItems) return [];

        const filtered = employeeItems.filter((item) => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value || !searchMode) return true;

                const itemValue = String(
                    (item as any)[key] ?? ''
                ).toLowerCase();
                return itemValue.includes(value.toLowerCase());
            });
        });

        const [fieldIndex, direction] = sort;
        const field = HEADER[fieldIndex][1];

        return [...filtered].sort((a, b) => {
            const aVal = (a as any)[field] ?? '';
            const bVal = (b as any)[field] ?? '';

            if (aVal < bVal) return direction === 0 ? -1 : 1;
            if (aVal > bVal) return direction === 0 ? 1 : -1;
            return 0;
        });
    }, [employeeItems, filters, searchMode, sort]);

    if (loading) {
        return (
            <div className=" inset-0 z-50 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 rounded-lg">
            <TableHeader
                handleFilterChange={handleFilterChange}
                setSort={setSort}
                sort={sort}
                HEADER={HEADER as [string, string][]}
                searchMode={searchMode}
            />
            <div className="space-y-2">
                {filtredAndSortedItems?.map((emp: Employee) => (
                    <TableRow
                        deleteMode={deleteMode}
                        onClickTableModal={() => {
                            setModalIsActive(emp.id);
                            setModalEmployee(emp);
                        }}
                        editMode={editMode}
                        key={emp.id}
                        id={emp.id}
                    >
                        <div className="grid grid-cols-5 gap-4">
                            <div>{emp.id}</div>
                            <div>{emp.fio || '-'}</div>
                            <div>{emp.email}</div>
                            <div>{emp.role || '-'}</div>
                            <div>{emp.unit_name || '-'}</div>
                        </div>
                        {deleteMode && (
                            <button
                                onClick={() => {}}
                                className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 text-red-500 active:scale-95 hover:scale-110 
        "
                            >
                                <Trash2 size={18} />
                            </button>
                        )}
                    </TableRow>
                ))}
            </div>
            {modalIsActive && modalEmployee && roleItems && (
                <ModalAdminEmployee
                    roleItems={roleItems}
                    loadEmployees={loadEmployees}
                    employee={modalEmployee}
                    setModalIsActive={() => {
                        setModalEmployee(null);
                        setModalIsActive(null);
                    }}
                />
            )}
            {showAddModal && (
                <ModalAdminEmployee
                    roleItems={roleItems}
                    loadEmployees={loadEmployees}
                    employee={modalEmployee}
                    setModalIsActive={() => {
                        setModalEmployee(null);
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
}
