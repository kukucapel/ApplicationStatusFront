'use client';

import type { ReactNode } from 'react';
import './globals.css';
import { UiShellProvider } from '../components/UiShell';

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="ru">
            <body className="app-body">
                <UiShellProvider>{children}</UiShellProvider>
            </body>
        </html>
    );
}
