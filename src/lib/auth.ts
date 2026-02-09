import { API_URL, apiRequest } from './apiClient';
import { LoginFormData, RegisterFormData } from '@/dtos/AuthDto';

export const loginUser = async (data: LoginFormData) => {
  let response: Response;

  try {
    response = await fetch(`${API_URL}/auth/signin`, {
      method: 'POST',
      body: JSON.stringify(data),
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    throw new Error('ConnectServerError'); // сетевые ошибки
  }

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Unauthorized'); // логин/пароль неверный
    } else if (response.status >= 500) {
      throw new Error('Internal Server Error'); // ошибки сервера
    } else {
      throw new Error('UnknownError'); // остальные ошибки
    }
  }

  return response.json();
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
