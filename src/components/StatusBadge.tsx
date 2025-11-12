'use client';
import { statusLabel, statusTone } from '@/lib/status';

export default function StatusBadge({
  value,
  prefix = 'Текущий статус:',
}: { value: string; prefix?: string }) {
  const tone = statusTone(value); // вернёт модификатор, напр. 'badge--new'
  const label = statusLabel[value] ?? value;

  return (
    <span className={`badge ${tone}`} aria-label={`${prefix} ${label}`}>
      <span className="block h-2 w-2 rounded-full bg-current/60" />
      {prefix ? <span className="opacity-70">{prefix}</span> : null}
      <span>{label}</span>
    </span>
  );
}
