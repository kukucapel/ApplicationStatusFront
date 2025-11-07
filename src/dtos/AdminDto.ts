export interface employee {
  id: number;
  fio?: string | null;
  email?: string;
  role?: string | null;
  unit_id?: string | null;
}

export interface role {
  id: number;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}
