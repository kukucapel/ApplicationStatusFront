import { apiRequest } from './apiClient';
import { Status } from './status';

export interface UpdateApplicationDataProps {
  theme?: string;
  question?: string;
  status?: Status;
  to_send?: string;
  applicant_id?: number;
  assigned_unit_id?: number;
  assigned_employee_id?: number;
  created_at?: string;
  updated_at: string;
}
export interface UpdateApplicationStatusProps {
  new_status: Status;
  comments?: string | null;
}

export const updateApplicationStatus = async (
  data: UpdateApplicationStatusProps,
  id: number,
  token: string | null
) => {
  return apiRequest(`/admin/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      // Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};
