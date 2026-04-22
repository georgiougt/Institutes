import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { InstitutesModule } from './institutes/institutes.module';
import { AdminModule } from './admin/admin.module';
import { ReviewsModule } from './reviews/reviews.module';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    InstitutesModule,
    AdminModule,
    ReviewsModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
