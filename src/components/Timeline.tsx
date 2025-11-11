// components/Timeline.tsx
'use client';
import { PropsWithChildren, ReactNode } from 'react';

export function Timeline({ children }: PropsWithChildren) {
  return (
    <ol className="relative border-s border-gray-200 pl-4 space-y-4">
      {children}
    </ol>
  );
}

export function TimelineItem({
  dotClass = 'bg-gray-300',
  children,
}: PropsWithChildren<{ dotClass?: string }>) {
  return (
    <li className="ms-2 relative">
      <div className={`absolute -start-[7px] mt-1 h-3 w-3 rounded-full ${dotClass}`} />
      <div>{children}</div>
    </li>
  );
}
