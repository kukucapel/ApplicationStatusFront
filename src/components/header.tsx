'use client';

import Logo from '../ui/Logo';
import { useUiShell } from './UiShell';

export default function Header() {
  const { showHeader } = useUiShell();
  if (!showHeader) return null;

  return (
    <header className="sticky top-0 z-20 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sky-100 to-indigo-100 border border-sky-200 flex items-center justify-center">
            <Logo />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-gray-900 text-lg">
              Система обработки заявок
            </div>
            <div className="text-xs text-gray-500">Сервис заявок</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 hidden sm:block">
          Город Калуга
        </div>
      </div>
    </header>
  );
}
