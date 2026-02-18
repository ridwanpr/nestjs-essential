import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma/prisma.service.js';
import { Request, Response } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private prismaService: PrismaService) {}

  async use(req: Request, res: Response, next: () => void) {
    const username = Number(req.headers['x-username']);
    if (!username) {
      throw new HttpException('Unauthorized', 401);
    }

    const user = await this.prismaService.user.findUnique({
      where: {
        id: username,
      },
    });

    if (!user) {
      throw new HttpException('Unauthorized', 401);
    }

    req.user = user;
    next();
  }
}
