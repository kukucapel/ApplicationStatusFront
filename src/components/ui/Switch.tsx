import React, { JSX, ReactNode } from 'react';
import Button from './Button';

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
        <div className={`${className} flex justify-between items-center gap-1`}>
            {buttonsList.map((button, index) => (
                <Button
                    buttonText={button[0]}
                    isActive={page === button[1]}
                    className="w-full py-2"
                    onClick={() => onClickSwitchButton(button[1])}
                    key={index}
                />
            ))}
        </div>
    );
}
