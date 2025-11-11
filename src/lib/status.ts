// lib/status.ts
export const statusLabel: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнена',
  closed: 'Закрыта',
};

export function statusTone(s: string) {
  switch (s) {
    case 'new':
      return 'bg-sky-50 text-sky-700 ring-sky-200';
    case 'in_progress':
      return 'bg-amber-50 text-amber-700 ring-amber-200';
    case 'completed':
      return 'bg-emerald-50 text-emerald-700 ring-emerald-200';
    case 'closed':
      return 'bg-gray-100 text-gray-700 ring-gray-200';
    default:
      return 'bg-blue-50 text-blue-700 ring-blue-200';
  }
}
