'use client';

import { ReactNode, useEffect, useRef } from 'react';
import ShareModalHeader from './ShareModalHeader';

interface ModalProps {
    children?: ReactNode;
    onClose: () => void;
    title: string;
}

export default function Modal({ children, onClose, title }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleClickOutside = (event: React.MouseEvent<HTMLDivElement>) => {
        if (
            modalRef.current &&
            !modalRef.current.contains(event.target as Node)
        ) {
            onClose();
        }
    };
    return (
        <div
            className="fixed inset-0 min-h-screen bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 transition-all"
            onClick={handleClickOutside}
        >
            <div
                ref={modalRef}
                className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll"
            >
                <div className="px-10 py-10 flex-1">
                    <ShareModalHeader title={title} onClose={onClose} />
                    {children}
                </div>
            </div>
        </div>
    );
}
