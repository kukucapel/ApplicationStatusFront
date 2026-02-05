'use client';

import Button from '../ui/Button';

interface ModalSubmitProps {
    onClose: () => void;
    handleSubmit: () => Promise<void>;
    error?: string;
}

export default function ModalSubmit({
    onClose,
    handleSubmit,
    error,
}: ModalSubmitProps) {
    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-80">
                <h2 className="text-lg font-semibold mb-1">Вы уверены?</h2>
                <span className="mb-1 text-red-400">{error}</span>
                <div className="flex mt-3 justify-end gap-4">
                    <Button
                        styleColor="blue"
                        className="px-9 py-2 "
                        onClick={handleSubmit}
                    >
                        Да
                    </Button>
                    <Button
                        styleColor="white"
                        className="px-8 py-2"
                        onClick={onClose}
                    >
                        Нет
                    </Button>
                </div>
            </div>
        </div>
    );
}
