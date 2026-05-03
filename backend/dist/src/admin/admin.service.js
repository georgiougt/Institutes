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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const audit_service_1 = require("./audit.service");
let AdminService = class AdminService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async getMetrics() {
        const pendingCount = await this.prisma.institute.count({
            where: { status: client_1.ListingStatus.PENDING },
        });
        const approvedInstitutes = await this.prisma.institute.findMany({
            where: { status: client_1.ListingStatus.APPROVED },
            select: { ownerId: true },
            distinct: ['ownerId'],
        });
        const verifiedOwners = approvedInstitutes.length;
        const approvedCount = await this.prisma.institute.count({
            where: { status: client_1.ListingStatus.APPROVED },
        });
        const rejectedCount = await this.prisma.institute.count({
            where: { status: client_1.ListingStatus.REJECTED },
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
        const [totalInstitutes, activeInstitutes, pendingInstitutes, rejectedInstitutes, totalOwners, totalUsers, totalContacts, unreadContacts, openClaims,] = await Promise.all([
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
    async getInstitutes(params) {
        const { page = 1, limit = 25, status, cityId, search, sortBy = 'createdAt', sortOrder = 'desc' } = params;
        const where = { deletedAt: null };
        if (status)
            where.status = status;
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
    async getInstitute(id) {
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
    async updateInstitute(id, data, adminId) {
        const oldVal = await this.prisma.institute.findUnique({ where: { id } });
        const inst = await this.prisma.institute.update({
            where: { id },
            data,
            include: { owner: true, branches: true, services: { include: { service: true } } },
        });
        await this.audit.log({
            actorId: adminId,
            actionType: 'institute.update',
            entityType: 'Institute',
            entityId: id,
            reason: 'Administrative update',
            oldValues: oldVal,
            newValues: data,
        });
        return inst;
    }
    async getInstituteDetail(id) {
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
        if (!institute)
            throw new common_1.NotFoundException(`Institute ${id} not found`);
        return institute;
    }
    async getPendingRequests() {
        return this.prisma.institute.findMany({
            where: { status: client_1.ListingStatus.PENDING },
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
            where: { status: client_1.ListingStatus.REJECTED },
            include: {
                owner: { select: { firstName: true, lastName: true, email: true } },
                branches: { include: { city: true } },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }
    async approveInstitute(id, actorId) {
        const inst = await this.prisma.institute.findUnique({ where: { id } });
        if (!inst)
            throw new common_1.NotFoundException(`Institute ${id} not found`);
        const updated = await this.prisma.institute.update({
            where: { id },
            data: { status: client_1.ListingStatus.APPROVED },
        });
        await this.prisma.instituteStatusHistory.create({
            data: {
                instituteId: id,
                fromStatus: inst.status,
                toStatus: 'APPROVED',
                changedBy: actorId || 'system',
            },
        });
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
    async rejectInstitute(id, reason, actorId) {
        const inst = await this.prisma.institute.findUnique({ where: { id } });
        if (!inst)
            throw new common_1.NotFoundException(`Institute ${id} not found`);
        const updated = await this.prisma.institute.update({
            where: { id },
            data: { status: client_1.ListingStatus.REJECTED },
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
    async suspendInstitute(id, reason, actorId) {
        const inst = await this.prisma.institute.findUnique({ where: { id } });
        if (!inst)
            throw new common_1.NotFoundException(`Institute ${id} not found`);
        if (inst.status !== 'APPROVED')
            throw new common_1.BadRequestException('Only approved institutes can be suspended');
        const updated = await this.prisma.institute.update({
            where: { id },
            data: { status: client_1.ListingStatus.SUSPENDED },
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
    async archiveInstitute(id, actorId) {
        const inst = await this.prisma.institute.findUnique({ where: { id } });
        if (!inst)
            throw new common_1.NotFoundException(`Institute ${id} not found`);
        const updated = await this.prisma.institute.update({
            where: { id },
            data: { status: 'ARCHIVED' },
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
    async getUsers(params = {}) {
        const { page = 1, limit = 25, role, search } = params;
        const where = {};
        if (role)
            where.role = role;
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
        const mappedData = data.map((user) => ({
            ...user,
            isActive: !user.isSuspended,
        }));
        return {
            data: mappedData,
            meta: { total, page, limit, pages: Math.ceil(total / limit) },
        };
    }
    async updateUserStatus(id, isActive, adminId) {
        const oldVal = await this.prisma.user.findUnique({ where: { id } });
        if (!oldVal)
            throw new Error(`User ${id} not found`);
        const user = await this.prisma.user.update({
            where: { id },
            data: {
                isSuspended: !isActive,
                suspendedAt: !isActive ? new Date() : null,
            },
        });
        await this.audit.log({
            actorId: adminId,
            actionType: isActive ? 'user.activate' : 'user.deactivate',
            entityType: 'User',
            entityId: id,
            reason: 'Administrative action',
            oldValues: { isSuspended: oldVal.isSuspended },
            newValues: { isSuspended: !isActive },
        });
        return { ...user, isActive };
    }
    async getContactRequests(params = {}) {
        const { page = 1, limit = 25, status } = params;
        const where = {};
        if (status)
            where.status = status;
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
    async updateContactRequestStatus(id, status, adminId) {
        const oldVal = await this.prisma.contactRequest.findUnique({ where: { id } });
        if (!oldVal)
            throw new common_1.NotFoundException(`Contact request ${id} not found`);
        const updated = await this.prisma.contactRequest.update({
            where: { id },
            data: { status: status },
        });
        await this.audit.log({
            actorId: adminId,
            actionType: 'contact.update_status',
            entityType: 'ContactRequest',
            entityId: id,
            reason: `Status changed from ${oldVal.status} to ${status}`,
            oldValues: { status: oldVal.status },
            newValues: { status },
        });
        return updated;
    }
    async getServices() {
        return this.prisma.service.findMany({
            include: {
                _count: { select: { institutes: true } },
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async createService(data) {
        return this.prisma.service.create({ data });
    }
    async updateService(id, data, adminId) {
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
    async deleteService(id) {
        const count = await this.prisma.instituteService.count({ where: { serviceId: id } });
        if (count > 0)
            throw new common_1.BadRequestException(`Cannot delete: ${count} institutes use this service`);
        return this.prisma.service.delete({ where: { id } });
    }
    async getCities() {
        return this.prisma.city.findMany({
            include: {
                _count: { select: { branches: true, areas: true } },
            },
            orderBy: { displayOrder: 'asc' },
        });
    }
    async getAreas(cityId) {
        const where = {};
        if (cityId)
            where.cityId = cityId;
        return this.prisma.area.findMany({
            where,
            include: {
                city: { select: { name: true } },
                _count: { select: { branches: true } },
            },
            orderBy: { name: 'asc' },
        });
    }
    async getAuditLogs(params) {
        return this.audit.findAll(params);
    }
    async bulkApprove(ids, adminId) {
        const results = [];
        for (const id of ids) {
            try {
                await this.approveInstitute(id, adminId);
                results.push({ id, status: 'success' });
            }
            catch (err) {
                results.push({ id, status: 'error', error: err.message });
            }
        }
        return results;
    }
    async bulkReject(ids, reason, adminId) {
        const results = [];
        for (const id of ids) {
            try {
                await this.rejectInstitute(id, reason, adminId);
                results.push({ id, status: 'success' });
            }
            catch (err) {
                results.push({ id, status: 'error', error: err.message });
            }
        }
        return results;
    }
    async bulkDelete(ids, adminId) {
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
            }
            catch (err) {
                results.push({ id, status: 'error', error: err.message });
            }
        }
        return results;
    }
    async getRevisions(status) {
        return this.prisma.instituteRevision.findMany({
            where: status ? { status: status } : {},
            include: {
                institute: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async approveRevision(id, adminId) {
        const rev = await this.prisma.instituteRevision.findUnique({
            where: { id },
            include: { institute: true }
        });
        if (!rev || rev.status !== 'PENDING') {
            throw new common_1.BadRequestException('Revision not found or not pending');
        }
        const proposedData = rev.proposedData;
        return this.prisma.$transaction(async (tx) => {
            await tx.institute.update({
                where: { id: rev.instituteId },
                data: proposedData
            });
            await tx.instituteRevision.update({
                where: { id },
                data: {
                    status: 'APPROVED',
                    appliedAt: new Date(),
                    appliedBy: adminId
                }
            });
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
    async rejectRevision(id, adminNote, adminId) {
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
    async getNotifications() {
        const [pendingInstitutes, newContacts, pendingReviews, newClaims] = await Promise.all([
            this.prisma.institute.findMany({
                where: { status: client_1.ListingStatus.PENDING },
                select: { id: true, name: true, createdAt: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.contactRequest.findMany({
                where: { status: 'NEW' },
                select: { id: true, guestName: true, user: { select: { firstName: true, lastName: true } }, createdAt: true, message: true },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.review.findMany({
                where: { status: 'PENDING' },
                select: { id: true, rating: true, comment: true, createdAt: true, guestName: true, user: { select: { firstName: true, lastName: true } } },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.claim.findMany({
                where: { status: 'SUBMITTED' },
                select: { id: true, createdAt: true, claimerEmail: true, instituteId: true, institute: { select: { name: true } } },
                take: 5,
                orderBy: { createdAt: 'desc' },
            }),
        ]);
        const notifications = [
            ...pendingInstitutes.map(i => ({
                id: i.id,
                type: 'INSTITUTE',
                title: 'New Registration',
                message: `${i.name} is waiting for approval`,
                createdAt: i.createdAt,
                link: `/admin/institutes/${i.id}`,
            })),
            ...newContacts.map(c => ({
                id: c.id,
                type: 'CONTACT',
                title: 'New Message',
                message: `From ${c.user ? `${c.user.firstName} ${c.user.lastName}` : c.guestName || 'Guest'}`,
                createdAt: c.createdAt,
                link: `/admin/contact-requests?status=NEW`,
            })),
            ...pendingReviews.map(r => ({
                id: r.id,
                type: 'REVIEW',
                title: 'New Review',
                message: `${r.rating} stars: ${r.comment ? (r.comment.substring(0, 30) + '...') : 'No comment'}`,
                createdAt: r.createdAt,
                link: `/admin/reviews?status=PENDING`,
            })),
            ...newClaims.map(cl => ({
                id: cl.id,
                type: 'CLAIM',
                title: 'New Claim',
                message: `Claim for ${cl.institute.name}`,
                createdAt: cl.createdAt,
                link: `/admin/institutes/${cl.instituteId}?tab=claims`,
            })),
        ];
        notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        const totalCount = await Promise.all([
            this.prisma.institute.count({ where: { status: client_1.ListingStatus.PENDING } }),
            this.prisma.contactRequest.count({ where: { status: 'NEW' } }),
            this.prisma.review.count({ where: { status: 'PENDING' } }),
            this.prisma.claim.count({ where: { status: 'SUBMITTED' } }),
        ]).then(counts => counts.reduce((a, b) => a + b, 0));
        return {
            items: notifications.slice(0, 10),
            totalCount,
        };
    }
    async getDashboardAnalytics() {
        const fourteenDaysAgo = new Date();
        fourteenDaysAgo.setHours(0, 0, 0, 0);
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
        const [registrations, services, statuses] = await Promise.all([
            this.prisma.institute.findMany({
                where: { createdAt: { gte: fourteenDaysAgo } },
                select: { createdAt: true },
            }),
            this.prisma.instituteService.findMany({
                select: { service: { select: { name: true } } },
            }),
            this.prisma.institute.groupBy({
                by: ['status'],
                _count: { id: true },
            }),
        ]);
        const dailyMap = {};
        for (let i = 13; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const label = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            dailyMap[label] = 0;
        }
        registrations.forEach(r => {
            const label = r.createdAt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
            if (dailyMap[label] !== undefined)
                dailyMap[label]++;
        });
        const dailyRegistrations = Object.entries(dailyMap).map(([date, count]) => ({ date, count }));
        const dailyTraffic = dailyRegistrations.map(day => ({
            date: day.date,
            count: Math.floor(Math.random() * 80) + 40
        }));
        const serviceMap = {};
        services.forEach(s => {
            const name = s.service.name;
            serviceMap[name] = (serviceMap[name] || 0) + 1;
        });
        const categoryDistribution = Object.entries(serviceMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
        const statusBreakdown = statuses.map(s => ({
            name: s.status,
            value: s._count.id,
        }));
        return {
            dailyRegistrations,
            dailyTraffic,
            categoryDistribution,
            statusBreakdown,
        };
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], AdminService);
//# sourceMappingURL=admin.service.js.map