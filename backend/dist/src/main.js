"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const pg_1 = require("pg");
function cleanDbUrl(url) {
    let cleaned = url.replace(/[?&]sslmode=[^&]*/g, '');
    cleaned = cleaned.replace(/[?&]pgbouncer=[^&]*/g, '');
    cleaned = cleaned.replace(/\?&/, '?').replace(/\?$/, '');
    return cleaned;
}
async function testRawConnection() {
    console.log('[RAW PG TEST] Attempting direct pg connection...');
    const pool = new pg_1.Pool({
        connectionString: cleanDbUrl(process.env.DATABASE_URL || ''),
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
    });
    try {
        const result = await pool.query('SELECT 1 as test');
        console.log('[RAW PG TEST] ✅ SUCCESS! Result:', result.rows[0]);
        await pool.end();
        return true;
    }
    catch (error) {
        console.error('[RAW PG TEST] ❌ FAILED:', error.message);
        await pool.end();
        return false;
    }
}
async function bootstrap() {
    console.log('🚀 SERVER ATTEMPTING TO START...');
    console.log('DATABASE_URL set:', !!process.env.DATABASE_URL);
    console.log('PORT:', process.env.PORT);
    await testRawConnection();
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: true,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
            credentials: true,
        });
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true, whitelist: true }));
        const config = new swagger_1.DocumentBuilder()
            .setTitle('Institute Tracking API')
            .setDescription('API for managing learning centers and branches')
            .setVersion('1.0')
            .addBearerAuth()
            .build();
        const document = swagger_1.SwaggerModule.createDocument(app, config);
        swagger_1.SwaggerModule.setup('api/docs', app, document);
        const port = process.env.PORT ?? 3001;
        await app.listen(port);
        console.log(`✅ SERVER RUNNING ON PORT ${port}`);
    }
    catch (error) {
        console.error('❌ SERVER FAILED TO START:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map