'use client';

import Logo from '../ui/Logo';

export default function HeaderShare() {
    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex items-center justify-between">
                    <Logo
                        title="Система обработки заявок"
                        className="inline-flex items-center gap-2"
                        typeLogo={1}
                    />
                </div>
            </div>
        </header>
    );
}
