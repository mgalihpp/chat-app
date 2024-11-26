export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  password?: string;
  created_At: Date;
  updated_At: Date;
}

export interface ValidationError {
  validation: string;
  path: string[];
  message: string;
  code: string;
}

export interface LoginResponse {
  message?: ValidationError[] | string;
  data: string | null;
}
