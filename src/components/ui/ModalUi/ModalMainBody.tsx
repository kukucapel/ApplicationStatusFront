import { ReactNode } from 'react';

interface ModalMainBodyProps {
    children: ReactNode;
}

export default function ModalMainBody({ children }: ModalMainBodyProps) {
    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
                {children}
            </div>
        </div>
    );
}
