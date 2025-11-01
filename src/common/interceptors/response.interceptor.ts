import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T> | void>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T> | void> {
    return next.handle().pipe(
      map((data) => {
        const response = context.switchToHttp().getResponse();
        const request = context.switchToHttp().getRequest();
        const statusCode = response.statusCode;

        // For DELETE operations with 204 No Content, return no body
        if (request.method === 'DELETE' && statusCode === 204) {
          return;
        }

        // If the data is already in ApiResponse format, return it as is
        if (
          data &&
          typeof data === 'object' &&
          'success' in data &&
          'statusCode' in data
        ) {
          return data as ApiResponse<T>;
        }

        // Otherwise, wrap the data in ApiResponse format
        return {
          success: true,
          statusCode,
          message: 'Success',
          data,
        } as ApiResponse<T>;
      }),
    );
  }
}
