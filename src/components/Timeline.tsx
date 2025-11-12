'use client';
import { PropsWithChildren } from 'react';

export function Timeline({ children }: PropsWithChildren) {
  return <ol className="timeline space-y-4">{children}</ol>;
}

export function TimelineItem({
  children,
  dotClass = '',
}: PropsWithChildren<{ dotClass?: string }>) {
  return (
    <li className="timeline-item">
      <div className={`timeline-item-dot ${dotClass}`} />
      <div>{children}</div>
    </li>
  );
}
