import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../generated/prisma/client.js';

export interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private roles: string[]) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const roleUser = user?.role as string | undefined;

    if (!roleUser) return false;
    return this.roles.includes(roleUser);
  }
}
