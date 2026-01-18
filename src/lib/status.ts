export const ALLOWED_STATUSES = ['new', 'in_progress', 'closed'] as const;

export type Status = (typeof ALLOWED_STATUSES)[number];
