import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ResponseHelper, ApiResponse } from './response.interface';

function isApiResponse(data: unknown): data is ApiResponse {
  return (
    data !== null &&
    typeof data === 'object' &&
    'success' in data &&
    'message' in data &&
    'status' in data &&
    'timestamp' in data
  );
}

@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<unknown, ApiResponse>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse> {
    return next.handle().pipe(
      map((data: unknown): ApiResponse => {
        // Nếu data đã có format ApiResponse, trả về như vậy
        if (isApiResponse(data)) {
          return data;
        }

        // Nếu không, wrap trong success response
        return ResponseHelper.success(data);
      }),
      catchError((error: Error) => {
        console.error('Response interceptor caught error:', error);
        return throwError(() => error);
      }),
    );
  }
}
