'use client';

import { useState } from 'react';
import { Employees } from '@/dtos/AdminDto';

interface TableProps {
    page: [string, string];
}

export default function Table({ page }: TableProps) {
    const [items, setItems] = useState<Employees | null>(null);
}
