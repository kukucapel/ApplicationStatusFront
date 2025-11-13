import Button from './Button';
import { X } from 'lucide-react';

interface ModalHeaderProps {
    title: string;
    onClose: () => void;
}

export default function ModalHeader({ title, onClose }: ModalHeaderProps) {
    return (
        <>
            <div className="mb-7 flex justify-between items-center">
                <span className="text-xl">{title}</span>
                <Button styleColor="white" className="p-1" onClick={onClose}>
                    <X className="w-6 h-6 text-gray-700 transition-colors" />
                </Button>
            </div>
            <hr className="text-gray-400 mb-4" />
        </>
    );
}
