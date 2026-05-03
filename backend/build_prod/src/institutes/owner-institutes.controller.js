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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OwnerInstitutesController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const institute_mgmt_service_1 = require("./institute-mgmt.service");
const storage_service_1 = require("../common/storage/storage.service");
const owner_dashboard_dto_1 = require("./dto/owner-dashboard.dto");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let OwnerInstitutesController = class OwnerInstitutesController {
    mgmtService;
    storageService;
    constructor(mgmtService, storageService) {
        this.mgmtService = mgmtService;
        this.storageService = storageService;
    }
    async getMetrics(id) {
        return this.mgmtService.getDashboardMetrics(id);
    }
    async updateProfile(id, dto) {
        return this.mgmtService.updateProfile(id, dto);
    }
    async getInquiries(id) {
        return this.mgmtService.getInquiries(id);
    }
    async updateInquiryStatus(inquiryId, status) {
        const validStatuses = ['NEW', 'READ', 'ASSIGNED', 'RESOLVED', 'SPAM', 'ARCHIVED'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Invalid status');
        }
        return this.mgmtService.updateInquiryStatus(inquiryId, status);
    }
    async updateServices(id, serviceIds) {
        return this.mgmtService.updateServices(id, serviceIds);
    }
    async updateBranch(branchId, dto) {
        return this.mgmtService.updateBranch(branchId, dto);
    }
    async getSchedules(id) {
        return this.mgmtService.getSchedules(id);
    }
    async updateBranchSchedules(branchId, schedules) {
        return this.mgmtService.updateBranchSchedules(branchId, schedules);
    }
    async getMedia(id) {
        return this.mgmtService.getImages(id);
    }
    async addMedia(id, url, caption) {
        return this.mgmtService.addImage(id, url, caption);
    }
    async uploadMedia(id, file, caption) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const url = await this.storageService.uploadImage(file, `${id}/gallery`);
        return this.mgmtService.addImage(id, url, caption);
    }
    async deleteMedia(imageId) {
        return this.mgmtService.deleteImage(imageId);
    }
    async setCoverImage(id, imageId) {
        return this.mgmtService.setCoverImage(id, imageId);
    }
    async setLogo(id, url) {
        return this.mgmtService.setLogo(id, url);
    }
    async uploadLogo(id, file) {
        if (!file)
            throw new common_1.BadRequestException('No file uploaded');
        const url = await this.storageService.uploadImage(file, `${id}/logos`);
        return this.mgmtService.setLogo(id, url);
    }
    async getTeam(id) {
        return this.mgmtService.getTeam(id);
    }
    async addTeamMember(id, email, role) {
        return this.mgmtService.addMemberByEmail(id, email, role);
    }
    async removeTeamMember(memberId) {
        return this.mgmtService.removeMember(memberId);
    }
};
exports.OwnerInstitutesController = OwnerInstitutesController;
__decorate([
    (0, common_1.Get)(':id/metrics'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get summary metrics for owner dashboard' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Patch)(':id/profile'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER] }),
    (0, swagger_1.ApiOperation)({ summary: 'Update institute profile fields' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, owner_dashboard_dto_1.UpdateInstituteProfileDto]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)(':id/inquiries'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all enquiries for an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "getInquiries", null);
__decorate([
    (0, common_1.Patch)('inquiries/:inquiryId/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update inquiry status' }),
    __param(0, (0, common_1.Param)('inquiryId')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "updateInquiryStatus", null);
__decorate([
    (0, common_1.Patch)(':id/services'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk update institute services' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('serviceIds')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "updateServices", null);
__decorate([
    (0, common_1.Patch)('branches/:branchId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update branch details' }),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, owner_dashboard_dto_1.UpdateBranchDto]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "updateBranch", null);
__decorate([
    (0, common_1.Get)(':id/schedules'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all schedules for an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "getSchedules", null);
__decorate([
    (0, common_1.Patch)('branches/:branchId/schedules'),
    (0, swagger_1.ApiOperation)({ summary: 'Update schedules for a branch' }),
    __param(0, (0, common_1.Param)('branchId')),
    __param(1, (0, common_1.Body)('schedules')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "updateBranchSchedules", null);
__decorate([
    (0, common_1.Get)(':id/media'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get institute image gallery' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "getMedia", null);
__decorate([
    (0, common_1.Post)(':id/media'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, swagger_1.ApiOperation)({ summary: 'Add image to gallery' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __param(2, (0, common_1.Body)('caption')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "addMedia", null);
__decorate([
    (0, common_1.Post)(':id/upload'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER, permissions_decorator_1.InstituteRole.STAFF] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload image to gallery' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)('caption')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "uploadMedia", null);
__decorate([
    (0, common_1.Delete)('media/:imageId'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete image from gallery' }),
    __param(0, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "deleteMedia", null);
__decorate([
    (0, common_1.Patch)(':id/media/:imageId/cover'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER] }),
    (0, swagger_1.ApiOperation)({ summary: 'Set an image as the cover image' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('imageId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "setCoverImage", null);
__decorate([
    (0, common_1.Patch)(':id/logo'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER] }),
    (0, swagger_1.ApiOperation)({ summary: 'Set institute logo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "setLogo", null);
__decorate([
    (0, common_1.Post)(':id/logo/upload'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER, permissions_decorator_1.InstituteRole.MANAGER] }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: 'Upload and set institute logo' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "uploadLogo", null);
__decorate([
    (0, common_1.Get)(':id/team'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get institute team members' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "getTeam", null);
__decorate([
    (0, common_1.Post)(':id/team'),
    (0, permissions_decorator_1.RequirePermissions)({ instituteRoles: [permissions_decorator_1.InstituteRole.OWNER] }),
    (0, swagger_1.ApiOperation)({ summary: 'Add member to team' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('email')),
    __param(2, (0, common_1.Body)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "addTeamMember", null);
__decorate([
    (0, common_1.Delete)('team/:memberId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove member from team' }),
    __param(0, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OwnerInstitutesController.prototype, "removeTeamMember", null);
exports.OwnerInstitutesController = OwnerInstitutesController = __decorate([
    (0, swagger_1.ApiTags)('Owner Dashboard'),
    (0, common_1.Controller)('owner/institutes'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [institute_mgmt_service_1.InstituteMgmtService,
        storage_service_1.StorageService])
], OwnerInstitutesController);
//# sourceMappingURL=owner-institutes.controller.js.map