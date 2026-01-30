'use client';

import { registerUser } from '@/lib/auth';

import { useState } from 'react';
import Button from '../ui/Button';
import { RegisterFormData } from '@/dtos/AuthDto';

export default function Registration() {
    const [form, setForm] = useState<RegisterFormData>({
        fio: '',
        email: '',
        password: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
        <form
            className="mt-7 flex flex-col transition-all"
            onSubmit={handleSubmit}
        >
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
            <span
                className={`text-center text-red-500  transition-all justify-self-center mt-3 ${
                    error ? 'opacity-100' : 'opacity-0'
                }`}
            >
                {error || ''}
            </span>
            <Button
                className={`mt-3 w-full ${
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
