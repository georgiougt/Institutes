import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListingStatus } from '@prisma/client';
import { AuditService } from './audit.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ─── DASHBOARD ────────────────────────────────────────────────

  async getMetrics() {
    const pendingCount = await this.prisma.institute.count({
      where: { status: ListingStatus.PENDING },
    });

    const approvedInstitutes = await this.prisma.institute.findMany({
      where: { status: ListingStatus.APPROVED },
      select: { ownerId: true },
      distinct: ['ownerId'],
    });
    const verifiedOwners = approvedInstitutes.length;

    const approvedCount = await this.prisma.institute.count({
      where: { status: ListingStatus.APPROVED },
    });
    const rejectedCount = await this.prisma.institute.count({
      where: { status: ListingStatus.REJECTED },
    });

    const totalProcessed = approvedCount + rejectedCount;
    const approvalRate = totalProcessed > 0
      ? Math.round((approvedCount / totalProcessed) * 100)
      : 100;

    return {
      pendingRequests: pendingCount,
      verifiedOwners,
      approvalRate,
    };
  }

  async getDashboardCounts() {
    const [
      totalInstitutes,
      activeInstitutes,
      pendingInstitutes,
      rejectedInstitutes,
      totalOwners,
      totalUsers,
      totalContacts,
      unreadContacts,
      openClaims,
    ] = await Promise.all([
      this.prisma.institute.count(),
      this.prisma.institute.count({ where: { status: 'APPROVED' } }),
      this.prisma.institute.count({ where: { status: 'PENDING' } }),
      this.prisma.institute.count({ where: { status: 'REJECTED' } }),
      this.prisma.user.count({ where: { role: 'OWNER' } }),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.contactRequest.count(),
      this.prisma.contactRequest.count({ where: { status: 'NEW' } }),
      this.prisma.claim.count({ where: { status: 'SUBMITTED' } }),
    ]);

    return {
      totalInstitutes,
      activeInstitutes,
      pendingInstitutes,
      rejectedInstitutes,
      totalOwners,
      totalUsers,
      totalContacts,
      unreadContacts,
      openClaims,
      featuredCount: 0,
    };
  }

  // ─── INSTITUTES ───────────────────────────────────────────────

  async getInstitutes(params: {
    page?: number;
    limit?: number;
    status?: string;
    cityId?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const { page = 1, limit = 25, status, cityId, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: any = { deletedAt: null };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { owner: { email: { contains: search, mode: 'insensitive' } } },
        { owner: { firstName: { contains: search, mode: 'insensitive' } } },
      ];
    }
    if (cityId) {
      where.branches = { some: { cityId } };
    }

    const [data, total] = await Promise.all([
      this.prisma.institute.findMany({
        where,
        include: {
          owner: { select: { id: true, firstName: true, lastName: true, email: true } },
          branches: { include: { city: true }, take: 1, where: { isMain: true } },
          services: { include: { service: true } },
          images: { take: 1 },
          _count: { select: { contactRequests: true, branches: true, services: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.institute.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  async getInstitute(id: string) {
    return this.prisma.institute.findUnique({
      where: { id },
      include: {
        owner: true,
        branches: {
          include: {
            city: true,
            area: true,
          },
        },
        services: {
          include: {
            service: true,
          },
        },
        images: true,
        statusHistory: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        _count: {
          select: {
            branches: true,
            services: true,
            images: true,
            contactRequests: true,
          },
        },
      },
    });
  }

  async updateInstitute(id: string, data: any, adminId: string) {
    const oldVal = await this.prisma.institute.findUnique({ where: { id } });
    const inst = await this.prisma.institute.update({
      where: { id },
      data,
      include: { owner: true, branches: true, services: { include: { service: true } } },
    });

    await this.audit.log({
      actorId: adminId, // Changed from adminId to actorId to match AuditService
      actionType: 'institute.update',
      entityType: 'Institute',
      entityId: id,
      reason: 'Administrative update',
      oldValues: oldVal,
      newValues: data,
    });

    return inst;
  }

  async getInstituteDetail(id: string) {
    const institute = await this.prisma.institute.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, createdAt: true } },
        branches: {
          include: {
            city: true,
            area: true,
            schedules: true,
          },
        },
        services: { include: { service: true } },
        images: { orderBy: { order: 'asc' } },
        contactRequests: { orderBy: { createdAt: 'desc' }, take: 10 },
        claims: { orderBy: { createdAt: 'desc' } },
        moderationNotes: { orderBy: { createdAt: 'desc' } },
        statusHistory: { orderBy: { createdAt: 'desc' } },
        _count: { select: { contactRequests: true, branches: true, services: true, images: true } },
      },
    });

    if (!institute) throw new NotFoundException(`Institute ${id} not found`);
    return institute;
  }

  async getPendingRequests() {
    return this.prisma.institute.findMany({
      where: { status: ListingStatus.PENDING },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } },
        branches: { include: { city: true } },
        services: { include: { service: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getRejectedRequests() {
    return this.prisma.institute.findMany({
      where: { status: ListingStatus.REJECTED },
      include: {
        owner: { select: { firstName: true, lastName: true, email: true } },
        branches: { include: { city: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async approveInstitute(id: string, actorId?: string) {
    const inst = await this.prisma.institute.findUnique({ where: { id } });
    if (!inst) throw new NotFoundException(`Institute ${id} not found`);

    const updated = await this.prisma.institute.update({
      where: { id },
      data: { status: ListingStatus.APPROVED },
    });

    // Status history
    await this.prisma.instituteStatusHistory.create({
      data: {
        instituteId: id,
        fromStatus: inst.status,
        toStatus: 'APPROVED',
        changedBy: actorId || 'system',
      },
    });

    // Audit
    if (actorId) {
      await this.audit.log({
        actorId,
        actionType: 'institute.approve',
        entityType: 'Institute',
        entityId: id,
        oldValues: { status: inst.status },
        newValues: { status: 'APPROVED' },
      });
    }

    return updated;
  }

  async rejectInstitute(id: string, reason: string, actorId?: string) {
    const inst = await this.prisma.institute.findUnique({ where: { id } });
    if (!inst) throw new NotFoundException(`Institute ${id} not found`);

    const updated = await this.prisma.institute.update({
      where: { id },
      data: { status: ListingStatus.REJECTED },
    });

    await this.prisma.instituteStatusHistory.create({
      data: {
        instituteId: id,
        fromStatus: inst.status,
        toStatus: 'REJECTED',
        reason,
        changedBy: actorId || 'system',
      },
    });

    if (actorId) {
      await this.audit.log({
        actorId,
        actionType: 'institute.reject',
        entityType: 'Institute',
        entityId: id,
        oldValues: { status: inst.status },
        newValues: { status: 'REJECTED' },
        reason,
      });
    }

    return updated;
  }

  async suspendInstitute(id: string, reason: string, actorId?: string) {
    const inst = await this.prisma.institute.findUnique({ where: { id } });
    if (!inst) throw new NotFoundException(`Institute ${id} not found`);
    if (inst.status !== 'APPROVED') throw new BadRequestException('Only approved institutes can be suspended');

    const updated = await this.prisma.institute.update({
      where: { id },
      data: { status: ListingStatus.SUSPENDED },
    });

    await this.prisma.instituteStatusHistory.create({
      data: {
        instituteId: id,
        fromStatus: inst.status,
        toStatus: 'SUSPENDED',
        reason,
        changedBy: actorId || 'system',
      },
    });

    if (actorId) {
      await this.audit.log({
        actorId,
        actionType: 'institute.suspend',
        entityType: 'Institute',
        entityId: id,
        oldValues: { status: inst.status },
        newValues: { status: 'SUSPENDED' },
        reason,
      });
    }

    return updated;
  }

  async archiveInstitute(id: string, actorId?: string) {
    const inst = await this.prisma.institute.findUnique({ where: { id } });
    if (!inst) throw new NotFoundException(`Institute ${id} not found`);

    const updated = await this.prisma.institute.update({
      where: { id },
      data: { status: 'ARCHIVED' as any },
    });

    await this.prisma.instituteStatusHistory.create({
      data: {
        instituteId: id,
        fromStatus: inst.status,
        toStatus: 'ARCHIVED',
        changedBy: actorId || 'system',
      },
    });

    if (actorId) {
      await this.audit.log({
        actorId,
        actionType: 'institute.archive',
        entityType: 'Institute',
        entityId: id,
        oldValues: { status: inst.status },
        newValues: { status: 'ARCHIVED' },
      });
    }

    return updated;
  }

  // ─── USERS & OWNERS ──────────────────────────────────────────

  async getUsers(params: { page?: number; limit?: number; role?: string; search?: string } = {}) {
    const { page = 1, limit = 25, role, search } = params;

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        include: {
          ownedInstitutes: { select: { id: true, name: true, status: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // ─── CONTACT REQUESTS ────────────────────────────────────────

  async getContactRequests(params: { page?: number; limit?: number; status?: string } = {}) {
    const { page = 1, limit = 25, status } = params;
    const where: any = {};
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.contactRequest.findMany({
        where,
        include: {
          institute: { select: { id: true, name: true } },
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.contactRequest.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, pages: Math.ceil(total / limit) },
    };
  }

  // ─── SERVICES ────────────────────────────────────────────────

  async getServices() {
    return this.prisma.service.findMany({
      include: {
        _count: { select: { institutes: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async createService(data: { name: string; category?: string; slug?: string }) {
    return this.prisma.service.create({ data });
  }

  async updateService(id: string, data: { name?: string; category?: string; isActive?: boolean; displayOrder?: number }, adminId: string) {
    const oldVal = await this.prisma.service.findUnique({ where: { id } });
    const svc = await this.prisma.service.update({
      where: { id },
      data,
    });

    await this.audit.log({
      actorId: adminId,
      actionType: 'service.update',
      entityType: 'Service',
      entityId: id,
      oldValues: oldVal,
      newValues: data,
    });

    return svc;
  }

  async deleteService(id: string) {
    const count = await this.prisma.instituteService.count({ where: { serviceId: id } });
    if (count > 0) throw new BadRequestException(`Cannot delete: ${count} institutes use this service`);
    return this.prisma.service.delete({ where: { id } });
  }

  // ─── LOCATIONS ───────────────────────────────────────────────

  async getCities() {
    return this.prisma.city.findMany({
      include: {
        _count: { select: { branches: true, areas: true } },
      },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async getAreas(cityId?: string) {
    const where: any = {};
    if (cityId) where.cityId = cityId;
    return this.prisma.area.findMany({
      where,
      include: {
        city: { select: { name: true } },
        _count: { select: { branches: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  // ─── AUDIT LOGS (pass-through) ───────────────────────────────

  async getAuditLogs(params: any) {
    return this.audit.findAll(params);
  }
  // ─── Bulk Actions ──────────────────────────────────────────

  async bulkApprove(ids: string[], adminId: string) {
    const results = [];
    for (const id of ids) {
      try {
        await this.approveInstitute(id, adminId);
        results.push({ id, status: 'success' });
      } catch (err) {
        results.push({ id, status: 'error', error: err.message });
      }
    }
    return results;
  }

  async bulkReject(ids: string[], reason: string, adminId: string) {
    const results = [];
    for (const id of ids) {
      try {
        await this.rejectInstitute(id, reason, adminId);
        results.push({ id, status: 'success' });
      } catch (err) {
        results.push({ id, status: 'error', error: err.message });
      }
    }
    return results;
  }

  async bulkDelete(ids: string[], adminId: string) {
    const results = [];
    for (const id of ids) {
      try {
        const inst = await this.prisma.institute.findUnique({ where: { id } });
        if (inst) {
          await this.audit.log({
            actorId: adminId,
            actionType: 'institute.delete',
            entityType: 'Institute',
            entityId: id,
            reason: 'Bulk deletion',
            oldValues: inst,
          });
          await this.prisma.institute.delete({ where: { id } });
        }
        results.push({ id, status: 'success' });
      } catch (err) {
        results.push({ id, status: 'error', error: err.message });
      }
    }
    return results;
  }
  // ─── REVISIONS ──────────────────────────────────────────────

  async getRevisions(status?: string) {
    return this.prisma.instituteRevision.findMany({
      where: status ? { status: status as any } : {},
      include: {
        institute: { select: { id: true, name: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async approveRevision(id: string, adminId: string) {
    const rev = await this.prisma.instituteRevision.findUnique({
      where: { id },
      include: { institute: true }
    });

    if (!rev || rev.status !== 'PENDING') {
      throw new BadRequestException('Revision not found or not pending');
    }

    const proposedData = rev.proposedData as any;

    return this.prisma.$transaction(async (tx) => {
      // 1. Update Institute
      await tx.institute.update({
        where: { id: rev.instituteId },
        data: proposedData
      });

      // 2. Mark Revision as Applied
      await tx.instituteRevision.update({
        where: { id },
        data: {
          status: 'APPROVED',
          appliedAt: new Date(),
          appliedBy: adminId
        }
      });

      // 3. Log Audit
      await this.audit.log({
        actorId: adminId,
        actionType: 'institute.revision.approve',
        entityType: 'Institute',
        entityId: rev.instituteId,
        oldValues: rev.currentData,
        newValues: proposedData
      });

      return { success: true };
    });
  }

  async rejectRevision(id: string, adminNote: string, adminId: string) {
    return this.prisma.instituteRevision.update({
      where: { id },
      data: {
        status: 'REJECTED',
        adminNote,
        appliedAt: new Date(),
        appliedBy: adminId
      }
    });
  }
}

