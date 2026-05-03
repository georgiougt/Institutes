"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_service_1 = require("../prisma/prisma.service");
const stripe_1 = __importDefault(require("stripe"));
let PaymentsService = PaymentsService_1 = class PaymentsService {
    configService;
    prisma;
    stripe;
    logger = new common_1.Logger(PaymentsService_1.name);
    constructor(configService, prisma) {
        this.configService = configService;
        this.prisma = prisma;
        const secretKey = this.configService.get('STRIPE_SECRET_KEY');
        this.stripe = new stripe_1.default(secretKey || 'sk_test_placeholder');
    }
    async createCheckoutSession(instituteId, planId, billingCycle) {
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:3000';
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
        }
        catch (error) {
            this.logger.error(`Stripe Session Creation Failed: ${error.message}`);
            throw error;
        }
    }
    async handleWebhook(signature, payload) {
        const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret || 'whsec_placeholder');
        }
        catch (err) {
            this.logger.error(`Webhook signature verification failed: ${err.message}`);
            throw new Error(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            await this.handleSuccessfulSubscription(session);
        }
        return { received: true };
    }
    async handleSuccessfulSubscription(session) {
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
                    verifiedUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
                },
            });
            this.logger.log(`Institute ${instituteId} successfully verified.`);
        }
        else if (planId === 'featured') {
            await this.prisma.institute.update({
                where: { id: instituteId },
                data: {
                    isFeatured: true,
                },
            });
            await this.prisma.featuredListing.create({
                data: {
                    instituteId,
                    placementType: 'SEARCH_TOP',
                    startsAt: new Date(),
                    endsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    isActive: true,
                    createdBy: 'STRIPE_WEBHOOK',
                }
            });
            this.logger.log(`Institute ${instituteId} successfully featured.`);
        }
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = PaymentsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map