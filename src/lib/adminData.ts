import { apiRequest } from './apiClient';

export async function adminData(page: [string, string]) {
  return await apiRequest(`/admin/${page[1]}`, {
    method: 'GET',
    credentials: 'include',
  });
}
