import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { InstitutesModule } from './institutes/institutes.module';
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    InstitutesModule,
    AdminModule,
    ReviewsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
