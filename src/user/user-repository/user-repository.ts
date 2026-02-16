import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma/prisma.service.js';
import { User } from '../../generated/prisma/client.js';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class UserRepository {
  constructor(
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {
    this.logger.info('User repository created');
  }

  async save(firstName: string, lastName?: string): Promise<User> {
    this.logger.info(`Create user with name: ${firstName} ${lastName}`);
    return await this.prismaService.user.create({
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    });
  }
}
