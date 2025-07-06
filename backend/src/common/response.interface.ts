export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  status: number;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ResponseHelper {
  static success<T>(
    data?: T,
    message: string = 'Operation successful',
    status: number = 200,
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      status,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  static error(
    message: string = 'Operation failed',
    status: number = 400,
    error?: string,
  ): ApiResponse<null> {
    return {
      success: false,
      message,
      status,
      error,
      timestamp: new Date().toISOString(),
    };
  }
}
