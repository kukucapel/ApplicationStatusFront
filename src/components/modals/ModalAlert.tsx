'use client';

import Button from '../ui/Button';

interface ModalAlertProps {
    onClose: () => void;
    title?: string;
    subTitle: string;
}

export default function ModalAlert({
    onClose,
    title,
    subTitle,
}: ModalAlertProps) {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div className="relative w-80 rounded-2xl bg-white p-6 shadow-2xl animate-scaleIn">
                <button
                    onClick={onClose}
                    className="absolute cursor-pointer right-3 top-3 text-gray-400 hover:text-gray-600 transition"
                >
                    ✕
                </button>

                {/* Заголовок */}
                <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    {title || 'Предупреждение'}
                </h2>

                {/* Текст */}
                <p className="mb-5 text-sm text-gray-600">{subTitle}</p>

                {/* Действие */}
                <Button
                    styleColor="white"
                    className="px-8 py-2"
                    onClick={onClose}
                >
                    Понятно
                </Button>
            </div>
        </div>
    );
}
