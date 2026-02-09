import { Children, ReactNode } from 'react';

interface ButtonProps {
    className?: string;
    isActive?: boolean;
    styleColor: string;
    onClick?: () => void;
    children?: ReactNode;
    type?: 'button' | 'submit' | 'reset';
}

export default function Button({
    className,
    isActive = false,
    styleColor,
    onClick,
    children,
    type = 'submit',
}: ButtonProps) {
    return (
        <button
            className={
                styleColor === 'white'
                    ? `${className} select-none transition-all duration-150 border-2 rounded-lg border-gray-200 font-medium ${
                          isActive
                              ? 'text-white bg-blue-600'
                              : 'cursor-pointer active:scale-95 hover:bg-gray-100 duration-150 shadow-md'
                      } `
                    : `${className} select-none transition-all duration-150 border-2 rounded-lg border-gray-200 font-medium ${
                          isActive
                              ? 'cursor-not-allowed bg-blue-400 text-gray-200'
                              : 'cursor-pointer text-white bg-blue-600 hover:bg-blue-700 active:scale-95  duration-150'
                      } `
            }
            disabled={isActive ? true : false}
            onClick={onClick}
            type={type}
        >
            {children}
        </button>
    );
}
