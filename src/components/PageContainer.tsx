// components/PageContainer.tsx
'use client';
import { PropsWithChildren } from 'react';

export default function PageContainer({ children }: PropsWithChildren) {
  return (
    <main className="max-w-3xl mx-auto p-6 md:p-8">{children}</main>
  );
}
