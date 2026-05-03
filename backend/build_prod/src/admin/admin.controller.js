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
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const admin_service_1 = require("./admin.service");
const audit_service_1 = require("./audit.service");
const swagger_1 = require("@nestjs/swagger");
const permissions_guard_1 = require("../common/guards/permissions.guard");
const permissions_decorator_1 = require("../common/decorators/permissions.decorator");
let AdminController = class AdminController {
    adminService;
    auditService;
    constructor(adminService, auditService) {
        this.adminService = adminService;
        this.auditService = auditService;
    }
    getMetrics() {
        return this.adminService.getMetrics();
    }
    getDashboardCounts() {
        return this.adminService.getDashboardCounts();
    }
    getInstitutes(page, limit, status, cityId, search, sortBy, sortOrder) {
        return this.adminService.getInstitutes({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            status, cityId, search, sortBy, sortOrder,
        });
    }
    getInstituteDetail(id) {
        return this.adminService.getInstituteDetail(id);
    }
    updateInstitute(id, data, req) {
        return this.adminService.updateInstitute(id, data, req.user?.id || 'admin-system');
    }
    approveInstitute(id, req) {
        return this.adminService.approveInstitute(id, req.user?.id || 'admin-system');
    }
    rejectInstitute(id, body, req) {
        return this.adminService.rejectInstitute(id, body.reason, req.user?.id || 'admin-system');
    }
    suspendInstitute(id, body, req) {
        return this.adminService.suspendInstitute(id, body.reason, req.user?.id || 'admin-system');
    }
    archiveInstitute(id, req) {
        return this.adminService.archiveInstitute(id, req.user?.id || 'admin-system');
    }
    getPendingRequests() {
        return this.adminService.getPendingRequests();
    }
    getRejectedRequests() {
        return this.adminService.getRejectedRequests();
    }
    legacyApprove(id) {
        return this.adminService.approveInstitute(id);
    }
    legacyReject(id) {
        return this.adminService.rejectInstitute(id, 'Rejected by admin');
    }
    getUsers(page, limit, role, search) {
        return this.adminService.getUsers({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            role, search,
        });
    }
    updateUserStatus(id, body, req) {
        return this.adminService.updateUserStatus(id, body.isActive, req.user?.id || 'admin-system');
    }
    getContactRequests(page, limit, status) {
        return this.adminService.getContactRequests({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            status,
        });
    }
    updateContactRequestStatus(id, body, req) {
        return this.adminService.updateContactRequestStatus(id, body.status, req.user?.id || 'admin-system');
    }
    getServices() {
        return this.adminService.getServices();
    }
    createService(body) {
        return this.adminService.createService(body);
    }
    updateService(id, body, req) {
        return this.adminService.updateService(id, body, req.user?.id || 'admin-system');
    }
    deleteService(id) {
        return this.adminService.deleteService(id);
    }
    getCities() {
        return this.adminService.getCities();
    }
    getAreas(cityId) {
        return this.adminService.getAreas(cityId);
    }
    getAuditLogs(page, limit, actionType, entityType, actorId) {
        return this.auditService.findAll({
            page: page ? parseInt(page) : undefined,
            limit: limit ? parseInt(limit) : undefined,
            actionType, entityType, actorId,
        });
    }
    bulkApprove(ids, req) {
        return this.adminService.bulkApprove(ids, req.user?.id || 'admin-system');
    }
    bulkReject(body, req) {
        return this.adminService.bulkReject(body.ids, body.reason, req.user?.id || 'admin-system');
    }
    bulkDelete(ids, req) {
        return this.adminService.bulkDelete(ids, req.user?.id || 'admin-system');
    }
    getRevisions(status) {
        return this.adminService.getRevisions(status);
    }
    approveRevision(id, req) {
        return this.adminService.approveRevision(id, req.user?.id || 'admin-system');
    }
    rejectRevision(id, body, req) {
        return this.adminService.rejectRevision(id, body.reason, req.user?.id || 'admin-system');
    }
    getNotifications() {
        return this.adminService.getNotifications();
    }
    getAnalytics() {
        return this.adminService.getDashboardAnalytics();
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('metrics'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN, permissions_decorator_1.AdminRole.SUPPORT_ADMIN, permissions_decorator_1.AdminRole.CONTENT_MOD] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard KPIs' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getMetrics", null);
__decorate([
    (0, common_1.Get)('dashboard/counts'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN, permissions_decorator_1.AdminRole.SUPPORT_ADMIN, permissions_decorator_1.AdminRole.CONTENT_MOD] }),
    (0, swagger_1.ApiOperation)({ summary: 'Get all dashboard counts' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getDashboardCounts", null);
__decorate([
    (0, common_1.Get)('institutes'),
    (0, swagger_1.ApiOperation)({ summary: 'List institutes (paginated, filtered)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __param(3, (0, common_1.Query)('cityId')),
    __param(4, (0, common_1.Query)('search')),
    __param(5, (0, common_1.Query)('sortBy')),
    __param(6, (0, common_1.Query)('sortOrder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getInstitutes", null);
__decorate([
    (0, common_1.Get)('institutes/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get institute detail' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getInstituteDetail", null);
__decorate([
    (0, common_1.Put)('institutes/:id'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Update institute details' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateInstitute", null);
__decorate([
    (0, common_1.Post)('institutes/:id/approve'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveInstitute", null);
__decorate([
    (0, common_1.Post)('institutes/:id/reject'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Reject an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectInstitute", null);
__decorate([
    (0, common_1.Post)('institutes/:id/suspend'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "suspendInstitute", null);
__decorate([
    (0, common_1.Post)('institutes/:id/archive'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Archive an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "archiveInstitute", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: 'Get pending institute requests (legacy)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getPendingRequests", null);
__decorate([
    (0, common_1.Get)('requests/rejected'),
    (0, swagger_1.ApiOperation)({ summary: 'Get rejected institute requests (legacy)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRejectedRequests", null);
__decorate([
    (0, common_1.Post)('requests/:id/approve'),
    (0, swagger_1.ApiOperation)({ summary: 'Approve institute (legacy)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "legacyApprove", null);
__decorate([
    (0, common_1.Post)('requests/:id/reject'),
    (0, swagger_1.ApiOperation)({ summary: 'Reject institute (legacy)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "legacyReject", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'List users (paginated)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('role')),
    __param(3, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('users/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Activate or deactivate a user account' }),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateUserStatus", null);
__decorate([
    (0, common_1.Get)('contact-requests'),
    (0, swagger_1.ApiOperation)({ summary: 'List contact requests (paginated)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getContactRequests", null);
__decorate([
    (0, common_1.Post)('contact-requests/:id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update contact request status' }),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.SUPPORT_ADMIN] }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateContactRequestStatus", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'List all services' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getServices", null);
__decorate([
    (0, common_1.Post)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a service' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "createService", null);
__decorate([
    (0, common_1.Put)('services/:id'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Update a service' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "updateService", null);
__decorate([
    (0, common_1.Delete)('services/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a service (if unused)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteService", null);
__decorate([
    (0, common_1.Get)('cities'),
    (0, swagger_1.ApiOperation)({ summary: 'List all cities' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getCities", null);
__decorate([
    (0, common_1.Get)('areas'),
    (0, swagger_1.ApiOperation)({ summary: 'List areas' }),
    __param(0, (0, common_1.Query)('cityId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAreas", null);
__decorate([
    (0, common_1.Get)('audit-logs'),
    (0, swagger_1.ApiOperation)({ summary: 'List audit logs (paginated)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('actionType')),
    __param(3, (0, common_1.Query)('entityType')),
    __param(4, (0, common_1.Query)('actorId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String, String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAuditLogs", null);
__decorate([
    (0, common_1.Post)('institutes/bulk/approve'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "bulkApprove", null);
__decorate([
    (0, common_1.Post)('institutes/bulk/reject'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "bulkReject", null);
__decorate([
    (0, common_1.Post)('institutes/bulk/delete'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN] }),
    (0, swagger_1.ApiOperation)({ summary: 'Bulk delete institutes' }),
    __param(0, (0, common_1.Body)('ids')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "bulkDelete", null);
__decorate([
    (0, common_1.Get)('revisions'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN, permissions_decorator_1.AdminRole.CONTENT_MOD] }),
    (0, swagger_1.ApiOperation)({ summary: 'List profile revisions' }),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getRevisions", null);
__decorate([
    (0, common_1.Post)('revisions/:id/approve'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN, permissions_decorator_1.AdminRole.CONTENT_MOD] }),
    (0, swagger_1.ApiOperation)({ summary: 'Approve a profile revision' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "approveRevision", null);
__decorate([
    (0, common_1.Post)('revisions/:id/reject'),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN, permissions_decorator_1.AdminRole.CONTENT_MOD] }),
    (0, swagger_1.ApiOperation)({ summary: 'Reject a profile revision' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "rejectRevision", null);
__decorate([
    (0, common_1.Get)('notifications'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recent admin notifications' }),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN, permissions_decorator_1.AdminRole.SUPPORT_ADMIN] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getNotifications", null);
__decorate([
    (0, common_1.Get)('dashboard/analytics'),
    (0, swagger_1.ApiOperation)({ summary: 'Get dashboard analytics' }),
    (0, permissions_decorator_1.RequirePermissions)({ adminRoles: [permissions_decorator_1.AdminRole.SUPER_ADMIN, permissions_decorator_1.AdminRole.OPS_ADMIN] }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getAnalytics", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(permissions_guard_1.PermissionGuard),
    __metadata("design:paramtypes", [admin_service_1.AdminService,
        audit_service_1.AuditService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map