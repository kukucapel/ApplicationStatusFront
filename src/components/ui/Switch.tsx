import React from 'react';

interface SwitchProps {
    page: string;
    onClickSwitchButton: (state: string) => void;
    buttonsList: string[][];
    className?: string;
}

export default function Switch({
    page,
    onClickSwitchButton,
    buttonsList,
    className,
}: SwitchProps) {
    return (
        <div className={`${className} flex border-b border-gray-300`}>
            {buttonsList.map((button, index) => {
                const isActive = page === button[1];

                return (
                    <div
                        key={index}
                        onClick={() => onClickSwitchButton(button[1])}
                        className={`cursor-pointer select-none text-center w-full px-4 py-2 -mb-px ${isActive ? 'border-b-2 border-blue-500 font-semibold text-blue-600' : 'text-gray-500'} transition-colors`}
                    >
                        {button[0]}
                    </div>
                );
            })}
        </div>
    );
}
