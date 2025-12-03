import { Employee } from '@/dtos/AdminDto';
import { ReactNode } from 'react';
import { X } from 'lucide-react';
import Button from '../Button';

interface ModalAdminMainBodyProps {
    // employee: employee | null;
    children?: ReactNode;
    setModalIsActive: (state: null) => void;
}

export default function ModalAdminMainBody({
    children,
    setModalIsActive,
}: ModalAdminMainBodyProps) {
    return (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll p-10">
                <div className="mb-7">
                    <div className="flex flex-row justify-between items-center mb-2">
                        <span className="text-xl ">Редактирование</span>
                        <Button
                            styleColor="white"
                            className="p-1"
                            onClick={() => setModalIsActive(null)}
                        >
                            <X className="w-6 h-6 text-gray-700 transition-colors" />
                        </Button>
                    </div>
                    <hr className="text-gray-400" />
                </div>

                {children}
            </div>
        </div>
    );
}
