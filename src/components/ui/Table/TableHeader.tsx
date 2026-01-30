'use client';

import {
    ChevronDown,
    ChevronUp,
    ArrowDownWideNarrow,
    ArrowUpNarrowWide,
    ArrowDownUp,
} from 'lucide-react';
import { useState } from 'react';

interface TableHeaderProps {
    HEADER: [string, string][];
    sort: [number, number];
    setSort: (sort: [number, number]) => void;
    handleFilterChange: (key: string, value: string) => void;
    searchMode: boolean;
    sizeId?: string;
}

export default function TableHeader({
    HEADER,
    sort,
    setSort,
    handleFilterChange,
    searchMode,
    sizeId = '70px',
}: TableHeaderProps) {
    const [filterValues, setFilterValues] = useState<Record<string, string>>(
        {},
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

    const gridTemplateColumns = `${sizeId} ${'1fr '.repeat(HEADER.length - 1)}`;

    return (
        <div
            className={`grid gap-2 font-semibold text-gray-700 border-b border-gray-300 pb-2 mb-2 mx-1`}
            style={{ gridTemplateColumns }}
        >
            {HEADER.map(([title, key], index) => (
                <div
                    className={`flex items-center w-full gap-1 select-none`}
                    key={index}
                >
                    {searchMode ? (
                        <div className="flex gap-0.5">
                            <div
                                className="flex cursor-pointer items-center"
                                onClick={() => handleClickSort(index)}
                            >
                                {index === sort[0] ? (
                                    sort[1] ? (
                                        <ArrowDownWideNarrow className="w-4 mt-0.5 hover:scale-125 transition-all duration-150" />
                                    ) : (
                                        <ArrowUpNarrowWide className="w-4 mt-0.5 hover:scale-125 transition-all duration-150" />
                                    )
                                ) : (
                                    <ArrowDownUp className="w-4 text-gray-400 transition-all duration-150 hover:text-gray-500" />
                                )}
                            </div>
                            <input
                                type="text"
                                value={filterValues[key] || ''}
                                onChange={(e) =>
                                    handleInputChange(key, e.target.value)
                                }
                                className="border border-gray-300 w-full rounded px-1 py-0.5 text-sm"
                                placeholder={`${title}`}
                            />
                        </div>
                    ) : (
                        <div className={`flex gap-1 items-center `}>
                            <div
                                className="flex cursor-pointer gap-1 items-center  "
                                onClick={() => handleClickSort(index)}
                            >
                                <div>{title}</div>
                                {index === sort[0] ? (
                                    sort[1] ? (
                                        <ArrowDownWideNarrow className="w-3.5 mt-0.5  hover:scale-125 transition-all duration-150" />
                                    ) : (
                                        <ArrowUpNarrowWide className="hover:scale-125 w-3.5 mt-0.5 transition-all duration-150" />
                                    )
                                ) : (
                                    <ArrowDownUp className="w-4 text-gray-400 transition-all duration-150 hover:text-gray-500" />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
