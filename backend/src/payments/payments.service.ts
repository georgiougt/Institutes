import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    const secretKey = this.configService.get<string>('STRIPE_SECRET_KEY');
    this.stripe = new Stripe(secretKey || 'sk_test_placeholder', {
      apiVersion: '2025-01-27' as any,
    });
  }

  async createCheckoutSession(instituteId: string, planId: string, billingCycle: 'monthly' | 'yearly') {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
    
    let priceId = '';
    // These should ideally come from environment variables or a database of plans
    if (planId === 'verified') {
      priceId = billingCycle === 'monthly' ? 'price_verified_monthly' : 'price_verified_yearly';
    } else if (planId === 'featured') {
      priceId = billingCycle === 'monthly' ? 'price_featured_monthly' : 'price_featured_yearly';
    }

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
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
  }

  async handleWebhook(signature: string, payload: Buffer) {
    const webhookSecret = this.configService.get<string>('STRIPE_WEBHOOK_SECRET');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || 'whsec_placeholder');
    } catch (err: any) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.handleSuccessfulSubscription(session);
    }

    return { received: true };
  }

  private async handleSuccessfulSubscription(session: Stripe.Checkout.Session) {
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
