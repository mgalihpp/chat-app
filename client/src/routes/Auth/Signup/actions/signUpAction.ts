import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { LoginResponse } from '@/types/auth';
import { AxiosError } from 'axios';
import { ActionFunctionArgs, data, redirect } from 'react-router-dom';

export async function signUpAction({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const fullName = String(formData.get('fullName'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));

  const errors: Record<string, string> = {};

  try {
    const res = await api
      .post<ApiResponse<LoginResponse>>('/auth/signup', {
        username: fullName,
        email,
        password,
      })
      .then((response) => response.data);

    if (res.success) {
      return redirect('/');
    }
  } catch (error) {
    console.error(error);
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
