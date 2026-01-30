import { apiRequest } from './apiClient';
import { LoginFormData, RegisterFormData } from '@/dtos/AuthDto';

export const loginUser = async (data: LoginFormData) => {
  return apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const registerUser = async (data: RegisterFormData) => {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const changePassword = async (data: {
  oldPassword: string;
  newPassword: string;
}) => {
  return apiRequest('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify(data),
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const logoutUser = async () => {
  return apiRequest('/auth/logout', {
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify({}),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
