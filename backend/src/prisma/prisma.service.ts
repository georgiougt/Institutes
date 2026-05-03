import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

function cleanDbUrl(url: string): string {
  let cleaned = url.replace(/[?&]sslmode=[^&]*/g, '');
  cleaned = cleaned.replace(/[?&]pgbouncer=[^&]*/g, '');
  cleaned = cleaned.replace(/\?&/, '?').replace(/\?$/, '');
  return cleaned;
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = cleanDbUrl(process.env.DATABASE_URL || '');
    console.log('[Prisma] Using pg driver adapter (bypassing native engine)');

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
      console.log('[Prisma] Testing database connection...');
      // Don't use $connect() - it hangs with the pg adapter.
      // Instead, run a test query to verify connectivity.
      const result = await this.$queryRawUnsafe('SELECT 1 as connected');
      console.log('[Prisma] ✅ Database connected successfully!', result);
    } catch (error) {
      console.error('[Prisma] ❌ Connection test failed:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
    console.log('[Prisma] Disconnected from database.');
  }
}
