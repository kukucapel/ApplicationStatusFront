'use client';

import { FileText, LogOut, Settings, Shield, User } from 'lucide-react';
import Button from './Button';
import Logo from './Logo';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useUser } from '@/contexts/UserContext';
import { useEffect, useRef, useState } from 'react';

import ChangePasswordModal from '../modals/ChangePasswordModal';

interface HeaderProps {}

export default function Header({}: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useUser();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const [changePasswordModal, setChangePasswordModal] =
        useState<boolean>(false);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileRef.current &&
                !profileRef.current.contains(event.target as Node)
            ) {
                setIsProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-center lg:justify-between">
                    <Logo typeLogo={1} className="items-center gap-2" />
                    <div className="flex items-center gap-3">
                        <Button
                            className={`flex items-center shadow-none px-3 gap-2 py-2 `}
                            isActive={pathname === '/dashboard'}
                            styleColor={'white'}
                            onClick={
                                pathname === '/dashboard'
                                    ? () => {}
                                    : handleClickDashboard
                            }
                        >
                            <FileText />

                            <span className="inline lg:hidden">
                                {pathname === '/dashboard' &&
                                user?.login === 'admin@example.com'
                                    ? ''
                                    : 'Обращения'}
                            </span>
                            <span className="hidden lg:inline">Обращения</span>
                        </Button>
                        {user?.role === 'admin' &&
                            user?.login === 'admin@example.com' && (
                                <Button
                                    onClick={handleClickAdmin}
                                    isActive={pathname === '/admin'}
                                    className="px-2 py-2 shadow-none  items-center flex gap-2"
                                    styleColor="white"
                                >
                                    <Shield className="w-5 h-5" />
                                    <span className="inline lg:hidden">
                                        {pathname === '/admin'
                                            ? ''
                                            : 'Управление'}
                                    </span>
                                    <span className="hidden lg:inline">
                                        Управление
                                    </span>
                                </Button>
                            )}

                        <div className="relative" ref={profileRef}>
                            <Button
                                styleColor="white"
                                onClick={() => setIsProfileOpen((v) => !v)}
                                className="px-2 py-2 shadow-none items-center flex gap-2 min-w-0"
                            >
                                <User width={23} height={23} />
                                {user ? (
                                    <div className="flex items-center gap-2 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 hidden sm:inline truncate">
                                            {user.fio}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="w-10 h-4 bg-gray-300 rounded animate-pulse" />
                                )}
                            </Button>

                            {isProfileOpen && (
                                <div
                                    className="absolute right-0 mt-2 w-52 rounded-lg bg-white
                       border border-gray-200 shadow-lg z-50 overflow-hidden"
                                >
                                    <button
                                        className="flex items-center gap-2 select-none w-full px-4 py-2 text-md hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            setChangePasswordModal(true);
                                        }}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Сменить пароль
                                    </button>

                                    <div className="h-px bg-gray-200 my-1" />

                                    <button
                                        className="flex items-center gap-2 w-full select-none px-4 py-2 text-md cursor-pointer
                           text-red-600 hover:bg-red-50"
                                        onClick={() => {
                                            setIsProfileOpen(false);
                                            handleClickLogout();
                                        }}
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Выйти
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* <Button
                            styleColor="white"
                            className="px-4 py-3  shadow-none"
                            onClick={() => router.push('settings')}
                            isActive={pathname === '/settings'}
                        >
                            <Settings className="w-4 h-4" />
                        </Button> */}
                        {/* <Button
                            styleColor="white"
                            className="px-4 py-3 shadow-none"
                            onClick={() => handleClickLogout()}
                        >
                            <LogOut className="w-4 h-4" />
                        </Button> */}
                    </div>
                </div>
            </div>
            {changePasswordModal && (
                <ChangePasswordModal
                    onClose={() => setChangePasswordModal(false)}
                />
            )}
        </header>
    );
}
