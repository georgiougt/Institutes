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

  async createCheckoutSession(instituteId: string, planId: string, billingCycle: 'monthly' | 'yearly') {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    try {
      this.logger.log(`Creating Stripe Checkout session for institute ${instituteId}, plan ${planId}`);

      const session = await this.stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: planId === 'verified' ? 'Verified Badge' : 'Featured Placement',
                description: planId === 'verified' ? 'Επίσημο σήμα επαλήθευσης για το φροντιστήριό σας' : 'Προώθηση στην κορυφή των αποτελεσμάτων αναζήτησης',
              },
              unit_amount: planId === 'verified' 
                ? (billingCycle === 'monthly' ? 199 : 2000) 
                : (billingCycle === 'monthly' ? 999 : 9900),
              recurring: {
                interval: billingCycle === 'monthly' ? 'month' : 'year',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: `${frontendUrl}/owner/${instituteId}/premium?success=true`,
        cancel_url: `${frontendUrl}/owner/${instituteId}/premium?canceled=true`,
        metadata: {
          instituteId,
          planId,
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
    const { instituteId, planId } = session.metadata || {};
    
    if (!instituteId || !planId) {
      this.logger.error('Missing metadata in Stripe session');
      return;
    }

    if (planId === 'verified') {
      await this.prisma.institute.update({
        where: { id: instituteId },
        data: {
          isVerified: true,
          verifiedAt: new Date(),
          // Default to 1 month or 1 year based on session info if needed
          verifiedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // Default 1 year for now
        },
      });
      this.logger.log(`Institute ${instituteId} successfully verified.`);
    } else if (planId === 'featured') {
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
          endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Default 30 days
          isActive: true,
          createdBy: 'STRIPE_WEBHOOK',
        }
      });
      this.logger.log(`Institute ${instituteId} successfully featured.`);
    }
  }
}
