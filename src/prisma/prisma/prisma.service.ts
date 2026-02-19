import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    const adapter = new PrismaMariaDb({
      host: configService.get('DB_HOST') || 'localhost',
      port: configService.get('DB_PORT') || 3306,
      user: configService.get('DB_USER') || 'root',
      password: configService.get('DB_PASSWORD') || '',
      database: configService.get('DB_NAME') || 'nestjs_basic',
    });
    super({ adapter });
  }

  async onModuleInit() {
    console.info('Connect Prisma');
    await this.$connect();
  }

  async onModuleDestroy() {
    console.info('Disconnect Prisma');
    await this.$disconnect();
  }
}
