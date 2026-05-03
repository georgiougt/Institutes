import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    // Strip sslmode from URL (newer pg lib treats it as verify-full which rejects Supabase certs)
    let connectionString = process.env.DATABASE_URL || '';
    connectionString = connectionString.replace(/[?&]sslmode=[^&]*/g, '');
    connectionString = connectionString.replace(/[?&]pgbouncer=[^&]*/g, '');
    // Clean up dangling ? or &
    connectionString = connectionString.replace(/\?&/, '?').replace(/\?$/, '');

    console.log('[Prisma] Using pg driver adapter (bypassing native engine)');
    console.log('[Prisma] Cleaned URL prefix:', connectionString.substring(0, 50) + '...');

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
    this.pool = pool;
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
    await this.pool.end();
    console.log('[Prisma] Disconnected from database.');
  }
}
