import { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ ...rest }: InputProps) {
    return (
        <input
            className="flex mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base transition-colors border-gray-300 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm
            shadow-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
            {...rest}
        />
    );
}
