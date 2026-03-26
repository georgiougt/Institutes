import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateInstituteProfileDto } from './dto/owner-dashboard.dto';

@Injectable()
export class InstituteMgmtService {
  constructor(private prisma: PrismaService) {}

  async getDashboardMetrics(instituteId: string) {
    const institute = await this.prisma.institute.findUnique({
      where: { id: instituteId },
      include: {
        branches: true,
        services: true,
        images: true,
        contactRequests: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!institute) throw new NotFoundException('Institute not found');

    const unreadInquiries = await this.prisma.contactRequest.count({
      where: { instituteId, status: 'NEW' }
    });

    const completeness = this.calculateCompleteness(institute);

    return {
      status: institute.status,
      completeness,
      unreadInquiries,
      recentInquiries: institute.contactRequests,
      stats: {
        branches: institute.branches.length,
        services: institute.services.length,
        images: institute.images.length
      }
    };
  }

  private calculateCompleteness(institute: any): number {
    let score = 0;
    if (institute.name) score += 10;
    if (institute.description && (institute.description as string).length > 50) score += 15;
    if (institute.logoUrl) score += 10;
    if (institute.website) score += 5;
    if (institute.branches && (institute.branches as any[]).length > 0) score += 20;
    if (institute.branches && (institute.branches as any[]).some((b: any) => b.latitude && b.longitude)) score += 10;
    if (institute.services && (institute.services as any[]).length > 0) score += 15;
    if (institute.images && (institute.images as any[]).length > 0) score += 15;
    return Math.min(score, 100);
  }

  async updateProfile(instituteId: string, dto: UpdateInstituteProfileDto) {
    const sensitiveFields = ['name', 'slug', 'logoUrl', 'website'];
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
    return this.prisma.institute.update({
      where: { id: instituteId },
      data: normalData
    });
  }

  async getInquiries(instituteId: string) {
    return this.prisma.contactRequest.findMany({
      where: { instituteId },
      include: { notes: true },
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
        isApproved: false // Requires admin mod eventually
      }
    });
  }

  async deleteImage(imageId: string) {
    return this.prisma.image.delete({
      where: { id: imageId }
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
}
