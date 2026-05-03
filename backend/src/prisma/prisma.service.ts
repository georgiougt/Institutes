import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  async onModuleInit() {
    try {
      console.log('[Prisma] Connecting to database...');
      await this.$connect();
      console.log('[Prisma] Successfully connected to database.');
    } catch (error) {
      console.error('[Prisma] Connection failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('[Prisma] Disconnected from database.');
  }
}
