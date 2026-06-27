import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class BigIntInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> {
    return next
      .handle()
      .pipe(
        map((data: unknown) =>
          JSON.parse(
            JSON.stringify(data, (_key: string, value: unknown) =>
              typeof value === 'bigint' ? Number(value) : value,
            ),
          ),
        ),
      );
  }
}
