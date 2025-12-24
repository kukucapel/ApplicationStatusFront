export interface Employee {
  id: number;
  fio?: string | null;
  email: string;
  user: {
    id: number;
    login: string;
    role_id: number;
    role: string;
  } | null;
  positions: [];
}
export interface EmployeeUpdate {
  fio?: string | null;
  email?: string;
  role_id?: number | null;
  unit_id?: number | null;
  password?: string;
}

export interface Role {
  id: number;
  created_at?: string;
  description?: string;
  name?: string;
  updated_at?: string;
}
export interface RoleUpdate {
  description?: string;
  name?: string;
}
export interface Unit {
  id: number;
  unit_name: string;
  children: Record<string, Unit>;
}
export interface Curator {
  id: number;
  employee: {
    id: number;
    fio: string;
  };
  title: {
    id: number;
    name: string;
    kind: string;
  };
  children: Record<string, Curator>; //кураторов повторять
  unit_name: string[]; //массив с всеми юнитами над которыми курирует куратор
  unit_path: string[];
}
