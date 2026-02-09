'use client';

import { CuratorAccess } from '@/dtos/AdminDto';
import Button from './Button';

interface AccessProps {
    curatorAccessItems?: CuratorAccess[] | null;
    handleClick: () => void;
}

export default function Access({
    curatorAccessItems,
    handleClick,
}: AccessProps) {
    console.log(curatorAccessItems);
    return (
        <div className="flex flex-col gap-2">
            <span className="text-sm text-gray-500">Доступы</span>
            <div className="ml-3">
                {curatorAccessItems && curatorAccessItems.length > 0 && (
                    <ul className="space-y-1 text-sm text-gray-700">
                        {curatorAccessItems.map((access, index) => (
                            <li key={index} className="flex gap-2">
                                <span className="font-medium">
                                    {access.curatorPosition.title}
                                </span>
                                {access.curatorPosition?.unit?.unitName && (
                                    <span className="text-gray-400">
                                        — {access.curatorPosition.unit.unitName}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <Button
                styleColor="blue"
                onClick={handleClick}
                type="button"
                className="w-fit px-3 py-1"
            >
                Настроить доступы
            </Button>
        </div>
    );
}
