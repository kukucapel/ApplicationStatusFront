'use client';

import { useState } from 'react';
import LeftMenu from './LeftMenu';
import TableAdmin from './TableAdmin';

const MENU: [string, string][] = [
    ['Соотрудники', 'employees'],
    // ['Роли', 'roles'],
    // ['Структура', 'units/?as=tree'],
    // ['Оценки', 'raitings'],
];

export default function BodyAdmin() {
    const [page, setPage] = useState<number>(0);

    return (
        <div className="max-w-7xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col lg:flex-row gap-6">
                <LeftMenu page={page} handleClickMenu={setPage} MENU={MENU} />
                <TableAdmin page={page} MENU={MENU} />
            </div>
        </div>
    );
}
