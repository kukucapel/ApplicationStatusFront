'use client';

import { createContext, useContext, useState, PropsWithChildren, useMemo } from 'react';

type UiShellState = {
  showHeader: boolean;
  setShowHeader: (v: boolean) => void;
};

const UiShellCtx = createContext<UiShellState | null>(null);

export function UiShellProvider({ children }: PropsWithChildren) {
  const [showHeader, setShowHeader] = useState(true);
  const value = useMemo(() => ({ showHeader, setShowHeader }), [showHeader]);
  return <UiShellCtx.Provider value={value}>{children}</UiShellCtx.Provider>;
}

export function useUiShell() {
  const ctx = useContext(UiShellCtx);
  if (!ctx) throw new Error('useUiShell must be used within UiShellProvider');
  return ctx;
}
