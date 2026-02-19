import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../generated/prisma/client.js';
import { Reflector } from '@nestjs/core';
import { Roles } from './role.decorator.js';

export interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles: string[] = this.reflector.get(Roles, context.getHandler());

    if (!roles) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const roleUser = request.user?.role as string | undefined;

    if (!roleUser) return false;
    return roles.includes(roleUser);
  }
}
