import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { OnboardingSignupDto, UpdateDraftDto, ClaimSubmitDto } from './onboarding.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class OnboardingService {
  constructor(private prisma: PrismaService) {}

  async signup(dto: OnboardingSignupDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already in use');

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

  async updateDraft(dto: UpdateDraftDto) {
    const { userId, instituteId, step, ...data } = dto;

    // Update user's current step
    await this.prisma.user.update({
      where: { id: userId },
      data: { onboardingStep: step }
    });

    if (instituteId) {
      // Update existing draft
      return this.prisma.institute.update({
        where: { id: instituteId },
        data: {
          name: data.name,
          description: data.description,
          website: data.website,
          logoUrl: data.logoUrl,
          // Calculate completeness score here if needed
          status: 'DRAFT',
          // Handle services if provided
          ...(data.serviceIds && {
            services: {
              deleteMany: {},
              create: data.serviceIds.map(sid => ({ serviceId: sid }))
            }
          })
        }
      });
    } else {
      // Create new draft
      return this.prisma.institute.create({
        data: {
          ownerId: userId,
          name: data.name || 'Προσωρινό Όνομα',
          status: 'DRAFT',
        }
      });
    }
  }

  async submitForReview(instituteId: string) {
    const inst = await this.prisma.institute.findUnique({ 
      where: { id: instituteId },
      include: { branches: true, services: true }
    });

    if (!inst) throw new NotFoundException('Institute not found');

    // Validation checks
    if (!inst.name || inst.name === 'Προσωρινό Όνομα') throw new BadRequestException('Please provide a valid institute name');
    if (inst.branches.length === 0) throw new BadRequestException('At least one branch (location) is required');
    if (inst.services.length === 0) throw new BadRequestException('Please select at least one service');

    return this.prisma.institute.update({
      where: { id: instituteId },
      data: { status: 'PENDING' }
    });
  }

  async submitClaim(dto: ClaimSubmitDto) {
    const inst = await this.prisma.institute.findUnique({ where: { id: dto.instituteId } });
    if (!inst) throw new NotFoundException('Institute not found');

    // Check if already claimed
    const existingOpenClaim = await this.prisma.claim.findFirst({
      where: { 
        instituteId: dto.instituteId,
        status: { in: ['SUBMITTED', 'UNDER_REVIEW', 'NEEDS_MORE_INFO'] }
      }
    });
    if (existingOpenClaim) throw new ConflictException('This institute is already being claimed');

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

  async searchToClaim(query: string) {
    return this.prisma.institute.findMany({
      where: {
        AND: [
          { name: { contains: query, mode: 'insensitive' } },
          { isClaimed: false },
          { status: 'APPROVED' } // Only allow claiming public approved listings
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
}
