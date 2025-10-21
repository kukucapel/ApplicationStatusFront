'use client';

import MainBlock from '@/components/auth/MainBlock';
import Button from '@/components/ui/Button';
import Logo from '@/components/ui/Logo';
import Switch from '@/components/ui/Switch';
import { useState } from 'react';
import AuthLogin from '@/components/auth/AuthLogin';
import Registration from '@/components/auth/Registration';

const BUTTONS_SWITCH = [
    ['Вход', 'login'],
    ['Регистрация', 'register'],
];

export default function Login() {
    const [page, setPage] = useState(BUTTONS_SWITCH[0][1]);

    const onClickSwitchButton = (state: string) => {
        console.log(state);
        setPage(state);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-sky-50 p-4">
            <div className="w-full max-w-md">
                {/* Логотип плюс надпись */}
                <Logo />
                <MainBlock>
                    <Switch
                        page={page}
                        onClickSwitchButton={onClickSwitchButton}
                        buttonsList={BUTTONS_SWITCH}
                    />
                    {page === BUTTONS_SWITCH[0][1] ? (
                        <AuthLogin />
                    ) : (
                        <Registration />
                    )}
                </MainBlock>
                <p className="text-center text-sm text-gray-600 mt-6">
                    Автоматизированная система обработки заявок
                </p>
            </div>
        </div>
    );
}
