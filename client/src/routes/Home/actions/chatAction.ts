import api from '@/lib/axios';
import { sendError } from '@/lib/utils';
import { ApiResponse } from '@/types/api';

export async function sendMessage(formData: FormData, params: { id: string }) {
  const errors: Record<string, string> = {};

  try {
    await api.post<ApiResponse<unknown>>('/chat/send/' + params.id, formData);
  } catch (error) {
    return sendError(error, errors);
  }
}
