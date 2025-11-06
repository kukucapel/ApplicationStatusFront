'use client';

import { LoginFormData, loginUser } from '@/lib/auth';
import { useState } from 'react';
import { useUser, User } from '@/contexts/UserContext';
import Button from '../ui/Button';

export default function AuthLogin() {
    const [form, setForm] = useState<LoginFormData>({
        fio: 'a',
        email: '',
        password: '',
    });
    const { setUser } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await loginUser(form);

            setUser(result.user as User);

            window.location.href = 'dashboard';
        } catch (error: any) {
            setError('Неправильный логин или пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className="" onSubmit={handleSubmit}>
            <div className="space-y-2">
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
                onClick={() => {}}
            >
                {loading ? 'Вход...' : 'Войти'}
            </Button>
        </form>
    );
}
