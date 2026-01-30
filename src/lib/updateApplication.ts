import { ResponseCreateDto } from '@/dtos/ApplicationDto';
import { apiRequest } from './apiClient';
import { Status } from './status';

export interface UpdateApplicationDataProps {
  theme?: string;
  question?: string;
  newStatus?: Status;
  to_position_id?: number;
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
  return apiRequest(`/requests/${id}`, {
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
  return apiRequest(`/requests/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getApplicationDetail = async (id: number) => {
  return apiRequest(`/requests/${id}`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getApplicationResponses = async (id: number) => {
  return apiRequest(`/requests/${id}/responses`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const addApplicationResponse = async (
  id: number,
  data: ResponseCreateDto
) => {
  return apiRequest(`/requests/${id}/responses`, {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const addAttachmentResponse = async (id: number, file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiRequest(`/requests/responses/attacment/response/${id}`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
};

export const getUnitTreeForApplication = async () => {
  return apiRequest(`/org/units-tree`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getCuratorsTreeForApplication = async () => {
  return apiRequest(`/org/units/curators-tree`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const getUrlDownloadAttachmentLink = async (id: number) => {
  return apiRequest(`/requests/responses/attacment/${id}/url`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
