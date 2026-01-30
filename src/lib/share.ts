import { apiRequest } from './apiClient';
import { ShareApplicationDto } from '@/dtos/ShareDto';

export async function getShareApplication(token: string) {
  return await apiRequest(`/share/${token}`, {
    cache: 'no-store',
  });
}

export async function setShareRating(id: number, score: number, token: string) {
  return await apiRequest(`/share/${token}/responses/${id}/rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      score: score,
    }),
    cache: 'no-store',
  });
}
export async function setShareInviteChoise(
  id: number,
  value: 'yes' | 'no',
  token: string
) {
  return await apiRequest(`/share/${token}/responses/${id}/choice`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      select: value,
    }),
    cache: 'no-store',
  });
}
