// lib/date.ts
export const fmt = (s: string) =>
  new Date(s).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
