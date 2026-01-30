import { apiRequest } from './apiClient';

export interface NewApplicant {
  fio?: string;
  email?: string;
  phone?: string;
  address1?: string;
  address2?: string;
  postal_code1?: string;
  postal_code2?: string;
}
export interface NewApplication {
  theme: string;
  question: string;
  to_position_id: number;
}

export const createApplication = async (data: any) => {
  return apiRequest(`/externals/plain`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
