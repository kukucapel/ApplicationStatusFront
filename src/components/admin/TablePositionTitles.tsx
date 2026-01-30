import { useUser } from '@/contexts/UserContext';
import { PositionTitle } from '@/dtos/AdminDto';
import { useEffect, useMemo, useState } from 'react';
import TableHeader from '../ui/Table/TableHeader';
import TableRow from '../ui/Table/TableRow';
import { Trash2 } from 'lucide-react';
import { deletePositionTitle } from '@/lib/adminData';
import ModalSubmit from '../modals/ModalSubmit';
import { ModalAdminPositionTitles } from '../modals/admin/ModalAdminPositionTitles';

interface TableProps {
    page: [string, string];
    searchMode: boolean;
    editMode: boolean;
    positionTitleItems: PositionTitle[] | null;
    loadPostionTitles: () => Promise<void>;
    showAddModal: boolean;
    deleteMode: boolean;
    setShowAddModal: (newState: boolean) => void;
}

const HEADER = [
    ['ID', 'id'],
    ['Название', 'name'],
    ['Тип', 'kind'],
];

export default function TablePositionTitles({
    page,
    searchMode,
    editMode,
    positionTitleItems = null,
    loadPostionTitles,
    showAddModal,
    deleteMode,
    setShowAddModal,
}: TableProps) {
    const [loading, setLoading] = useState<boolean>(true);
    const [sort, setSort] = useState<[number, number]>([0, 0]);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [modalIsActive, setModalIsActive] = useState<number | null>(null);
    const [modalPositionTitle, setModalPositionTitle] =
        useState<PositionTitle | null>(null);
    const [modalSubmit, setModalSubmit] = useState<number | null>(null);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (user?.role === 'admin') {
            if (positionTitleItems !== null) {
                setLoading(false);
            }
        }
    }, [positionTitleItems]);

    const handleDelete = async (id: number) => {
        setError('');
        const res = await deletePositionTitle(id);
        console.log(res);
        if (res.id) {
            setModalSubmit(null);
            await loadPostionTitles();
        } else {
            if (res.status === 409) {
                setError('Невозможно удалить, т.к. запись используется');
            } else {
                setError('Ошибка удаления');
            }
        }
    };

    const filtredAndSortedItems = useMemo(() => {
        if (!positionTitleItems) return [];

        const filtered = positionTitleItems.filter((item) => {
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
    }, [positionTitleItems, filters, searchMode, sort]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };
    const { user } = useUser();
    if (loading) {
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
                    {filtredAndSortedItems?.map(
                        (positionTitle: PositionTitle) => (
                            <TableRow
                                deleteMode={deleteMode}
                                onClickTableModal={() => {
                                    setModalIsActive(positionTitle.id);
                                    setModalPositionTitle(positionTitle);
                                }}
                                editMode={editMode}
                                key={positionTitle.id}
                                id={positionTitle.id}
                            >
                                <div className="grid grid-cols-[60px_1fr_1fr] gap-4">
                                    <div>{positionTitle.id}</div>
                                    <div>{positionTitle.name || '-'}</div>
                                    <div>{positionTitle.kind || '-'}</div>
                                </div>

                                {deleteMode && (
                                    <button
                                        onClick={() => {
                                            setModalSubmit(positionTitle.id);
                                        }}
                                        className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200 text-red-500 active:scale-95 hover:scale-110 
        "
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </TableRow>
                        ),
                    )}
                </div>
                {modalIsActive && modalPositionTitle && positionTitleItems && (
                    <ModalAdminPositionTitles
                        positionTitle={modalPositionTitle}
                        setModalIsActive={() => {
                            setModalPositionTitle(null);
                            setModalIsActive(null);
                        }}
                        loadPositionTitles={loadPostionTitles}
                    />
                )}
                {showAddModal && (
                    <ModalAdminPositionTitles
                        loadPositionTitles={loadPostionTitles}
                        positionTitle={modalPositionTitle}
                        setModalIsActive={() => {
                            setModalPositionTitle(null);
                            setShowAddModal(false);
                        }}
                    />
                )}
                {modalSubmit && (
                    <ModalSubmit
                        error={error}
                        handleSubmit={() => handleDelete(modalSubmit)}
                        onClose={() => {
                            setModalSubmit(null);
                            setError('');
                        }}
                    />
                )}
            </div>
        </>
    );
}
