export interface ApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: boolean;
  statusCode: number;
  message: string;
  error: string | string[] | Record<string, string[]>;
  path: string;
  method: string;
  timestamp: string;
}
