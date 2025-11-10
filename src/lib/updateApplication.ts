import { ResponseCreateDto } from '@/dtos/ApplicationDto';
import { apiRequest } from './apiClient';
import { Status } from './status';

export interface UpdateApplicationDataProps {
  theme?: string;
  question?: string;
  newStatus?: Status;
  assignedUnitId?: number;
  assignedEmployeeId?: number;
  createdAt?: string;
}
export interface UpdateApplicationStatusProps {
  new_status: Status;
  comments?: string | null;
}

export const updateApplicationStatus = async (
  data: UpdateApplicationStatusProps,
  id: number
) => {
  return apiRequest(`/worker/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const updateApplication = async (
  data: UpdateApplicationDataProps,
  id: number
) => {
  return apiRequest(`/worker/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getApplicationDetail = async (id: number) => {
  return apiRequest(`/worker/requests/${id}`, {
    method: 'GET',
    credentials: 'include',
  });
};

export const getApplicationResponses = async (id: number) => {
  return apiRequest(`/worker/requests/${id}/responses/?order=asc`, {
    method: 'GET',
    credentials: 'include',
  });
};

export const addApplicationResponse = async (
  id: number,
  data: ResponseCreateDto
) => {
  return apiRequest(`/worker/requests/${id}/responses/`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
