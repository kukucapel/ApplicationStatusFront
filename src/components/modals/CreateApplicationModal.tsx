'use client';

import { NewApplicationFormData } from '@/lib/createApplication';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Input from '../ui/Input';

interface CreateApplicationModalProps {
    onClose: () => void;
    handleSubmit: (data: NewApplicationFormData) => void;
}

export default function CreateApplicationModal({
    onClose,
    handleSubmit,
}: CreateApplicationModalProps) {
    const [formData, setFormData] = useState<NewApplicationFormData>({
        full_name: '',
        email: '',
        phone: '',
        registration_address: '',
        registration_postal_code: '',
        residence_address: '',
        residence_postal_code: '',
        recipient: '',
        subject: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
            <div className="bg-white rounded-l-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scroll">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-tl-2xl">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold">
                            Создать новую заявку
                        </h2>
                        <button
                            data-testid="create-modal-close-btn"
                            onClick={onClose}
                            className="text-white hover:bg-white hover:text-blue-600 cursor-pointer hover:bg-opacity-20 p-2 rounded-lg transition-colors"
                        >
                            <X className="w-6 h-6 transition-colors" />
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(formData);
                    }}
                    className="p-6 space-y-6"
                >
                    {/* Personal Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Информация о заявителе
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name">ФИО *</Label>
                                <Input
                                    data-testid="create-fullname-input"
                                    name="full_name"
                                    required
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="Иванов Иван Иванович"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    data-testid="create-email-input"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="example@mail.ru"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Телефон *</Label>
                                <Input
                                    id="phone"
                                    data-testid="create-phone-input"
                                    name="phone"
                                    required
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+7 (900) 123-45-67"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="recipient">
                                    К кому на прием *
                                </Label>
                                <Input
                                    id="recipient"
                                    data-testid="create-recipient-input"
                                    name="recipient"
                                    required
                                    value={formData.recipient}
                                    onChange={handleChange}
                                    placeholder="Городничий А.А."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Addresses */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Адреса
                        </h3>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="registration_address">
                                    Адрес регистрации *
                                </Label>
                                <Input
                                    id="registration_address"
                                    data-testid="create-reg-address-input"
                                    name="registration_address"
                                    required
                                    value={formData.registration_address}
                                    onChange={handleChange}
                                    placeholder="г. Калуга, ул. Ленина, д. 1"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="registration_postal_code">
                                    Индекс регистрации *
                                </Label>
                                <Input
                                    id="registration_postal_code"
                                    data-testid="create-reg-postal-input"
                                    name="registration_postal_code"
                                    required
                                    value={formData.registration_postal_code}
                                    onChange={handleChange}
                                    placeholder="248000"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="residence_address">
                                    Адрес проживания *
                                </Label>
                                <Input
                                    id="residence_address"
                                    data-testid="create-res-address-input"
                                    name="residence_address"
                                    required
                                    value={formData.residence_address}
                                    onChange={handleChange}
                                    placeholder="г. Калуга, ул. Пушкина, д. 2"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="residence_postal_code">
                                    Индекс проживания *
                                </Label>
                                <Input
                                    id="residence_postal_code"
                                    data-testid="create-res-postal-input"
                                    name="residence_postal_code"
                                    required
                                    value={formData.residence_postal_code}
                                    onChange={handleChange}
                                    placeholder="248000"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Request Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                            Детали обращения
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="subject">Тема обращения *</Label>
                            <Input
                                id="subject"
                                data-testid="create-subject-input"
                                name="subject"
                                required
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Например: Благоустройство придомовой территории"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Суть вопроса *</Label>
                            <textarea
                                className="flex  mt-2 min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-200 shadow-md focus:outline-none focus:border-blue-500 transition focus:ring-blue-500"
                                id="description"
                                data-testid="create-description-input"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Подробно опишите ваш вопрос..."
                                rows={6}
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button
                            onClick={onClose}
                            styleColor="blue"
                            className="flex-1 py-2 hover:bg-blue-700"
                        >
                            Отмена
                        </Button>
                        <Button
                            styleColor="blue"
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                        >
                            {loading ? 'Создание...' : 'Создать заявку'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
