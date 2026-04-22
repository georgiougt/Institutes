import { Controller, Post, Body, Headers, Req, BadRequestException } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-checkout-session')
  @ApiOperation({ summary: 'Create a Stripe Checkout session' })
  async createSession(
    @Body() body: { instituteId: string; planId: string; billingCycle: 'monthly' | 'yearly' }
  ) {
    if (!body.instituteId || !body.planId) {
      throw new BadRequestException('Missing instituteId or planId');
    }
    return this.paymentsService.createCheckoutSession(
      body.instituteId, 
      body.planId, 
      body.billingCycle || 'monthly'
    );
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe Webhook handler' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: any
  ) {
    if (!signature) {
      throw new BadRequestException('Missing stripe-signature header');
    }
    // Note: In a real app, you need the raw body for signature verification.
    // Ensure you have a middleware that preserves it or use a raw body parser.
    return this.paymentsService.handleWebhook(signature, req.rawBody || req.body);
  }
}
