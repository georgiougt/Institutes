import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createSession(body: {
        instituteId: string;
        planId: string;
        billingCycle: 'monthly' | 'yearly';
    }): Promise<{
        url: any;
    }>;
    handleWebhook(signature: string, req: any): Promise<{
        received: boolean;
    }>;
}
