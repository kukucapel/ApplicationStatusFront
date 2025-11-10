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
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-tl-2xl">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{title}</h2>
                {children}
                <button
                    data-testid="create-modal-close-btn"
                    onClick={onClose}
                    className="text-white hover:bg-white hover:text-blue-600 cursor-pointer hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6 transition-colors" />
                </button>
            </div>
        </div>
    );
}
