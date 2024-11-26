import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { LoginResponse } from '@/types/auth';
import { AxiosError } from 'axios';
import { ActionFunctionArgs, data, redirect } from 'react-router-dom';

export async function loginAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const errors: Record<string, string> = {};

  try {
    const res = await api
      .post<ApiResponse<LoginResponse>>('/auth/signin', { email, password })
      .then((response) => response.data);
    if (res.success) {
      window.localStorage.setItem('auth-message', 'Logged in successfully');
      return redirect('/');
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
        errors['server'] = errorMessage;
      }
    }
    return data({ errors }, { status: 400 });
  }
}
