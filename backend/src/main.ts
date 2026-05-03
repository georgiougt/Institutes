import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Pool } from 'pg';

async function testRawConnection() {
  console.log('[RAW PG TEST] Attempting direct pg connection...');
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 10000,
  });
  try {
    const result = await pool.query('SELECT 1 as test');
    console.log('[RAW PG TEST] ✅ SUCCESS! Result:', result.rows[0]);
    await pool.end();
    return true;
  } catch (error) {
    console.error('[RAW PG TEST] ❌ FAILED:', error.message);
    await pool.end();
    return false;
  }
}

async function bootstrap() {
  console.log('🚀 SERVER ATTEMPTING TO START...');
  console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
  console.log('DATABASE_URL value:', process.env.DATABASE_URL?.substring(0, 60) + '...');
  console.log('PORT:', process.env.PORT);

  // Test raw pg connection first
  await testRawConnection();
  
  try {
    const app = await NestFactory.create(AppModule);
    
    app.enableCors({
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    });

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

    const config = new DocumentBuilder()
      .setTitle('Institute Tracking API')
      .setDescription('API for managing learning centers and branches')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
      
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`✅ SERVER RUNNING ON PORT ${port}`);
  } catch (error) {
    console.error('❌ SERVER FAILED TO START:', error);
  }
}
bootstrap();
