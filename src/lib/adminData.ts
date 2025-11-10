import { EmployeeUpdate } from '@/dtos/AdminDto';
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
  });
}
