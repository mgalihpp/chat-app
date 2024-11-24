export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
  success: boolean;
}
