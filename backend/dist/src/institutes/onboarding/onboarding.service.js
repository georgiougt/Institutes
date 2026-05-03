"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const bcrypt = __importStar(require("bcryptjs"));
let OnboardingService = class OnboardingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async signup(dto) {
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Email already in use');
        const passwordHash = await bcrypt.hash(dto.password, 10);
        return this.prisma.user.create({
            data: {
                email: dto.email,
                passwordHash,
                firstName: dto.firstName,
                lastName: dto.lastName,
                role: 'OWNER',
                onboardingStep: 1,
            },
            select: { id: true, email: true, firstName: true, lastName: true, role: true }
        });
    }
    async updateDraft(dto) {
        const { userId, instituteId, step, ...data } = dto;
        await this.prisma.user.update({
            where: { id: userId },
            data: { onboardingStep: step }
        });
        if (instituteId) {
            return this.prisma.institute.update({
                where: { id: instituteId },
                data: {
                    name: data.name,
                    description: data.description,
                    website: data.website,
                    logoUrl: data.logoUrl,
                    status: 'DRAFT',
                    ...(data.serviceIds && {
                        services: {
                            deleteMany: {},
                            create: data.serviceIds.map(sid => ({ serviceId: sid }))
                        }
                    })
                }
            });
        }
        else {
            return this.prisma.institute.create({
                data: {
                    ownerId: userId,
                    name: data.name || 'Προσωρινό Όνομα',
                    status: 'DRAFT',
                }
            });
        }
    }
    async submitForReview(instituteId) {
        const inst = await this.prisma.institute.findUnique({
            where: { id: instituteId },
            include: { branches: true, services: true }
        });
        if (!inst)
            throw new common_1.NotFoundException('Institute not found');
        if (!inst.name || inst.name === 'Προσωρινό Όνομα')
            throw new common_1.BadRequestException('Please provide a valid institute name');
        if (inst.branches.length === 0)
            throw new common_1.BadRequestException('At least one branch (location) is required');
        if (inst.services.length === 0)
            throw new common_1.BadRequestException('Please select at least one service');
        return this.prisma.institute.update({
            where: { id: instituteId },
            data: { status: 'PENDING' }
        });
    }
    async submitClaim(dto) {
        const inst = await this.prisma.institute.findUnique({ where: { id: dto.instituteId } });
        if (!inst)
            throw new common_1.NotFoundException('Institute not found');
        const existingOpenClaim = await this.prisma.claim.findFirst({
            where: {
                instituteId: dto.instituteId,
                status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_MORE_INFO'] }
            }
        });
        if (existingOpenClaim)
            throw new common_1.ConflictException('This institute is already being claimed');
        return this.prisma.claim.create({
            data: {
                instituteId: dto.instituteId,
                claimantId: dto.claimantId,
                claimerEmail: dto.email,
                claimerPhone: dto.phone,
                message: dto.message,
                proofUrl: dto.proofUrl,
                status: 'SUBMITTED'
            }
        });
    }
    async searchToClaim(query) {
        return this.prisma.institute.findMany({
            where: {
                AND: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { isClaimed: false },
                    { status: 'APPROVED' }
                ]
            },
            take: 10,
            select: {
                id: true,
                name: true,
                logoUrl: true,
                website: true,
                branches: {
                    select: {
                        address: true,
                        city: { select: { name: true } }
                    },
                    take: 1
                }
            }
        });
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map