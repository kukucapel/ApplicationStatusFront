import { useUser } from '@/contexts/UserContext';
import { PositionTitle } from '@/dtos/AdminDto';
import { useEffect, useMemo, useState } from 'react';

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
    ['Описание', 'description'],
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
    const [modalPositionTitle, setPositionTitle] =
        useState<PositionTitle | null>(null);
    const [modalSubmit, setModalSubmit] = useState<number | null>(null);

    useEffect(() => {
        if (user?.role === 'admin') {
            if (positionTitleItems !== null) {
                setLoading(false);
            }
        }
    }, [positionTitleItems]);

    //  const filtredAndSortedItems = useMemo(() => {
    //         if (!roleItems) return [];

    //         const filtered = roleItems.filter((item) => {
    //             return Object.entries(filters).every(([key, value]) => {
    //                 if (!value || !searchMode) return true;

    //                 const itemValue = String(
    //                     (item as any)[key] ?? '',
    //                 ).toLowerCase();
    //                 return itemValue.includes(value.toLowerCase());
    //             });
    //         });

    //         const [fieldIndex, direction] = sort;
    //         const field = HEADER[fieldIndex][1];

    //         return [...filtered].sort((a, b) => {
    //             const aVal = (a as any)[field] ?? '';
    //             const bVal = (b as any)[field] ?? '';

    //             if (aVal < bVal) return direction === 0 ? -1 : 1;
    //             if (aVal > bVal) return direction === 0 ? 1 : -1;
    //             return 0;
    //         });
    //     }, [roleItems, filters, searchMode, sort]);

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
}
