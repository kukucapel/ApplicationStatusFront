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
        <div className="flex flex-col">
            <span className="text-sm text-gray-500">Доступы</span>
            <div>
                {curatorAccessItems &&
                    curatorAccessItems.map((access, index) => (
                        <span
                            key={index}
                            className=""
                        >{`${access.curatorPosition.title} -- ${access.curatorPosition?.unit?.unitName || ''}`}</span>
                    ))}
                <Button
                    styleColor="blue"
                    onClick={handleClick}
                    type="button"
                    className=""
                >
                    Настроить доступы
                </Button>
            </div>
        </div>
    );
}
