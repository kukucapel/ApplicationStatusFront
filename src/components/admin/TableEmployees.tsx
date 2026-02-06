'use client';

import { useEffect, useState } from 'react';
import { Curator, Employee, Position, Role } from '@/dtos/AdminDto';
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
    curatorTreeItems: Curator[] | null;
    roleItems: Role[] | null;
    loadEmployees: () => Promise<void>;
    showAddModal: boolean;
    deleteMode: boolean;
    setShowAddModal: (newState: boolean) => void;
}

const HEADER_ALL = [
    ['ID', 'id'],
    ['ФИО', 'fio'],
    ['Личный email', 'email'],
];
const HEADER_USER = [
    ['ID', 'id_user'],
    ['ФИО', 'fio'],
    ['Логин', 'login'],
    ['Роль', 'role'],
];
const HEADER_EMPLOYEE = [
    ['ID', 'id'],
    ['ФИО', 'fio'],
    ['Личный email', 'email'],
    ['Должность', 'titlePosition'],
];
const HEADER_MOBILE_ALL = [
    ['ID', 'id'],
    ['ФИО', 'fio'],
];
const HEADER_MOBILE_USER = [
    ['ФИО', 'fio'],
    ['Роль', 'role'],
];
const HEADER_MOBILE_EMPLOYEE = [
    ['ФИО', 'fio'],
    ['Должность', 'titlePosition'],
];

export default function TableEmployees({
    page,
    searchMode,
    editMode,
    employeeItems = null,
    roleItems = null,
    loadEmployees,
    curatorTreeItems,
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

                itemValue = String((item as any)[key] ?? '').toLowerCase();

                return itemValue.includes(value.toLowerCase());
            });
        });

        const [fieldIndex, direction] = sort;
        let field;
        if (userFilter === 'all') field = HEADER_ALL[fieldIndex][1];
        else if (userFilter === 'user') field = HEADER_USER[fieldIndex][1];
        else {
            field = HEADER_EMPLOYEE[fieldIndex][1];
        }

        return [...filtered].sort((a, b) => {
            let aVal, bVal;
            aVal = (a as any)[field] ?? '';
            bVal = (b as any)[field] ?? '';

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

            <div className="px-6 bg-gray-50 rounded-lg  md:hidden">
                <div className="items-center gap-6 font-semibold text-gray-700 select-none mb-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'all'}
                            onChange={() => {
                                setSort([0, 0]);
                                setUserFilter('all');
                            }}
                            className="w-4 h-4"
                        />
                        <span>Все</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'user'}
                            onChange={() => {
                                setSort([0, 0]);
                                setUserFilter('user');
                            }}
                            className="w-4 h-4"
                        />
                        <span>Пользователи</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'employee'}
                            onChange={() => {
                                setSort([0, 0]);
                                setUserFilter('employee');
                            }}
                            className="w-4 h-4"
                        />
                        <span>Сотрудники</span>
                    </label>
                </div>

                {userFilter === 'all' ? (
                    <TableHeader
                        handleFilterChange={handleFilterChange}
                        setSort={setSort}
                        sort={sort}
                        HEADER={HEADER_MOBILE_ALL as [string, string][]}
                        searchMode={searchMode}
                    />
                ) : userFilter === 'user' ? (
                    <TableHeader
                        sizeId="1fr"
                        handleFilterChange={handleFilterChange}
                        setSort={setSort}
                        sort={sort}
                        HEADER={HEADER_MOBILE_USER as [string, string][]}
                        searchMode={searchMode}
                    />
                ) : (
                    <TableHeader
                        sizeId="1fr"
                        handleFilterChange={handleFilterChange}
                        setSort={setSort}
                        sort={sort}
                        HEADER={HEADER_MOBILE_EMPLOYEE as [string, string][]}
                        searchMode={searchMode}
                    />
                )}
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
                                <div className="grid grid-cols-[50px_1fr] gap-4">
                                    <div>{emp.id || '-'}</div>
                                    <div>{emp.fio || '-'}</div>
                                </div>
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
                                    <div className="grid grid-cols-[1fr_1fr] gap-4">
                                        <div>{emp.fio || '-'}</div>

                                        <div>{emp.role || '-'}</div>
                                    </div>
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
                                    <div className="grid grid-cols-[1fr_1fr] gap-4">
                                        <div>{emp.fio || '-'}</div>

                                        <div>
                                            {emp.position?.title.name || '-'}
                                        </div>
                                    </div>
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
                            curatorTreeItems={curatorTreeItems}
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
                        curatorTreeItems={curatorTreeItems}
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
                            onChange={() => {
                                setSort([0, 0]);
                                setUserFilter('all');
                            }}
                            className="w-4 h-4"
                        />
                        <span>Все</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'user'}
                            onChange={() => {
                                setSort([0, 0]);
                                setUserFilter('user');
                            }}
                            className="w-4 h-4"
                        />
                        <span>Пользователи</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={userFilter === 'employee'}
                            onChange={() => {
                                setSort([0, 0]);
                                setUserFilter('employee');
                            }}
                            className="w-4 h-4"
                        />
                        <span>Сотрудники</span>
                    </label>
                </div>

                {userFilter === 'all' ? (
                    <TableHeader
                        handleFilterChange={handleFilterChange}
                        setSort={setSort}
                        sort={sort}
                        HEADER={HEADER_ALL as [string, string][]}
                        searchMode={searchMode}
                    />
                ) : userFilter === 'user' ? (
                    <TableHeader
                        handleFilterChange={handleFilterChange}
                        setSort={setSort}
                        sort={sort}
                        HEADER={HEADER_USER as [string, string][]}
                        searchMode={searchMode}
                    />
                ) : (
                    <TableHeader
                        handleFilterChange={handleFilterChange}
                        setSort={setSort}
                        sort={sort}
                        HEADER={HEADER_EMPLOYEE as [string, string][]}
                        searchMode={searchMode}
                    />
                )}
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
                                <div className="grid grid-cols-[50px_1fr_1fr] gap-4">
                                    <div>{emp.id}</div>
                                    <div>{emp.fio || '-'}</div>
                                    <div>{emp.email}</div>
                                </div>
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
                                        <div>{emp.id_user}</div>
                                        <div>{emp.fio || '-'}</div>
                                        <div>{emp.login}</div>
                                        <div>{emp.role || '-'}</div>
                                    </div>
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
                                    <div className="grid grid-cols-[55px_1fr_1fr_1fr] gap-4">
                                        <div>{emp.id}</div>
                                        <div>{emp.fio || '-'}</div>
                                        <div>{emp.email}</div>
                                        <div>
                                            {emp.position?.title.name || '-'}
                                        </div>
                                    </div>
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
                            curatorTreeItems={curatorTreeItems}
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
                        curatorTreeItems={curatorTreeItems}
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
