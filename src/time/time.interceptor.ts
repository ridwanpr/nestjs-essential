import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface TimeResponse {
  [key: string]: unknown;
  timestamp?: Date;
}

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // context.switchToHttp().getRequest() // get request
    // context.switchToHttp().getResponse() // get response
    return next.handle().pipe(
      map((value: TimeResponse) => {
        value.timestamp = new Date();
        return value;
      }),
    );
  }
}
