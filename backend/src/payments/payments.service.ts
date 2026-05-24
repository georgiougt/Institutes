import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: any;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey || 'sk_test_placeholder');
  }

  async createCheckoutSession(
    instituteId: string, 
    planId: string, 
    billingCycle?: 'monthly' | 'yearly',
    durationDays?: number
  ) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    try {
      this.logger.log(`Creating Stripe Checkout session for institute ${instituteId}, plan ${planId}`);

      let lineItems: any[] = [];
      let mode: 'subscription' | 'payment' = 'subscription';

      if (planId === 'verified') {
        const cycle = billingCycle || 'monthly';
        const price = cycle === 'monthly' ? 500 : 5000; // €5 or €50
        
        lineItems = [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Verified Badge',
                description: 'Επίσημο σήμα επαλήθευσης για το φροντιστήριό σας',
              },
              unit_amount: price,
              recurring: {
                interval: cycle === 'monthly' ? 'month' : 'year',
              },
            },
            quantity: 1,
          },
        ];
        mode = 'subscription';
      } else if (planId === 'featured') {
        const days = durationDays || 30;
        let price = 2500; // default 30 days is €25
        if (days === 5) price = 600;      // €6
        else if (days === 10) price = 1000; // €10
        else if (days === 30) price = 2500; // €25

        lineItems = [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: `Featured Placement - ${days} Days`,
                description: `Προώθηση στην κορυφή των αποτελεσμάτων αναζήτησης για ${days} ημέρες`,
              },
              unit_amount: price,
            },
            quantity: 1,
          },
        ];
        mode = 'payment'; // Fixed duration: one-time payment
      }

      const session = await this.stripe.checkout.sessions.create({
        line_items: lineItems,
        mode,
        success_url: `${frontendUrl}/owner/${instituteId}/premium?success=true`,
        cancel_url: `${frontendUrl}/owner/${instituteId}/premium?canceled=true`,
        metadata: {
          instituteId,
          planId,
          billingCycle: billingCycle || 'monthly',
          durationDays: durationDays ? String(durationDays) : '30',
        },
      });

      return { url: session.url };
    } catch (error: any) {
      this.logger.error(`Stripe Session Creation Failed: ${error.message}`);
      throw error;
    }
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: any;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || 'whsec_placeholder');
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as any;
      await this.handleSuccessfulSubscription(session);
    }

    return { received: true };
  }

  private async handleSuccessfulSubscription(session: any) {
    const { instituteId, planId, billingCycle, durationDays } = session.metadata || {};
    
    if (!instituteId || !planId) {
      this.logger.error('Missing metadata in Stripe session');
      return;
    }

    if (planId === 'verified') {
      const cycle = billingCycle || 'monthly';
      const durationMs = cycle === 'monthly' 
        ? 30 * 24 * 60 * 60 * 1000  // 30 days
        : 365 * 24 * 60 * 60 * 1000; // 365 days

      await this.prisma.institute.update({
        where: { id: instituteId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          verifiedUntil: new Date(Date.now() + durationMs),
        },
      });
      this.logger.log(`Institute ${instituteId} successfully verified until ${new Date(Date.now() + durationMs).toISOString()}.`);
    } else if (planId === 'featured') {
      const days = parseInt(durationDays || '30', 10);
      const durationMs = days * 24 * 60 * 60 * 1000;

      await this.prisma.institute.update({
        where: { id: instituteId },
        data: {
          isFeatured: true,
        },
      });
      
      // Also create a record in FeaturedListing for tracking
      await this.prisma.featuredListing.create({
        data: {
          instituteId,
          placementType: 'SEARCH_TOP',
          startsAt: new Date(),
          endsAt: new Date(Date.now() + durationMs),
          isActive: true,
          createdBy: 'STRIPE_WEBHOOK',
        }
      });
      this.logger.log(`Institute ${instituteId} successfully featured until ${new Date(Date.now() + durationMs).toISOString()}.`);
    }
  }
}
