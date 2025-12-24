'use client';

import {
    createApplication,
    NewApplicant,
    NewApplication,
} from '@/lib/createApplication';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Label from '../ui/Label';
import Input from '../ui/Input';
import ModalHeader from '../ui/ModalUi/ModalHeader';
import ModalMainBody from '../ui/ModalUi/ModalMainBody';
import { Curator } from '@/dtos/AdminDto';
import { getCuratorsTreeForApplication } from '@/lib/updateApplication';
import ModalCuratorTree from './ModalCuratorTree';

interface CreateApplicationModalProps {
    onClose: () => void;
}

export default function CreateApplicationModal({
    onClose,
}: CreateApplicationModalProps) {
    const [application, setApplication] = useState<NewApplication>({
        theme: '',
        question: '',
        to_position_id: 8,
    });
    const [formData, setFormData] = useState<NewApplicant>({
        fio: '',
        email: '',
        phone: '',
        address1: '',
        address2: '',
        postal_code1: '',
        postal_code2: '',
    });
    const [loading, setLoading] = useState(false);
    const [curators, setCurators] = useState<Curator[] | null>(null);
    const [showCurators, setShowCurators] = useState(false);
    const [newCuratorsName, setNewCuratorsName] = useState<string | null>(null);
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmitChangeToPosition = (
        newSelected: number,
        newUnitName: string
    ) => {
        setApplication({ ...application, to_position_id: newSelected });
        setShowCurators(false);
        setNewCuratorsName(newUnitName);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await createApplication({
            applicant: formData,
            ...application,
            files: null,
        });
        onClose();
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);
    useEffect(() => {
        async function load() {
            setCurators((await getCuratorsTreeForApplication()).items);
        }
        load();
    }, []);
    useEffect(() => {
        if (curators) {
            setNewCuratorsName(curators[0].employee.fio);
        }
    }, [curators]);
    console.log(newCuratorsName);
    return (
        <ModalMainBody>
            {/* Header */}
            <ModalHeader title="Создать новую заявку" onClose={onClose} />
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Personal Info */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Информация о заявителе
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fio">ФИО *</Label>
                            <Input
                                data-testid="create-fullname-input"
                                name="fio"
                                required
                                value={formData.fio}
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

                        {/* <div className="space-y-2">
                            <Label htmlFor="recipient">К кому на прием *</Label>
                            <Input
                                id="recipient"
                                data-testid="create-recipient-input"
                                name="recipient"
                                required
                                value={formData.recipient}
                                onChange={handleChange}
                                placeholder="Городничий А.А."
                            />
                        </div> */}
                    </div>
                </div>

                {/* Addresses */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                        Адреса
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="address1">
                                Адрес регистрации *
                            </Label>
                            <Input
                                id="address1"
                                data-testid="create-reg-address-input"
                                name="address1"
                                required
                                value={formData.address1}
                                onChange={handleChange}
                                placeholder="г. Калуга, ул. Ленина, д. 1"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postal_code1">
                                Индекс регистрации *
                            </Label>
                            <Input
                                id="postal_code1"
                                data-testid="create-reg-postal-input"
                                name="postal_code1"
                                required
                                value={formData.postal_code1}
                                onChange={handleChange}
                                placeholder="248000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address2">Адрес проживания *</Label>
                            <Input
                                id="address2"
                                data-testid="create-res-address-input"
                                name="address2"
                                required
                                value={formData.address2}
                                onChange={handleChange}
                                placeholder="г. Калуга, ул. Пушкина, д. 2"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="postal_code2">
                                Индекс проживания *
                            </Label>
                            <Input
                                id="postal_code2"
                                data-testid="create-res-postal-input"
                                name="postal_code2"
                                required
                                value={formData.postal_code2}
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
                        <Label htmlFor="theme">Тема обращения *</Label>
                        <Input
                            id="theme"
                            data-testid="create-subject-input"
                            name="theme"
                            required
                            value={application.theme}
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) =>
                                setApplication({
                                    ...application,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            placeholder="Например: Благоустройство придомовой территории"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="question">Суть вопроса *</Label>
                        <textarea
                            className="flex  mt-2 min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base  placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-gray-200 shadow-md focus:outline-none focus:border-blue-500 transition focus:ring-blue-500"
                            id="question"
                            data-testid="create-description-input"
                            name="question"
                            required
                            value={application.question}
                            onChange={(
                                e: React.ChangeEvent<
                                    HTMLInputElement | HTMLTextAreaElement
                                >
                            ) =>
                                setApplication({
                                    ...application,
                                    [e.target.name]: e.target.value,
                                })
                            }
                            placeholder="Подробно опишите вопрос..."
                            rows={6}
                        />
                    </div>
                </div>
                <div className="space-y-2 flex flex-col">
                    <Label htmlFor="question">К кому на приём *</Label>
                    <Button
                        type="button"
                        styleColor="blue"
                        className="w-80 py-2"
                        onClick={() => setShowCurators(true)}
                    >
                        {newCuratorsName}
                    </Button>
                </div>
                {/* Footer */}
                <div className="flex gap-3 pt-4 border-t">
                    <Button
                        styleColor="blue"
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        {loading ? 'Создание...' : 'Создать заявку'}
                    </Button>
                    <Button
                        onClick={onClose}
                        styleColor="blue"
                        className="flex-1 py-2 hover:bg-blue-700"
                    >
                        Отмена
                    </Button>
                </div>
            </form>
            {showCurators && curators && (
                <ModalCuratorTree
                    selectedNow={application.to_position_id}
                    unitTree={curators}
                    handleChange={handleSubmitChangeToPosition}
                    onClose={() => setShowCurators(false)}
                />
            )}
        </ModalMainBody>
    );
}
