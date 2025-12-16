import { EmployeeUpdate, RoleUpdate } from '@/dtos/AdminDto';
import { apiRequest } from './apiClient';

export async function adminData(path: string) {
  return await apiRequest(`${path}`, {
    method: 'GET',
    credentials: 'include',
  });
}

export async function updateEmployee(data: EmployeeUpdate, id: number) {
  return await apiRequest(`/admin/employees/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function addEmployee(data: EmployeeUpdate) {
  return await apiRequest(`/dispatcher/employees`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function removeEmployee(id: number) {
  return await apiRequest(`/admin/employees/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function updateRole(data: RoleUpdate, id: number) {
  return await apiRequest(`/admin/roles/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function addRole(data: RoleUpdate) {
  return await apiRequest(`/admin/roles`, {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function deleteRole(id: number) {
  return await apiRequest(`/admin/roles/${id}`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
