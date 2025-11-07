'use client';

import { ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useState } from 'react';

interface TableHeaderProps {
    HEADER: [string, string][];
    sort: [number, number];
    setSort: (sort: [number, number]) => void;
    handleFilterChange: (key: string, value: string) => void;
}

export default function TableHeader({
    HEADER,
    sort,
    setSort,
    handleFilterChange,
}: TableHeaderProps) {
    const [filterValues, setFilterValues] = useState<Record<string, string>>(
        {}
    );

    const handleInputChange = (key: string, value: string) => {
        setFilterValues((prev) => ({ ...prev, [key]: value }));
        handleFilterChange(key, value);
    };

    const handleClickSort = (index: number) => {
        if (index === sort[0]) {
            if (!sort[1]) {
                setSort([index, 1]);
            } else {
                setSort([index, 0]);
            }
        } else {
            setSort([index, 0]);
        }
    };

    return (
        <div className="grid grid-cols-5 gap-2 font-semibold text-gray-700 border-b border-gray-300 pb-2 pr-3 mb-2 mx-1">
            {HEADER.map(([title, key], index) => (
                <div
                    className={`flex items-center pr-3.5 w-max gap-1 select-none`}
                    key={index}
                >
                    <div className={`flex gap-1 items-center `}>
                        <div
                            className="flex cursor-pointer items-center"
                            onClick={() => handleClickSort(index)}
                        >
                            <div>{title}</div>
                            {index === sort[0] &&
                                (!sort[1] ? (
                                    <ChevronDown className="w-3.5 mt-0.5 " />
                                ) : (
                                    <ChevronUp className="w-3.5 mt-0.5 " />
                                ))}
                        </div>
                    </div>
                    {/* {activeFilter === index && (
                        <input
                            type="text"
                            value={filterValues[key] || ''}
                            onChange={(e) =>
                                handleInputChange(key, e.target.value)
                            }
                            className="border border-gray-300 rounded px-1 py-0.5 text-sm"
                            placeholder={`Фильтр ${title}`}
                        />
                    )} */}
                </div>
            ))}
        </div>
    );
}
