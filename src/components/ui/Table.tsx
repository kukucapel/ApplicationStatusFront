'use client';

import { useEffect, useState } from 'react';
import { employee } from '@/dtos/AdminDto';
import { adminData } from '@/lib/adminData';
import TableRow from './Table/TableRow';

interface TableProps {
    page: [string, string];
}
type Dto = employee[] | null;

export default function Table({ page }: TableProps) {
    const [items, setItems] = useState<Dto>(null);

    useEffect(() => {
        async function load() {
            const data = await adminData(page);
            setItems(data.items);
        }
        load();
    }, [page]);
    console.log(items);
    return (
        <div className="p-6">
            <div className="space-y-3">
                {items?.map((row) => (
                    <TableRow key={row.id} id={row.id}>
                        {JSON.stringify(row)}
                    </TableRow>
                ))}
            </div>
        </div>
    );
}
