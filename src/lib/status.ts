export const ALLOWED_STATUSES = [
  'new',
  'in_progress',
  'completed',
  'closed',
] as const;

export type Status = (typeof ALLOWED_STATUSES)[number];
