'use client';

import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import LeftMenu from '@/components/admin/LeftMenu';
import TableAdmin from '@/components/admin/TableAdmin';

export default function Admin() {
    const { user, loading } = useUser();
    const router = useRouter();

    const [page, setPage] = useState<number>(() => {
        const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith('admin_page='))
            ?.split('=')[1];

        return value ? Number(value) : 0;
    });

    useEffect(() => {
        if (
            !loading &&
            (user?.role === 'worker' || user?.login !== 'admin@example.com')
        )
            router.push('dashboard');
    }, [user, router, loading]);

    const MENU: [string, string][] = [
        ['Соотрудники', 'employees'],
        // ['Структура', 'units/?as=tree'],
        // ['Оценки', 'raitings'],
    ];
    if (user?.role === 'admin' && user?.login === 'admin@example.com')
        MENU.push(['Роли', 'roles']);
    if (user?.role === 'admin' && user?.login === 'admin@example.com')
        MENU.push(['Должности', 'position_titles']);
    if (user?.role !== 'admin' || user?.login !== 'admin@example.com') {
        return;
    } else {
        return (
            <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 pb-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    <LeftMenu
                        page={page}
                        handleClickMenu={setPage}
                        MENU={MENU}
                    />
                    <TableAdmin page={page} MENU={MENU} />
                </div>
            </div>
        );
    }
}
