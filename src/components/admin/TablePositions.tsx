'use client';

import { Employee, Position, PositionTitle } from '@/dtos/AdminDto';
import { useEffect, useMemo, useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import TableHeader from '../ui/Table/TableHeader';
import TableRow from '../ui/Table/TableRow';
import { Trash2 } from 'lucide-react';
import { ModalAdminPositions } from '../modals/admin/ModalAdminPosition';

interface TableProps {
    page: [string, string];
    searchMode: boolean;
    editMode: boolean;
    positionItems: Position[] | null;
    positionTitleItems: PositionTitle[] | null;
    employeeItems: Employee[] | null;
    showAddModal: boolean;
    deleteMode: boolean;
    setShowAddModal: (newState: boolean) => void;
    loadPositions: () => Promise<void>;
    loadEmployees: () => Promise<void>;
}
const HEADER = [
    ['ID', 'id'],
    ['Должность', 'titlePosition'],
    ['Структура', 'unitName'],
    ['Сотрудник', 'employeeFio'],
];

export default function TablePositions({
    page,
    searchMode,
    editMode,
    positionItems,
    employeeItems,
    positionTitleItems,
    showAddModal,
    deleteMode,
    setShowAddModal,
    loadEmployees,
    loadPositions,
}: TableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [sort, setSort] = useState<[number, number]>([0, 0]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [modalIsActive, setModalIsActive] = useState<number | null>(null);
    const [modalPosition, setModalPosition] = useState<Position | null>(null);
    const [modalSubmit, setModalSubmit] = useState<number | null>(null);
    const [error, setError] = useState<string>('');
    const { user } = useUser();

    useEffect(() => {
        if (user?.role === 'admin') {
            if (positionItems !== null) {
                setLoading(false);
            }
        }
    }, [positionItems]);

    const filtredAndSortedItems = useMemo(() => {
        if (!positionItems) return [];

        const filtered = positionItems.filter((item) => {
            return Object.entries(filters).every(([key, value]) => {
                if (!value || !searchMode) return true;

                const itemValue = String(
                    (item as any)[key] ?? '',
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
    }, [positionItems, filters, searchMode, sort]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    if (loading && !positionItems) {
        return (
            <div className=" inset-0 z-50 flex items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="p-6 bg-gray-50 rounded-lg hidden md:block">
                <TableHeader
                    handleFilterChange={handleFilterChange}
                    setSort={setSort}
                    sort={sort}
                    HEADER={HEADER as [string, string][]}
                    searchMode={searchMode}
                />
                <div className="space-y-2">
                    {filtredAndSortedItems?.map((position: Position) => (
                        <TableRow
                            // className={
                            //     !position.assignee && !deleteMode
                            //         ? 'border-green-600 border-2'
                            //         : ''
                            // }
                            deleteMode={deleteMode}
                            onClickDelete={() => setModalSubmit(position.id)}
                            onClickTableModal={() => {
                                setModalIsActive(position.id);
                                setModalPosition(position);
                            }}
                            editMode={editMode}
                            key={position.id}
                            id={position.id}
                        >
                            <div className="grid grid-cols-[50px_1fr_1fr_1fr] gap-4">
                                <div>{position.id}</div>
                                <div>{position.titlePosition || '-'}</div>
                                <div>{position.unitName || '-'}</div>
                                <div
                                    className={`${position.employeeFio ? '' : 'text-green-600'}`}
                                >
                                    {position.employeeFio || 'Позиция свободна'}
                                </div>
                            </div>
                        </TableRow>
                    ))}
                </div>
                {modalIsActive &&
                    modalPosition &&
                    positionTitleItems &&
                    positionItems &&
                    employeeItems && (
                        <ModalAdminPositions
                            position={modalPosition}
                            employeeItems={employeeItems}
                            positionTitleItems={positionTitleItems}
                            setModalIsActive={() => {
                                setModalPosition(null);
                                setModalIsActive(null);
                            }}
                            loadPositions={loadPositions}
                            loadEmployees={loadEmployees}
                        />
                    )}
                {showAddModal && (
                    <ModalAdminPositions
                        // position={modalPosition}
                        employeeItems={employeeItems}
                        positionTitleItems={positionTitleItems}
                        setModalIsActive={() => {
                            setModalPosition(null);
                            setShowAddModal(false);
                        }}
                        loadPositions={loadPositions}
                        loadEmployees={loadEmployees}
                    />
                )}
                {/* {modalSubmit && (
                    <ModalSubmit
                        error={error}
                        handleSubmit={() => handleDelete(modalSubmit)}
                        onClose={() => {
                            setModalSubmit(null);
                            setError('');
                        }}
                    />
                )} */}
            </div>
        </>
    );
}
