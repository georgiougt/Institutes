import { Injectable, OnModuleDestroy } from '@nestjs/common';
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
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    const connectionString = cleanDbUrl(process.env.DATABASE_URL || '');
    console.log('[Prisma] Using pg driver adapter');

    const pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 5,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter } as any);
    this.pool = pool;
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
