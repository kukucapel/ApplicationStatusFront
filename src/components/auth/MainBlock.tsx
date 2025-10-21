import { ReactNode } from 'react';

interface MainBlockProps {
    children?: ReactNode;
}

export default function MainBlock({ children }: MainBlockProps) {
    return (
        <div className="transition-all  duration-300 ease-in-out bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-fade-in">
            {children}
        </div>
    );
}
