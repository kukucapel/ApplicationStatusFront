'use client';

import { FileText, LogOut, Shield, User } from 'lucide-react';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { Plus } from 'lucide-react';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

interface HeaderProps {
    handleClickModal: () => void;
}

export default function Header({ handleClickModal }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useUser();

    const handleClickLogout = async () => {
        await logout();
        window.location.href = '/auth';
    };
    const handleClickAdmin = () => {
        router.push('admin');
    };
    const handleClickDashboard = () => {
        router.push('dashboard');
    };
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <Logo className="inline-flex items-center gap-2" />
                    <div className="flex items-center gap-3">
                        <Button
                            className="flex items-center px-3 gap-2 py-2 hover:bg-blue-700 "
                            styleColor={
                                pathname === '/dashboard' ? 'blue' : 'white'
                            }
                            onClick={
                                pathname === '/dashboard'
                                    ? handleClickModal
                                    : handleClickDashboard
                            }
                        >
                            {pathname === '/dashboard' ? (
                                <Plus className="w-4 h-4" />
                            ) : (
                                <FileText />
                            )}
                            <span className="hidden sm:inline">
                                {pathname === '/dashboard'
                                    ? 'Создать заявку'
                                    : 'Обращения'}
                            </span>
                        </Button>
                        {(user?.role === 'admin' ||
                            user?.role === 'dispatcher') && (
                            <Button
                                onClick={handleClickAdmin}
                                isActive={pathname === '/admin'}
                                className="px-2 py-2 shadow-none  items-center flex gap-2"
                                styleColor="white"
                            >
                                <Shield className="w-5 h-5" />
                                Управление
                            </Button>
                        )}
                        <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 rounded-lg">
                            {user ? (
                                <div className="flex items-center gap-2 transition-opacity duration-500 opacity-100">
                                    <User className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                                        {user.name}
                                    </span>
                                </div>
                            ) : (
                                <div className="w-10 h-4 bg-gray-300 rounded animate-pulse"></div>
                            )}
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
