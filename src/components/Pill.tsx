// components/Pill.tsx
'use client';
import { PropsWithChildren } from 'react';

export default function Pill({ children }: PropsWithChildren) {
  return (
    <span className="inline-flex items-center rounded-md bg-amber-50 text-amber-700 px-2.5 py-1 text-sm ring-1 ring-inset ring-amber-200">
      {children}
    </span>
  );
}
