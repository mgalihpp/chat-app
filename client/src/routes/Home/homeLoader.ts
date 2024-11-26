import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { User } from '@/types/auth';
import { redirect } from 'react-router-dom';

export async function homeLoader() {
  try {
    const user = await checkUser();

    if (!user) {
      return redirect('/auth/login');
    }

    const getUsers = await api
      .get<ApiResponse<User[]>>('/chat/users')
      .then((response) => response.data);

    return {
      users: getUsers.data,
      auth: user,
    };
  } catch (error) {
    console.log(error);
    return {
      users: [],
    };
  }
}

async function checkUser() {
  try {
    const res = await api
      .get<ApiResponse<User>>('/auth/me')
      .then((response) => response.data);

    return res.data;
  } catch (error) {
    console.log(error);
    return false;
  }
}
