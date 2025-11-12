export const statusLabel: Record<string, string> = {
  new: 'Новая',
  in_progress: 'В работе',
  completed: 'Выполнена',
  closed: 'Закрыта',
};

export function statusTone(s: string) {
  switch (s) {
    case 'new':
      return 'badge--new';
    case 'in_progress':
      return 'badge--in-progress';
    case 'completed':
      return 'badge--completed';
    case 'closed':
      return 'badge--closed';
    default:
      return 'badge--new';
  }
}
