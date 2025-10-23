import { apiRequest } from './apiClient';

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  fio: string;
  email: string;
  password: string;
}

export const loginUser = async (data: LoginFormData) => {
  return apiRequest('/auth/signin', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const registerUser = async (data: RegisterFormData) => {
  return apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const logoutUser = async () => {
  document.cookie = 'token=; path=/';
};
