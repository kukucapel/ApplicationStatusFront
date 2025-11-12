'use client';
import { PropsWithChildren, ReactNode } from 'react';

export default function SectionCard({
    title,
    subtitle,
    children,
}: PropsWithChildren<{ title?: string; subtitle?: ReactNode }>) {
    return (
        <section className="shadow-xl card p-5 md:p-6">
            {title ? (
                <div className="card-header">
                    <h2 className="text-sm font-medium text-[--ink-700]">
                        {title}
                    </h2>
                    {subtitle ? (
                        <div className="text-xs text-[--ink-700]">
                            {subtitle}
                        </div>
                    ) : null}
                </div>
            ) : null}
            {children}
        </section>
    );
}
