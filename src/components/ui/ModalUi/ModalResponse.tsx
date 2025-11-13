'use client';

import { ResponseCreateDto } from '@/dtos/ApplicationDto';
import { ReactNode, useState } from 'react';
import Button from '../Button';
import { X } from 'lucide-react';

interface ModalResponseProps {
    onClose: () => void;
    handleSubmit: (
        e: React.FormEvent,
        data: ResponseCreateDto
    ) => Promise<void>;
}

export default function ModalResponse({
    onClose,
    handleSubmit,
}: ModalResponseProps) {
    const [form, setForm] = useState<ResponseCreateDto>({
        comment: '',
        type: 'none_invite',
    });
    const isActive = form.comment === '';

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full h-[90vh] overflow-y-auto custom-scroll p-10">
                <div className="mb-7">
                    <div className="flex flex-row justify-between items-center mb-2">
                        <span className="text-xl ">Создание ответа</span>
                        <Button
                            styleColor="white"
                            className="p-1"
                            onClick={() => onClose()}
                        >
                            <X className="w-6 h-6 text-gray-700 transition-colors" />
                        </Button>
                    </div>
                    <hr className="text-gray-400" />
                    <div className="flex mt-2 gap-3">
                        <Button
                            styleColor={`${
                                form.type === 'none_invite' ? 'blue' : 'white'
                            }`}
                            onClick={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    type: 'none_invite',
                                }));
                            }}
                            className="px-2 py-1"
                        >
                            Ответ без приглашения
                        </Button>
                        <Button
                            styleColor={`${
                                form.type === 'invite' ? 'blue' : 'white'
                            }`}
                            onClick={() => {
                                setForm((prev) => ({
                                    ...prev,
                                    type: 'invite',
                                }));
                            }}
                            className="px-2 py-1"
                        >
                            Приглашение
                        </Button>
                    </div>
                </div>
                <form
                    className="transition-all duration-150 space-y-4 w-full "
                    onSubmit={(e) => handleSubmit(e, form)}
                >
                    <div className="flex flex-col">
                        <label className="text-sm text-gray-500 mb-2">
                            Ответ
                        </label>

                        <textarea
                            name="comment"
                            value={form.comment || ''}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    comment: e.target.value,
                                }))
                            }
                            rows={4}
                            className="rounded-md border border-gray-300 h-110 px-3 py-2 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all resize-none"
                            placeholder="Введите текст ответа..."
                        />
                    </div>
                    <div className="transition-all duration-150 flex gap-3 pt-4 border-t">
                        <Button
                            isActive={isActive}
                            styleColor="blue"
                            className={`flex-1  ${
                                isActive
                                    ? 'bg-blue-400'
                                    : 'bg-blue-600 hover:bg-blue-700'
                            }`}
                        >
                            Создать ответ
                        </Button>
                        <Button
                            onClick={() => onClose()}
                            styleColor="blue"
                            className="flex-1 py-2 hover:bg-blue-700"
                        >
                            Отмена
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
