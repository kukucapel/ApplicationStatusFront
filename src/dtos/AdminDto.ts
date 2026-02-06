export interface Employee {
  id: number;
  fio?: string | null;
  email: string;
  user: User | null;
  position: EmployeePosition | null;
  titlePosition?: string;
  id_user?: number | null;
  login?: string;
  role?: string;
}

export interface EmployeeUpdate {
  fio?: string | null;
  email?: string;
  position_id?: number | null;
}
export interface EmployeeCreate {
  fio: string;
  email: string;
  position_id: number | null;
}

export interface CuratorAccess {
  id: number;
  includePositionRequests: boolean;
  curatedScope: string;
  createdAt: string;
  curatorPosition: CuratorPosition;
}

export interface CuratorPosition {
  id: number;
  title: string;
  kind: string;
  unit: Unit;
}

export interface User {
  id: number;
  login: string;
  passwordChanged: boolean;
  passwordChangedAt: string | null;
  role: Role;
  curatorAccess: CuratorAccess[];
}

export interface UserUpdate {
  login?: string | null;
  role_id?: number | null;
  password?: string;
}
export interface UserCreate {
  fio: string;
  email: string;
  position_id: number | null;
  login: string;
  password: string;
  role_id: number;
}

export interface EmployeePosition {
  id: number;
  kind: string;
  title: PositionTitle;
  unit: EmployeePositionUnit | null;
}
export interface PositionTitle {
  id: number;
  name: string;
  kind: string;
}
export interface EmployeePositionUnit {
  id: number;
  path: string;
  unit_name: string;
}

export interface Role {
  id: number;
  createdAt?: string;
  description?: string;
  name?: string;
  updatedAt?: string;
}
export interface RoleUpdate {
  description?: string;
  name?: string;
}
export interface Unit {
  id: number;
  unitName: string;
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

export interface PositionTitleUpdate {
  name?: string;
  kind?: string;
}

export interface Position {
  id: number;
  title: PositionTitle;
  titlePosition?: string; //служебное
  unitName?: string; //служебное
  employeeFio?: string; //служебное
  unit: {
    id: number;
    unit_name: string;
    path: string;
  };
  curatedCount: number;
  assignee: {
    employee_id: number;
    fio: string;
    email: string;
    user_id?: number;
    login?: string;
  };
}

export interface PositionUpdate {
  position_title_id?: number | null;
  unit_id?: number | null;
  // employee_id?: number | null;
}
