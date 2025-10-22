'use client';

import { RegisterFormData, registerUser } from '@/lib/auth';
import { useState } from 'react';
import Button from '../ui/Button';

export default function Registration() {
    const [form, setForm] = useState<RegisterFormData>({
        fio: '',
        email: '',
        password: '',
    });
    const [submitPassword, setSubmitPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await registerUser(form);
        } catch (error: any) {
            setError('Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="mt-7" onSubmit={handleSubmit}>
            <div className="space-y-2">
                <label htmlFor="fio" className="text-xl font-medium">
                    ФИО
                </label>
                <input
                    id="fio"
                    name="fio"
                    type="text"
                    required
                    value={form.fio}
                    onChange={handleChange}
                    className="mt-1 block w-full transition px-3 pt-1 pb-1 border-2 rounded-lg border-gray-200 shadow-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Иванов Иван Иванович"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="email" className="text-xl font-medium">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="mt-1 block w-full transition px-3 pt-1 pb-1 border-2 rounded-lg border-gray-200 shadow-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="example@mail.ru"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="password" className="text-xl font-medium">
                    Пароль
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    className="mt-1 block w-full transition px-3 pt-1 pb-1 border-2 rounded-lg border-gray-200 shadow-md focus:outline-none focus:border-blue-500 focus:ring-blue-500"
                    placeholder="*********"
                />
            </div>
            <Button
                className={`mt-7 w-full ${
                    loading ? 'cursor-not-allowed' : 'cursor-pointer'
                } py-2`}
                isActive={loading}
                styleColor="blue"
            >
                {loading ? 'Регистрация...' : 'Зарегестрироваться'}
            </Button>
        </form>
    );
}
