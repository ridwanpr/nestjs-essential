import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient {
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
}
