'use client';

import { useEffect, useState } from 'react';
import { Role } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import TableRow from '../ui/Table/TableRow';
import TableHeader from '../ui/Table/TableHeader';
import { useMemo } from 'react';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';
import ModalAdminMainBody from '../ui/ModalUi/ModalAdminMainBody';
import ModalAdminEmployee from '../modals/admin/ModalAdminEmployee';
import { useUser } from '@/contexts/UserContext';
import ModalAdminRoles from '../modals/admin/ModalAdminRoles';

interface TableProps {
    page: [string, string];
    searchMode: boolean;
    editMode: boolean;
    roleItems: Role[] | null;
    showAddModal: boolean;
    deleteMode: boolean;
    setShowAddModal: (newState: boolean) => void;
    loadRoles: () => Promise<void>;
}
const HEADER = [
    ['ID', 'id'],
    ['Название', 'name'],
    ['Описание', 'description'],
];

export default function TableRoles({
    searchMode,
    editMode,
    roleItems,
    showAddModal,
    loadRoles,
    deleteMode,
    setShowAddModal,
}: TableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [sort, setSort] = useState<[number, number]>([0, 0]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [modalIsActive, setModalIsActive] = useState<number | null>(null);
    const [modalRole, setModalRole] = useState<Role | null>(null);
    const { user } = useUser();

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    useEffect(() => {
        if (user?.role === 'admin') {
            if (roleItems !== null) {
                setLoading(false);
            }
        }
    }, [roleItems]);

    const filtredAndSortedItems = useMemo(() => {
        if (!roleItems) return [];

        const filtered = roleItems.filter((item) => {
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
    }, [roleItems, filters, searchMode, sort]);

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
                {filtredAndSortedItems?.map((role: Role) => (
                    <TableRow
                        deleteMode={deleteMode}
                        onClickTableModal={() => {
                            setModalIsActive(role.id);
                            setModalRole(role);
                        }}
                        editMode={editMode}
                        key={role.id}
                        id={role.id}
                    >
                        <div className="grid grid-cols-3 gap-4">
                            <div>{role.id}</div>
                            <div>{role.name || '-'}</div>
                            <div>{role.description || '-'}</div>
                        </div>
                    </TableRow>
                ))}
            </div>
            {modalIsActive && modalRole && roleItems && (
                <ModalAdminRoles
                    role={modalRole}
                    setModalIsActive={() => {
                        setModalRole(null);
                        setModalIsActive(null);
                    }}
                    loadRoles={loadRoles}
                />
            )}
            {showAddModal && (
                <ModalAdminRoles
                    loadRoles={loadRoles}
                    role={modalRole}
                    setModalIsActive={() => {
                        setModalRole(null);
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
}
