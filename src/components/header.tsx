"use client";

import Logo from "../ui/Logo";

function Header() {
  return (
    <header className="bg-white border-b px-4 py-3 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Logo />
        <span className="font-semibold">Сервис заявок</span>
      </div>
    </header>
  );
}
