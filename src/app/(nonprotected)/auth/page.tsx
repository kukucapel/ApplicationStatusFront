'use client';

import AuthBlock from '@/components/auth/AuthBlock';
import Logo from '@/components/ui/Logo';
import AuthLogin from '@/components/auth/AuthLogin';

export default function Auth() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
            <div className="w-full max-w-md">
                {/* Логотип плюс надпись */}
                <Logo className="text-center mb-8" />
                {/* Блок аутентификации с возможностью подключения регистрации */}
                <AuthBlock>
                    <AuthLogin />
                </AuthBlock>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Автоматизированная система обработки заявок
                </p>
            </div>
        </div>
    );
}
