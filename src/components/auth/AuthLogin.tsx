'use client';

import { loginUser } from '@/lib/auth';
import { LoginFormData } from '@/dtos/AuthDto';
import { useState } from 'react';
import { useUser, User } from '@/contexts/UserContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import ErrorText from '../ui/ErrorText';

export default function AuthLogin() {
    const [form, setForm] = useState<LoginFormData>({
        email: '',
        password: '',
    });

    const { setUser } = useUser();
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
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@mail.ru"
                />
            </div>
            <div className="mt-4">
                <label htmlFor="password" className="text-xl font-medium">
                    Пароль
                </label>
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    placeholder="*********"
                />
            </div>
            {error && <ErrorText error={error} />}

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
