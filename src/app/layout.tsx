'use client';

import type { ReactNode } from 'react';
import './globals.css';
import Header from '../components/Header';
import { UiShellProvider } from '../components/UiShell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-gray-50 text-gray-900">
        <UiShellProvider>
          <Header />
          {children}
        </UiShellProvider>
      </body>
    </html>
  );
}
