'use client';

import { useState } from 'react';
import Modal from '../ui/NewModalUi/Modal';
import ModalBody from '../ui/NewModalUi/ModalBody';
import ModalBodyBlock from '../ui/NewModalUi/ModalBodyBlock';
import ModalHeader from '../ui/NewModalUi/ModalHeader';
import Button from '../ui/Button';

interface ChangePasswordModalProps {
    onClose: () => void;
}

export default function ChangePasswordModal({
    onClose,
}: ChangePasswordModalProps) {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        submitNewPassword: '',
    });
    const [error, setError] = useState<{
        status: number | null;
        message: string;
    }>({ status: null, message: '' });
    const isActive: boolean =
        form.oldPassword === '' ||
        form.newPassword === '' ||
        form.submitNewPassword === '';

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError({ status: null, message: '' });
        setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError({ status: null, message: '' });
        if (form.newPassword.length < 6) {
            setError({
                status: 1,
                message: 'Новый пароль должен быть больше 6 символов',
            });
            return;
        }
        if (form.newPassword !== form.submitNewPassword) {
            setError({ status: 2, message: 'Пароли должны совпадать' });
            return;
        }
    };

    return (
        <Modal>
            <ModalHeader title="Сменить пароль" onClose={onClose}></ModalHeader>
            <ModalBody>
                <form
                    className="transition-all duration-150 space-y-4 w-full "
                    onSubmit={handleSubmit}
                >
                    <div className="flex flex-col">
                        <label className="text-md text-gray-500">
                            Старый пароль
                        </label>
                        <input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            defaultValue={form.oldPassword}
                            onChange={handleChange}
                            placeholder="********"
                            className="mt-1 rounded-md border border-gray-300 px-3 py-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className={`text-md text-gray-500`}>
                            Новый пароль
                        </label>
                        <input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            defaultValue={form.newPassword}
                            onChange={handleChange}
                            placeholder="********"
                            className={`mt-1 rounded-md border border-gray-300 px-3 py-2 ${
                                error.status === 2 || error.status === 1
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                            }`}
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className={`text-md text-gray-500`}>
                            Подтвердите новый пароль
                        </label>
                        <input
                            id="submitNewPassword"
                            name="submitNewPassword"
                            type="password"
                            defaultValue={form.submitNewPassword}
                            onChange={handleChange}
                            placeholder="********"
                            className={`mt-1 rounded-md border border-gray-300 px-3 py-2 ${
                                error.status === 2
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                            }`}
                        />
                    </div>
                    {error && (
                        <div>
                            <span className="transition-all duration-150 text-red-500">
                                {error.message}
                            </span>
                        </div>
                    )}
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
                            Сохранить
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
            </ModalBody>
        </Modal>
    );
}
