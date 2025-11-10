export interface Employee {
  id: number;
  fio?: string | null;
  email?: string;
  role?: string | null;
  unit_id?: string | null;
}
export interface EmployeeUpdate {
  fio?: string | null;
  email?: string;
  role?: string | null;
  unit_id?: string | null;
}

export interface Role {
  id: number;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}

export interface Unit {
  id: number;
  unit_name: string;
  children: Record<string, Unit>;
}
