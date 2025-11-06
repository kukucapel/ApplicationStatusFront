'use client';

import { LogOut, Shield, User } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { Plus } from 'lucide-react';
import { logoutUser } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface HeaderProps {
    handleClickModal: () => void;
}

export default function Header({ handleClickModal }: HeaderProps) {
    const router = useRouter();

    const handleClickLogout = async () => {
        await logoutUser();
        window.location.href = '/auth';
    };
    const handlClickAdmin = () => {
        router.push('admin');
    };
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <Logo className="inline-flex items-center gap-2" />
                    <div className="flex items-center gap-3">
                        <Button
                            className="flex items-center px-3 gap-2 py-2 hover:bg-blue-700 "
                            styleColor="blue"
                            onClick={handleClickModal}
                        >
                            <Plus className="w-4 h-4" />
                            <span className="hidden sm:inline">
                                Создать заявку
                            </span>
                        </Button>
                        <Button
                            onClick={handlClickAdmin}
                            className="px-2 py-2 shadow-none flex gap-2"
                            styleColor="white"
                        >
                            <Shield />
                            Управление
                        </Button>
                        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                            <User className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                                {'Славик'}
                            </span>
                        </div>
                        <Button
                            styleColor="white"
                            className="px-4 py-3 shadow-none"
                            onClick={() => handleClickLogout()}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
}
