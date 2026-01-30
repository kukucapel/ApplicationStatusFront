import { X } from 'lucide-react';
import { ReactNode } from 'react';

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
    children?: ReactNode;
}

export default function ModalHeader({
    title,
    onClose,
    children,
}: ModalHeaderProps) {
    return (
        <div className="sticky shadow-md p-6 rounded-tl-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-lg md:text-2xl xl:text-3xl font-bold">
                    {title}
                </h2>

                <div className="flex gap-10">
                    {children}
                    <button
                        data-testid="create-modal-close-btn"
                        onClick={onClose}
                        className=" hover:text-blue-600 cursor-pointer hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                    >
                        <X className="w-6 h-6 transition-colors" />
                    </button>
                </div>
            </div>
        </div>
    );
}
