'use client';

import { FileText, LogOut, Settings, Shield } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';

interface HeaderProps {}

export default function Header({}: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useUser();

    const handleClickLogout = async () => {
        await logout();
        router.push('auth');
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
                    <Logo
                        typeLogo={1}
                        className="inline-flex items-center gap-2"
                    />
                    <div className="flex items-center gap-3">
                        <Button
                            className={`flex items-center px-3 gap-2 py-2 `}
                            isActive={pathname === '/dashboard'}
                            styleColor={'white'}
                            onClick={
                                pathname === '/dashboard'
                                    ? () => {}
                                    : handleClickDashboard
                            }
                        >
                            <FileText />

                            <span className="hidden sm:inline">Обращения</span>
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
                        <div className="flex items-center gap-2 px-4 py-3 bg-green-50 rounded-lg">
                            {user ? (
                                <div className="flex items-center gap-2 transition-opacity duration-500 opacity-100">
                                    <span className="text-sm font-medium text-gray-900 hidden sm:inline">
                                        {user.role === 'worker'
                                            ? 'Работник'
                                            : user.role === 'dispatcher'
                                            ? 'Диспетчер'
                                            : 'Администратор'}
                                    </span>
                                </div>
                            ) : (
                                <div className="w-10 h-4 bg-gray-300 rounded animate-pulse"></div>
                            )}
                        </div>
                        {/* <Button
                            styleColor="white"
                            className="px-4 py-3  shadow-none"
                        >
                            <Settings className="w-4 h-4" />
                        </Button> */}
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
