'use client';

interface TableAdminProps {
    page: number;
    MENU: [string, string][];
}

export default function TableAdmin({ page, MENU }: TableAdminProps) {
    return (
        <main className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border h-20 border-gray-200">
                {MENU[page][0]}
            </div>
        </main>
    );
}
