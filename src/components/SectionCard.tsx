// components/SectionCard.tsx
'use client';
import { PropsWithChildren, ReactNode } from 'react';

export default function SectionCard({
  title,
  subtitle,
  children,
}: PropsWithChildren<{ title?: string; subtitle?: ReactNode }>) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 md:p-5 shadow-sm">
      {title ? (
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-gray-700">{title}</h2>
          {subtitle ? <div className="text-xs text-gray-500">{subtitle}</div> : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}
