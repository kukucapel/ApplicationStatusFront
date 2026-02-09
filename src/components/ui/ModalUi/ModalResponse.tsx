'use client';

import { ResponseCreateDto } from '@/dtos/ApplicationDto';
import { ReactNode, useRef, useState } from 'react';
import Button from '../Button';
import { X } from 'lucide-react';
import Switch from '../Switch';

const SWITCH_BUTTONS = [
    ['Ответ по телефону', 'phone'],
    ['Ответ текстом', 'text'],
    ['Ответ файлом', 'file'],
];

interface ModalResponseProps {
    onClose: () => void;
    handleSubmit: (
        e: React.FormEvent,
        data: { comment: string; phone: boolean },
        file: File,
    ) => Promise<void>;
    isLoadingResponse: boolean;
}

export default function ModalResponse({
    onClose,
    handleSubmit,
    isLoadingResponse,
}: ModalResponseProps) {
    const [form, setForm] = useState({
        comment: '',
        phone: false,
        type: 'none_invite',
    });
    const [page, setPage] = useState<string>(SWITCH_BUTTONS[0][1]);
    const [file, setFile] = useState<File | null>(null);
    const isActive: boolean =
        page === 'phone'
            ? !form.phone
            : page === 'text'
              ? form.comment === null
              : file === null;
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll p-10">
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
                    <hr className="text-gray-200" />
                    <Switch
                        page={page}
                        onClickSwitchButton={setPage}
                        buttonsList={SWITCH_BUTTONS}
                        className="mb-4 mt-10"
                    />
                </div>
                <form
                    className="transition-all duration-150 space-y-4 w-full "
                    onSubmit={(e) => handleSubmit(e, form, file as File)}
                >
                    {page === 'phone' ? (
                        <label className="flex ml-4 items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="phone"
                                className="w-6 h-6 cursor-pointer border-gray-600"
                                checked={form.phone ?? false}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        phone: e.target.checked,
                                    })
                                }
                            />
                            <span className="select-none text-gray-700">
                                Ответ дан по телефону
                            </span>
                        </label>
                    ) : page === 'text' ? (
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
                                className="rounded-md border border-gray-300 h-80 px-3 py-2 focus:outline-none 
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   transition-all resize-none"
                                placeholder="Введите текст уведомления..."
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            <label className="text-sm text-gray-500 mb-2">
                                Выберите файл
                            </label>

                            {/* Кастомная кнопка */}
                            <div className="flex items-center gap-3">
                                <Button
                                    styleColor="blue"
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                >
                                    Выбрать файл
                                </Button>

                                {/* Отображение имени выбранного файла */}
                                <span className="text-gray-700 select-none">
                                    {file ? file.name : 'Файл не выбран'}
                                </span>
                            </div>

                            {/* Скрытый input */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                onChange={(e) =>
                                    setFile(
                                        e.target.files !== null
                                            ? e.target.files[0]
                                            : null,
                                    )
                                }
                            />
                        </div>
                    )}

                    <div className="transition-all duration-150 flex gap-3 pt-4 border-t">
                        <Button
                            isActive={isActive || isLoadingResponse}
                            styleColor="blue"
                            className={`flex-1  ${
                                isActive || isLoadingResponse
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
