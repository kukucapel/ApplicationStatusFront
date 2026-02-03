'use client';

import { useEffect, useState } from 'react';
import { Employee, Position, Role } from '@/dtos/AdminDto';
import { adminData, deleteEmployee } from '@/lib/adminData';
import TableRow from '../ui/Table/TableRow';
import TableHeader from '../ui/Table/TableHeader';
import { useMemo } from 'react';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';
import ModalAdminMainBody from '../ui/ModalUi/ModalAdminMainBody';
import ModalAdminEmployee from '../modals/admin/ModalAdminEmployee';
import { useUser } from '@/contexts/UserContext';
import { Trash2 } from 'lucide-react';
import ModalSubmit from '../modals/ModalSubmit';

interface TableProps {
    page: [string, string];
    searchMode: boolean;
    editMode: boolean;
    employeeItems: Employee[] | null;
    positionItems: Position[] | null;
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
    ['Должность', 'titlePosition'],
];
const HEADER_MOBILE = [
    ['ID', 'id'],
    ['ФИО', 'fio'],
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
    positionItems,
}: TableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [sort, setSort] = useState<[number, number]>([0, 0]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [modalIsActive, setModalIsActive] = useState<number | null>(null);
    const [modalEmployee, setModalEmployee] = useState<Employee | null>(null);
    const [modalSubmit, setModalSubmit] = useState<number | null>(null);
    const [userFilter, setUserFilter] = useState<'all' | 'user' | 'employee'>(
        'all',
    );

    const { user } = useUser();

    const handleDelete = async (id: number) => {
        await deleteEmployee(id);
        setModalSubmit(null);
        await loadEmployees();
    };

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
                let itemValue;
                if (key === 'role') {
                    itemValue = String(item.user?.role ?? '');
                } else {
                    itemValue = String((item as any)[key] ?? '').toLowerCase();
                }
                console.log(itemValue);
                return itemValue.includes(value.toLowerCase());
            });
        });

        const [fieldIndex, direction] = sort;
        const field = HEADER[fieldIndex][1];

        return [...filtered].sort((a, b) => {
            let aVal, bVal;

            if (field === 'role') {
                aVal = a.user?.role ?? '';
                bVal = b.user?.role ?? '';
            } else {
                aVal = (a as any)[field] ?? '';
                bVal = (b as any)[field] ?? '';
            }

            if (aVal < bVal) return direction === 0 ? -1 : 1;
            if (aVal > bVal) return direction === 0 ? 1 : -1;
            return 0;
        });
    }, [employeeItems, filters, searchMode, sort]);

    if (loading && !employeeItems) {
        return (
            <div className=" inset-0 z-50 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            {/* Mobile */}

            <div className="p-6 bg-gray-50 rounded-lg md:hidden">
                <TableHeader
                    handleFilterChange={handleFilterChange}
                    setSort={setSort}
                    sort={sort}
                    sizeId="50px"
                    HEADER={HEADER_MOBILE as [string, string][]}
                    searchMode={searchMode}
                />
                <div className="space-y-2">
                    {filtredAndSortedItems?.map((emp: Employee) => (
                        <TableRow
                            onClickDelete={() => setModalSubmit(emp.id)}
                            deleteMode={deleteMode}
                            onClickTableModal={() => {
                                setModalIsActive(emp.id);
                                setModalEmployee(emp);
                            }}
                            editMode={editMode}
                            key={emp.id}
                            id={emp.id}
                        >
                            <div className="grid grid-cols-[30px_1fr] gap-4">
                                <div>{emp.id}</div>
                                <div>{emp.fio || '-'}</div>
                                {/* <div>{emp.email}</div>
                                        <div>{emp.user?.role || '-'}</div> */}
                            </div>
                            {/* {deleteMode && (
                                <button
                                    onClick={() => {
                                        setModalSubmit(emp.id);
                                    }}
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 text-red-500 active:scale-95 hover:scale-110 
        "
                                >
                                    <Trash2 size={18} />
                                </button>
                            )} */}
                        </TableRow>
                    ))}
                </div>
                {modalIsActive &&
                    modalEmployee &&
                    roleItems &&
                    positionItems && (
                        <ModalAdminEmployee
                            positionItems={positionItems}
                            roleItems={roleItems}
                            loadEmployees={loadEmployees}
                            employee={modalEmployee}
                            setModalIsActive={() => {
                                setModalEmployee(null);
                                setModalIsActive(null);
                            }}
                        />
                    )}
                {}
                {showAddModal && (
                    <ModalAdminEmployee
                        positionItems={positionItems}
                        roleItems={roleItems}
                        loadEmployees={loadEmployees}
                        employee={modalEmployee}
                        setModalIsActive={() => {
                            setModalEmployee(null);
                            setShowAddModal(false);
                        }}
                    />
                )}
                {modalSubmit && (
                    <ModalSubmit
                        handleSubmit={() => handleDelete(modalSubmit)}
                        onClose={() => setModalSubmit(null)}
                    />
                )}
            </div>
            {/* Desktop */}
            <div className="px-6 bg-gray-50 rounded-lg hidden md:block">
                <div className="flex items-center gap-6 font-semibold text-gray-700 select-none mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'all'}
                            onChange={() => setUserFilter('all')}
                            className="w-4 h-4"
                        />
                        <span>Все</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'user'}
                            onChange={() => setUserFilter('user')}
                            className="w-4 h-4"
                        />
                        <span>Пользователи</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'employee'}
                            onChange={() => setUserFilter('employee')}
                            className="w-4 h-4"
                        />
                        <span>Сотрудники</span>
                    </label>
                </div>
                <TableHeader
                    handleFilterChange={handleFilterChange}
                    setSort={setSort}
                    sort={sort}
                    HEADER={HEADER as [string, string][]}
                    searchMode={searchMode}
                />
                <div className="space-y-2">
                    {filtredAndSortedItems?.map((emp: Employee) =>
                        userFilter === 'all' ? (
                            <TableRow
                                onClickDelete={() => setModalSubmit(emp.id)}
                                deleteMode={deleteMode}
                                admin={emp.user?.login === 'admin@example.com'}
                                onClickTableModal={() => {
                                    setModalIsActive(emp.id);
                                    setModalEmployee(emp);
                                }}
                                editMode={editMode}
                                key={emp.id}
                                id={emp.id}
                            >
                                <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4">
                                    <div>{emp.id}</div>
                                    <div>{emp.fio || '-'}</div>
                                    <div>{emp.email}</div>
                                    <div>{emp.position?.title || '-'}</div>
                                </div>
                                {/* {deleteMode && (
                                <button
                                    onClick={() => {
                                        setModalSubmit(emp.id);
                                    }}
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 text-red-500 active:scale-95 hover:scale-110 
        "
                                >
                                    <Trash2 size={18} />
                                </button>
                            )} */}
                            </TableRow>
                        ) : userFilter === 'user' ? (
                            emp.user && (
                                <TableRow
                                    onClickDelete={() => setModalSubmit(emp.id)}
                                    deleteMode={deleteMode}
                                    admin={
                                        emp.user.login === 'admin@example.com'
                                    }
                                    onClickTableModal={() => {
                                        setModalIsActive(emp.id);
                                        setModalEmployee(emp);
                                    }}
                                    editMode={editMode}
                                    key={emp.id}
                                    id={emp.id}
                                >
                                    <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4">
                                        <div>{emp.id}</div>
                                        <div>{emp.fio || '-'}</div>
                                        <div>{emp.email}</div>
                                        <div>{emp.position?.title || '-'}</div>
                                    </div>
                                    {/* {deleteMode && (
                                <button
                                    onClick={() => {
                                        setModalSubmit(emp.id);
                                    }}
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 text-red-500 active:scale-95 hover:scale-110 
        "
                                >
                                    <Trash2 size={18} />
                                </button>
                            )} */}
                                </TableRow>
                            )
                        ) : (
                            !emp.user && (
                                <TableRow
                                    onClickDelete={() => setModalSubmit(emp.id)}
                                    deleteMode={deleteMode}
                                    onClickTableModal={() => {
                                        setModalIsActive(emp.id);
                                        setModalEmployee(emp);
                                    }}
                                    editMode={editMode}
                                    key={emp.id}
                                    id={emp.id}
                                >
                                    <div className="grid grid-cols-[60px_1fr_1fr_1fr] gap-4">
                                        <div>{emp.id}</div>
                                        <div>{emp.fio || '-'}</div>
                                        <div>{emp.email}</div>
                                        <div>{emp.position?.title || '-'}</div>
                                    </div>
                                    {/* {deleteMode && (
                                <button
                                    onClick={() => {
                                        setModalSubmit(emp.id);
                                    }}
                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 text-red-500 active:scale-95 hover:scale-110 
        "
                                >
                                    <Trash2 size={18} />
                                </button>
                            )} */}
                                </TableRow>
                            )
                        ),
                    )}
                </div>
                {modalIsActive &&
                    modalEmployee &&
                    positionItems &&
                    roleItems && (
                        <ModalAdminEmployee
                            positionItems={positionItems}
                            roleItems={roleItems}
                            loadEmployees={loadEmployees}
                            employee={modalEmployee}
                            setModalIsActive={() => {
                                setModalEmployee(null);
                                setModalIsActive(null);
                            }}
                        />
                    )}
                {}
                {showAddModal && (
                    <ModalAdminEmployee
                        positionItems={positionItems}
                        roleItems={roleItems}
                        loadEmployees={loadEmployees}
                        employee={modalEmployee}
                        setModalIsActive={() => {
                            setModalEmployee(null);
                            setShowAddModal(false);
                        }}
                    />
                )}
                {modalSubmit && (
                    <ModalSubmit
                        handleSubmit={() => handleDelete(modalSubmit)}
                        onClose={() => setModalSubmit(null)}
                    />
                )}
            </div>
        </>
    );
}
