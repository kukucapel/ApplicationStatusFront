'use client';

import { useEffect, useState } from 'react';
import { employee } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import TableRow from '../ui/Table/TableRow';
import TableHeader from '../ui/Table/TableHeader';
import { useMemo } from 'react';

interface TableProps {
    page: [string, string];
    searchMode: boolean;
    editMode: boolean;
}

const HEADER = [
    ['ID', 'id'],
    ['ФИО', 'fio'],
    ['Email', 'email'],
    ['Роль', 'role'],
    ['Поздразделение', 'unit_id'],
];

export default function TableEmployees({ page, searchMode }: TableProps) {
    const [items, setItems] = useState<employee[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [sort, setSort] = useState<[number, number]>([0, 0]);
    const [filters, setFilters] = useState<Record<string, string>>({});

    const handleFilterChange = (key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    useEffect(() => {
        async function load() {
            const data = await adminData(page);
            setItems(data.items);
            setLoading(false);
        }
        load();
    }, []);

    const sortedItems = useMemo(() => {
        if (!items) return [];
        const [fieldIndex, direction] = sort;
        const field = HEADER[fieldIndex][1];

        return [...items].sort((a, b) => {
            const aVal = (a as any)[field] ?? '';
            const bVal = (b as any)[field] ?? '';

            if (aVal < bVal) return direction === 0 ? -1 : 1;
            if (aVal > bVal) return direction === 0 ? 1 : -1;
            return 0;
        });
    }, [items, sort]);

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
                {sortedItems?.map((emp: employee) => (
                    <TableRow key={emp.id} id={emp.id}>
                        <div className="grid grid-cols-5 gap-4">
                            <div>{emp.id}</div>
                            <div>{emp.fio || '-'}</div>
                            <div>{emp.email}</div>
                            <div>{emp.role || '-'}</div>
                            <div>{emp.unit_id || '-'}</div>
                        </div>
                    </TableRow>
                ))}
            </div>
        </div>
    );
}
