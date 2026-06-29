import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInstituteProfileDto } from './dto/owner-dashboard.dto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import * as bcrypt from 'bcryptjs';
import { generateSlug } from '../common/slugify';


@Injectable()
export class InstituteMgmtService {
  private supabase: SupabaseClient;

  constructor(private prisma: PrismaService) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async getDashboardMetrics(instituteId: string) {
    const institute = await this.prisma.institute.findUnique({
      where: { id: instituteId },
      include: {
        branches: { include: { schedules: true } },
        services: true,
        images: true,
        contactRequests: {
          include: { service: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!institute) throw new NotFoundException('Institute not found');

    const unreadInquiries = await this.prisma.contactRequest.count({
      where: { instituteId, status: 'NEW' }
    });

    const completenessData = this.calculateCompleteness(institute);

    return {
      status: institute.status,
      completeness: completenessData.score,
      completenessSteps: completenessData.steps,
      unreadInquiries,
      recentInquiries: institute.contactRequests,
      stats: {
        branches: institute.branches.length,
        services: institute.services.length,
        images: institute.images.length
      }
    };
  }

  private calculateCompleteness(institute: any): { score: number, steps: any[] } {
    const steps = [
      { label: 'Add a profile logo', path: 'profile', value: 10, completed: !!institute.logoUrl },
      { label: 'Add a detailed description', path: 'profile', value: 15, completed: !!(institute.description && (institute.description as string).length >= 35) },
      { label: 'Add images to media gallery', path: 'media', value: 15, completed: !!(institute.images && (institute.images as any[]).length > 0) },
      { label: 'Define operating schedule', path: 'schedules', value: 10, completed: !!(institute.branches && (institute.branches as any[]).some((b: any) => b.schedules && b.schedules.length > 0)) },
      { label: 'Add at least one branch', path: 'branches', value: 15, completed: !!(institute.branches && (institute.branches as any[]).length > 0) },
      { label: 'Set branch location on map', path: 'branches', value: 10, completed: !!(institute.branches && (institute.branches as any[]).some((b: any) => b.latitude && b.longitude)) },
      { label: 'Add services or subjects', path: 'services', value: 15, completed: !!(institute.services && (institute.services as any[]).length > 0) },
      { label: 'Provide basic info (Name)', path: 'profile', value: 5, completed: !!institute.name },
      { label: 'Add a website URL', path: 'profile', value: 5, completed: !!institute.website }
    ];

    const score = steps.reduce((acc, step) => acc + (step.completed ? step.value : 0), 0);
    return { score: Math.min(score, 100), steps };
  }

  async updateProfile(instituteId: string, dto: UpdateInstituteProfileDto) {
    const sensitiveFields = ['name', 'slug', 'logoUrl'];
    const current = await this.prisma.institute.findUnique({ where: { id: instituteId } });
    if (!current) throw new NotFoundException('Institute not found');

    const proposedData: any = {};
    const normalData: any = { ...dto };

    sensitiveFields.forEach(field => {
      const dtoValue = (dto as any)[field];
      const currentValue = (current as any)[field];
      if (dtoValue !== undefined && dtoValue !== currentValue) {
        proposedData[field] = dtoValue;
        delete (normalData as any)[field];
      }
    });

    // If there are sensitive changes, create a revision
    if (Object.keys(proposedData).length > 0) {
      const currentDataSnapshot: any = {};
      sensitiveFields.forEach(f => { currentDataSnapshot[f] = (current as any)[f]; });

      await this.prisma.instituteRevision.create({
        data: {
          instituteId,
          proposedData,
          currentData: currentDataSnapshot,
          status: 'PENDING'
        }
      });
    }

    // Update normal fields immediately
    const updateData = { ...normalData };
    if (!current.slug) {
      updateData.slug = generateSlug(current.name);
    }

    return this.prisma.institute.update({
      where: { id: instituteId },
      data: updateData
    });
  }

  async getInquiries(instituteId: string) {
    return this.prisma.contactRequest.findMany({
      where: { instituteId },
      include: { 
        notes: true,
        service: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateInquiryStatus(inquiryId: string, status: any) {
    return this.prisma.contactRequest.update({
      where: { id: inquiryId },
      data: { status }
    });
  }

  async updateServices(instituteId: string, serviceIds: string[]) {
    return this.prisma.$transaction(async (tx) => {
      // Remove existing
      await tx.instituteService.deleteMany({
        where: { instituteId }
      });
      // Add new
      if (serviceIds.length > 0) {
        await tx.instituteService.createMany({
          data: serviceIds.map(sid => ({
            instituteId,
            serviceId: sid
          }))
        });
      }
      return { success: true, count: serviceIds.length };
    });
  }

  // ─── SCHEDULES ──────────────────────────────────────────────────────────

  async getSchedules(instituteId: string) {
    return this.prisma.schedule.findMany({
      where: { branch: { instituteId } },
      include: { branch: true }
    });
  }

  async updateBranchSchedules(branchId: string, schedules: any[]) {
    return this.prisma.$transaction(async (tx) => {
      // Remove existing for this branch
      await tx.schedule.deleteMany({
        where: { branchId }
      });
      // Add new
      if (schedules.length > 0) {
        await tx.schedule.createMany({
          data: schedules.map(s => ({
            branchId,
            dayOfWeek: s.dayOfWeek,
            openTime: s.openTime || '09:00',
            closeTime: s.closeTime || '18:00',
            isClosed: s.isClosed ?? false
          }))
        });
      }
      return { success: true };
    });
  }

  // ─── MEDIA / IMAGES ─────────────────────────────────────────────────────

  async getImages(instituteId: string) {
    return this.prisma.image.findMany({
      where: { instituteId },
      orderBy: { order: 'asc' }
    });
  }

  async addImage(instituteId: string, url: string, caption?: string) {
    return this.prisma.image.create({
      data: {
        instituteId,
        url,
        caption,
        isApproved: true // Auto-approved for now as per owner feedback
      }
    });
  }

  async deleteImage(imageId: string) {
    return this.prisma.image.delete({
      where: { id: imageId }
    });
  }

  async setCoverImage(instituteId: string, imageId: string) {
    return this.prisma.$transaction(async (tx) => {
      // Reset all images order for this institute
      await tx.image.updateMany({
        where: { instituteId },
        data: { order: 0 }
      });
      // Set selected image as cover (order = -1)
      return tx.image.update({
        where: { id: imageId },
        data: { order: -1 }
      });
    });
  }

  async setLogo(instituteId: string, url: string) {
    return this.prisma.institute.update({
      where: { id: instituteId },
      data: { logoUrl: url }
    });
  }

  // ─── TEAM ACCESS ────────────────────────────────────────────────────────

  async getTeam(instituteId: string) {
    return this.prisma.instituteMember.findMany({
      where: { instituteId },
      include: { 
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });
  }

  async addMemberByEmail(instituteId: string, email: string, role: 'MANAGER' | 'STAFF') {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User with this email not found');

    return this.prisma.instituteMember.upsert({
      where: {
        instituteId_userId: {
          instituteId,
          userId: user.id
        }
      },
      update: { role },
      create: {
        instituteId,
        userId: user.id,
        role
      }
    });
  }

  async removeMember(memberId: string) {
    return this.prisma.instituteMember.delete({
      where: { id: memberId }
    });
  }

  async updateBranch(branchId: string, dto: any) {
    if (dto.cityId && dto.radius === undefined) {
       // Optional: logic to clear radius or handle city change
    }
    return this.prisma.branch.update({
      where: { id: branchId },
      data: dto
    });
  }

  // ─── OWNER ACCOUNT ──────────────────────────────────────────────────────

  async updateOwnerEmail(userId: string, newEmail: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    // Update in Supabase - this will trigger a verification email
    const { error } = await this.supabase.auth.admin.updateUserById(userId, {
      email: newEmail,
      // If we want to skip confirmation, we can use email_confirm: true
      // But for security, we should let Supabase handle the confirmation flow
    });

    if (error) {
      console.warn(`Supabase update failed for user ${userId} (${error.message}). Proceeding to update local DB only.`);
    }

    // Update locally too (we sync email for login fallbacks and metadata)
    return this.prisma.user.update({
      where: { id: userId },
      data: { email: newEmail }
    });
  }

  async updateOwnerProfile(userId: string, dto: { firstName?: string; lastName?: string; phone?: string }) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto
    });
  }

  async updateOwnerPassword(userId: string, newPasswordPlain: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const passwordHash = await bcrypt.hash(newPasswordPlain, 10);

    // Try updating Supabase first (if the user exists there)
    const { error } = await this.supabase.auth.admin.updateUserById(userId, {
      password: newPasswordPlain,
    });

    if (error) {
      console.warn(`Supabase password update failed for user ${userId} (${error.message}). Proceeding to update local DB only.`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });
  }
}
