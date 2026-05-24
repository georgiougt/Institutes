import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private configService;
    private prisma;
    private stripe;
    private readonly logger;
    constructor(configService: ConfigService, prisma: PrismaService);
    createCheckoutSession(instituteId: string, planId: string, billingCycle?: 'monthly' | 'yearly', durationDays?: number): Promise<{
        url: any;
    }>;
    handleWebhook(signature: string, payload: Buffer): Promise<{
        received: boolean;
    }>;
    private handleSuccessfulSubscription;
}
