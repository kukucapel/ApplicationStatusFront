import { logoutUser } from './auth';

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  let response: Response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        // 'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error('Internal Server Error');
  }

  if (!response.ok) {
    if (response.status === 401) {
      logoutUser();
    } else {
      return response;
    }
  }

  return response.json();
}
