import { ReactNode } from 'react';

interface ModalProps {
    children: ReactNode;
    className?: string;
    type?: number;
}

export default function Modal({ children, type = 1, className }: ModalProps) {
    if (type === 1) {
        return (
            <div
                className={`fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all`}
            >
                <div
                    className={`${className} bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll`}
                >
                    {children}
                </div>
            </div>
        );
    }
    if (type === 2) {
        return (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
                <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-fit max-h-[90vh] overflow-y-auto custom-scroll">
                    {children}
                </div>
            </div>
        );
    }
}
