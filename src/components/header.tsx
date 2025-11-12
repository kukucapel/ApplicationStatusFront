'use client';

import Logo from '../ui/Logo';
import { useUiShell } from './UiShell';

export default function Header() {
  const { showHeader } = useUiShell();
  if (!showHeader) return null;

  return (
    <header className="sticky top-0 z-20 header-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full border border-[--border] bg-[--brand-50] flex items-center justify-center">
            <Logo />
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight text-lg text-[--ink-900]">
              Система обработки заявок
            </div>
            <div className="text-xs text-[--ink-700]">Сервис заявок</div>
          </div>
        </div>

        <div className="text-xs text-[--ink-700] hidden sm:block">
          Город Калуга
        </div>
      </div>
      <div className="hero-bar" />
    </header>
  );
}
