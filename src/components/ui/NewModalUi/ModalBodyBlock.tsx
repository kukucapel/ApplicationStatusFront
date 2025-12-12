import { ReactNode } from 'react';

interface ModalBodyBlockProps {
    children: ReactNode;
    title: string;
    typeStyle?: number;
}

export default function ModalBodyBlock({
    children,
    title,
    typeStyle = 1,
}: ModalBodyBlockProps) {
    if (typeStyle === 1) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    {title}
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">{children}</div>
            </div>
        );
    } else {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center justify-between border-b pb-2">
                    {title}
                </h3>
                {children}
            </div>
        );
    }
}
