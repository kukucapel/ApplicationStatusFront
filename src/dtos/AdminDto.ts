export interface Employee {
  id: number;
  fio: string | null;
  email: string;
  role?: string | null;
  unit_id?: string | null;
}
export interface Employees {
  items: Employee[];
}
