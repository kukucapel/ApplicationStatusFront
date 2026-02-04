import {
  EmployeeCreate,
  EmployeeUpdate,
  PositionTitleUpdate,
  RoleUpdate,
  UserCreate,
  UserUpdate,
} from '@/dtos/AdminDto';
import { apiRequest } from './apiClient';

export async function adminData(path: string) {
  return await apiRequest(`${path}`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function updateEmployee(data: EmployeeUpdate, id: number) {
  return await apiRequest(`/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function addEmployee(data: EmployeeCreate) {
  return await apiRequest(`/employees`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function deleteEmployee(id: number) {
  return await apiRequest(`/employees/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    body: '1',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function updateUser(id: number, data: UserUpdate) {
  return await apiRequest(`/employees/users/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function addUser(id: number, data: UserUpdate) {
  return await apiRequest(`/employees/users/`, {
    method: 'POST',
    body: JSON.stringify({ ...data, employee_id: id }),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function createUser(data: UserCreate) {
  const employeeData: EmployeeCreate = {
    email: data.email,
    fio: data.fio,
    position_id: data.position_id,
  };
  const userData: UserUpdate = {
    login: data.login,
    password: data.password,
    role_id: data.role_id,
  };
  console.log(employeeData);
  const idEmployee = await addEmployee(employeeData);
  console.log(idEmployee);
  return await addUser(idEmployee.employee_id, userData);
}

export async function updateRole(data: RoleUpdate, id: number) {
  return await apiRequest(`/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function addRole(data: RoleUpdate) {
  return await apiRequest(`/roles`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function deleteRole(id: number) {
  return await apiRequest(`/roles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    body: '1',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function getPositionTitles() {
  return await apiRequest(`/org/positions/position-titles`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function deletePositionTitle(id: number) {
  return await apiRequest(`/org/positions/position-titles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    // headers: {
    //   'Content-Type': 'application/json',
    // },
  });
}

export async function updatePositionTitle(
  data: PositionTitleUpdate,
  id: number,
) {
  return await apiRequest(`/org/positions/position-titles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function addPositionTitle(data: PositionTitleUpdate) {
  return await apiRequest(`/org/positions/position-titles`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
