import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface StandardResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  StandardResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((response) => {
        // si ya viene con el formato estándar (ApiResponseDto o PaginatedResponseDto)
        // lo dejamos pasar sin modificar
        if (response && 'success' in response) {
          return response as StandardResponse<T>;
        }

        // si no, lo envolvemos automáticamente
        return {
          success: true,
          message: 'Operación exitosa',
          data: response as T,
        };
      }),
    );
  }
}
