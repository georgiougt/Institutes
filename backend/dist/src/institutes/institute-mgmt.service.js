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
exports.InstituteMgmtService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const supabase_js_1 = require("@supabase/supabase-js");
let InstituteMgmtService = class InstituteMgmtService {
    prisma;
    supabase;
    constructor(prisma) {
        this.prisma = prisma;
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key';
        this.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
    }
    async getDashboardMetrics(instituteId) {
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
        if (!institute)
            throw new common_1.NotFoundException('Institute not found');
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
    calculateCompleteness(institute) {
        const steps = [
            { label: 'Add a profile logo', path: 'profile', value: 10, completed: !!institute.logoUrl },
            { label: 'Add a detailed description', path: 'profile', value: 15, completed: !!(institute.description && institute.description.length >= 35) },
            { label: 'Add images to media gallery', path: 'media', value: 15, completed: !!(institute.images && institute.images.length > 0) },
            { label: 'Define operating schedule', path: 'schedules', value: 10, completed: !!(institute.branches && institute.branches.some((b) => b.schedules && b.schedules.length > 0)) },
            { label: 'Add at least one branch', path: 'branches', value: 15, completed: !!(institute.branches && institute.branches.length > 0) },
            { label: 'Set branch location on map', path: 'branches', value: 10, completed: !!(institute.branches && institute.branches.some((b) => b.latitude && b.longitude)) },
            { label: 'Add services or subjects', path: 'services', value: 15, completed: !!(institute.services && institute.services.length > 0) },
            { label: 'Provide basic info (Name)', path: 'profile', value: 5, completed: !!institute.name },
            { label: 'Add a website URL', path: 'profile', value: 5, completed: !!institute.website }
        ];
        const score = steps.reduce((acc, step) => acc + (step.completed ? step.value : 0), 0);
        return { score: Math.min(score, 100), steps };
    }
    async updateProfile(instituteId, dto) {
        const sensitiveFields = ['name', 'slug', 'logoUrl', 'website'];
        const current = await this.prisma.institute.findUnique({ where: { id: instituteId } });
        if (!current)
            throw new common_1.NotFoundException('Institute not found');
        const proposedData = {};
        const normalData = { ...dto };
        sensitiveFields.forEach(field => {
            const dtoValue = dto[field];
            const currentValue = current[field];
            if (dtoValue !== undefined && dtoValue !== currentValue) {
                proposedData[field] = dtoValue;
                delete normalData[field];
            }
        });
        if (Object.keys(proposedData).length > 0) {
            const currentDataSnapshot = {};
            sensitiveFields.forEach(f => { currentDataSnapshot[f] = current[f]; });
            await this.prisma.instituteRevision.create({
                data: {
                    instituteId,
                    proposedData,
                    currentData: currentDataSnapshot,
                    status: 'PENDING'
                }
            });
        }
        return this.prisma.institute.update({
            where: { id: instituteId },
            data: normalData
        });
    }
    async getInquiries(instituteId) {
        return this.prisma.contactRequest.findMany({
            where: { instituteId },
            include: {
                notes: true,
                service: true
            },
            orderBy: { createdAt: 'desc' }
        });
    }
    async updateInquiryStatus(inquiryId, status) {
        return this.prisma.contactRequest.update({
            where: { id: inquiryId },
            data: { status }
        });
    }
    async updateServices(instituteId, serviceIds) {
        return this.prisma.$transaction(async (tx) => {
            await tx.instituteService.deleteMany({
                where: { instituteId }
            });
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
    async getSchedules(instituteId) {
        return this.prisma.schedule.findMany({
            where: { branch: { instituteId } },
            include: { branch: true }
        });
    }
    async updateBranchSchedules(branchId, schedules) {
        return this.prisma.$transaction(async (tx) => {
            await tx.schedule.deleteMany({
                where: { branchId }
            });
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
    async getImages(instituteId) {
        return this.prisma.image.findMany({
            where: { instituteId },
            orderBy: { order: 'asc' }
        });
    }
    async addImage(instituteId, url, caption) {
        return this.prisma.image.create({
            data: {
                instituteId,
                url,
                caption,
                isApproved: true
            }
        });
    }
    async deleteImage(imageId) {
        return this.prisma.image.delete({
            where: { id: imageId }
        });
    }
    async setCoverImage(instituteId, imageId) {
        return this.prisma.$transaction(async (tx) => {
            await tx.image.updateMany({
                where: { instituteId },
                data: { order: 0 }
            });
            return tx.image.update({
                where: { id: imageId },
                data: { order: -1 }
            });
        });
    }
    async setLogo(instituteId, url) {
        return this.prisma.institute.update({
            where: { id: instituteId },
            data: { logoUrl: url }
        });
    }
    async getTeam(instituteId) {
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
    async addMemberByEmail(instituteId, email, role) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User with this email not found');
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
    async removeMember(memberId) {
        return this.prisma.instituteMember.delete({
            where: { id: memberId }
        });
    }
    async updateBranch(branchId, dto) {
        if (dto.cityId && dto.radius === undefined) {
        }
        return this.prisma.branch.update({
            where: { id: branchId },
            data: dto
        });
    }
    async updateOwnerEmail(userId, newEmail) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { error } = await this.supabase.auth.admin.updateUserById(userId, {
            email: newEmail,
        });
        if (error) {
            throw new common_1.BadRequestException(`Supabase Error: ${error.message}. (Make sure SUPABASE_SERVICE_ROLE_KEY is set in your backend env vars)`);
        }
        return this.prisma.user.update({
            where: { id: userId },
            data: { email: newEmail }
        });
    }
    async updateOwnerProfile(userId, dto) {
        return this.prisma.user.update({
            where: { id: userId },
            data: dto
        });
    }
};
exports.InstituteMgmtService = InstituteMgmtService;
exports.InstituteMgmtService = InstituteMgmtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InstituteMgmtService);
//# sourceMappingURL=institute-mgmt.service.js.map