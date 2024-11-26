import api from '@/lib/axios';
import { sendError } from '@/lib/utils';
import { ApiResponse } from '@/types/api';

export async function updateProfile(formData: FormData) {
  const errors: Record<string, string> = {};

  try {
    await api.put<ApiResponse<unknown>>('/auth/update', formData);
  } catch (error) {
    return sendError(error, errors);
  }
}
