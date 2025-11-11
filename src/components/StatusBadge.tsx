// components/StatusBadge.tsx
'use client';
import { statusLabel, statusTone } from '@/lib/status';

export default function StatusBadge({ value, prefix = 'Текущий статус:' }: { value: string; prefix?: string }) {
  const tone = statusTone(value);
  const label = statusLabel[value] ?? value;
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-sm font-medium ring-1 ring-inset ${tone}`}
      aria-label={`${prefix} ${label}`}
    >
      <span className="i-status-dot block h-2 w-2 rounded-full bg-current/60" />
      {prefix ? <span className="opacity-70">{prefix}</span> : null} <span>{label}</span>
    </span>
  );
}
