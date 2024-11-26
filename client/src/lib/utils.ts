import { AxiosError } from 'axios';
import { data } from 'react-router-dom';

export function formatMessageTime(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}

export function sendError(error: unknown, errors: Record<string, string>) {
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
  } else {
    errors['client'] = (error as Error).message;
  }
  return data({ errors }, { status: 400 });
}
