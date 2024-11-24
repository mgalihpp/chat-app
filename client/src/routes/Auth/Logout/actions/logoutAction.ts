import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { AxiosError } from 'axios';
import { data, redirect } from 'react-router-dom';

export async function logoutAction() {
  const errors: Record<string, string> = {};

  try {
    const res = await api.post<ApiResponse<void>>('/auth/logout');
    if (res.data.success) {
      window.localStorage.setItem('auth-message', 'Logged out successfully');
      return redirect('/auth/login');
    }
  } catch (error) {
    if (error instanceof AxiosError) {
      const errorMessage = error.response?.data.message;
      if (Array.isArray(errorMessage)) {
        errorMessage.forEach((errorObject: Record<string, string>) => {
          const path = errorObject.path[0];
          errors[path] = errorObject.message;
        });
      } else {
        errors['server'] = errorMessage.message;
      }
    }
    return data({ errors }, { status: 400 });
  }
}
