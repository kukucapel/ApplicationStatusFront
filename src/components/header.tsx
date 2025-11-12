'use client';

import Logo from '../ui/Logo';
import { useUiShell } from './UiShell';

export default function Header() {
    const { showHeader } = useUiShell();
    if (!showHeader) return null;

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <Logo className="inline-flex items-center gap-2" />
                </div>
            </div>
        </header>
    );
}
