import api from '@/lib/axios';
import { ApiResponse } from '@/types/api';
import { Message } from '@/types/chat';
import { data, LoaderFunctionArgs } from 'react-router-dom';

export async function chatLoader({ params }: LoaderFunctionArgs) {
  try {
    return await getMessages({ params });
  } catch (error) {
    console.log(error);
    return {
      messages: [],
    };
  }
}

async function getMessages({ params }: Omit<LoaderFunctionArgs, 'request'>) {
  const messages = await api
    .get<ApiResponse<Message[]>>('/chat/' + params.id)
    .then((response) => response.data);
  return data({ messages: messages.data }, 200);
}
