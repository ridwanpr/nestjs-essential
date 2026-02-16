import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service.js';
import { User } from '../../generated/prisma/client.js';

@Injectable()
export class UserRepository {
  constructor(private prismaService: PrismaService) {}

  async save(firstName: string, lastName?: string): Promise<User> {
    return await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}
