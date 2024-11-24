export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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
