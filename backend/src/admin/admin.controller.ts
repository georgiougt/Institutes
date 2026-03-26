import { Controller, Get, Post, Put, Delete, Param, Query, Body, Req, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AuditService } from './audit.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PermissionGuard } from '../common/guards/permissions.guard';
import { RequirePermissions, AdminRole } from '../common/decorators/permissions.decorator';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(PermissionGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly auditService: AuditService,
  ) {}

  // ─── DASHBOARD ────────────────────────────────────────────────

  @Get('metrics')
  @ApiOperation({ summary: 'Get dashboard KPIs' })
  getMetrics() {
    return this.adminService.getMetrics();
  }

  @Get('dashboard/counts')
  @ApiOperation({ summary: 'Get all dashboard counts' })
  getDashboardCounts() {
    return this.adminService.getDashboardCounts();
  }

  // ─── INSTITUTES ───────────────────────────────────────────────

  @Get('institutes')
  @ApiOperation({ summary: 'List institutes (paginated, filtered)' })
  getInstitutes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('cityId') cityId?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ) {
    return this.adminService.getInstitutes({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status, cityId, search, sortBy, sortOrder,
    });
  }

  @Get('institutes/:id')
  @ApiOperation({ summary: 'Get institute detail' })
  getInstituteDetail(@Param('id') id: string) {
    return this.adminService.getInstituteDetail(id);
  }

  @Put('institutes/:id')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN] })
  @ApiOperation({ summary: 'Update institute details' })
  updateInstitute(@Param('id') id: string, @Body() data: any, @Req() req: any) {
    return this.adminService.updateInstitute(id, data, req.user?.id || 'admin-system');
  }

  @Post('institutes/:id/approve')
  @ApiOperation({ summary: 'Approve an institute' })
  approveInstitute(@Param('id') id: string) {
    return this.adminService.approveInstitute(id);
  }

  @Post('institutes/:id/reject')
  @ApiOperation({ summary: 'Reject an institute' })
  rejectInstitute(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.rejectInstitute(id, body.reason);
  }

  @Post('institutes/:id/suspend')
  @ApiOperation({ summary: 'Suspend an institute' })
  suspendInstitute(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.suspendInstitute(id, body.reason);
  }

  @Post('institutes/:id/archive')
  @ApiOperation({ summary: 'Archive an institute' })
  archiveInstitute(@Param('id') id: string) {
    return this.adminService.archiveInstitute(id);
  }

  // ─── LEGACY ENDPOINTS (backward compat) ──────────────────────

  @Get('requests')
  @ApiOperation({ summary: 'Get pending institute requests (legacy)' })
  getPendingRequests() {
    return this.adminService.getPendingRequests();
  }

  @Get('requests/rejected')
  @ApiOperation({ summary: 'Get rejected institute requests (legacy)' })
  getRejectedRequests() {
    return this.adminService.getRejectedRequests();
  }

  @Post('requests/:id/approve')
  @ApiOperation({ summary: 'Approve institute (legacy)' })
  legacyApprove(@Param('id') id: string) {
    return this.adminService.approveInstitute(id);
  }

  @Post('requests/:id/reject')
  @ApiOperation({ summary: 'Reject institute (legacy)' })
  legacyReject(@Param('id') id: string) {
    return this.adminService.rejectInstitute(id, 'Rejected by admin');
  }

  // ─── USERS ────────────────────────────────────────────────────

  @Get('users')
  @ApiOperation({ summary: 'List users (paginated)' })
  getUsers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('role') role?: string,
    @Query('search') search?: string,
  ) {
    return this.adminService.getUsers({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      role, search,
    });
  }

  // ─── CONTACT REQUESTS ────────────────────────────────────────

  @Get('contact-requests')
  @ApiOperation({ summary: 'List contact requests (paginated)' })
  getContactRequests(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.adminService.getContactRequests({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      status,
    });
  }

  // ─── SERVICES ────────────────────────────────────────────────

  @Get('services')
  @ApiOperation({ summary: 'List all services' })
  getServices() {
    return this.adminService.getServices();
  }

  @Post('services')
  @ApiOperation({ summary: 'Create a service' })
  createService(@Body() body: { name: string; category?: string; slug?: string }) {
    return this.adminService.createService(body);
  }

  @Put('services/:id')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN] })
  @ApiOperation({ summary: 'Update a service' })
  updateService(@Param('id') id: string, @Body() body: any, @Req() req: any) {
    return this.adminService.updateService(id, body, req.user?.id || 'admin-system');
  }

  @Delete('services/:id')
  @ApiOperation({ summary: 'Delete a service (if unused)' })
  deleteService(@Param('id') id: string) {
    return this.adminService.deleteService(id);
  }

  // ─── LOCATIONS ───────────────────────────────────────────────

  @Get('cities')
  @ApiOperation({ summary: 'List all cities' })
  getCities() {
    return this.adminService.getCities();
  }

  @Get('areas')
  @ApiOperation({ summary: 'List areas' })
  getAreas(@Query('cityId') cityId?: string) {
    return this.adminService.getAreas(cityId);
  }

  // ─── AUDIT LOGS ──────────────────────────────────────────────

  @Get('audit-logs')
  @ApiOperation({ summary: 'List audit logs (paginated)' })
  getAuditLogs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('actionType') actionType?: string,
    @Query('entityType') entityType?: string,
    @Query('actorId') actorId?: string,
  ) {
    return this.auditService.findAll({
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      actionType, entityType, actorId,
    });
  }
  @Post('institutes/bulk/approve')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN] })
  bulkApprove(@Body('ids') ids: string[], @Req() req: any) {
    return this.adminService.bulkApprove(ids, req.user?.id || 'admin-system');
  }

  @Post('institutes/bulk/reject')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN] })
  bulkReject(@Body() body: { ids: string[]; reason: string }, @Req() req: any) {
    return this.adminService.bulkReject(body.ids, body.reason, req.user?.id || 'admin-system');
  }

  @Post('institutes/bulk/delete')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN] })
  @ApiOperation({ summary: 'Bulk delete institutes' })
  bulkDelete(@Body('ids') ids: string[], @Req() req: any) {
    return this.adminService.bulkDelete(ids, req.user?.id || 'admin-system');
  }

  // ─── REVISIONS ──────────────────────────────────────────────

  @Get('revisions')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN, AdminRole.CONTENT_MOD] })
  @ApiOperation({ summary: 'List profile revisions' })
  getRevisions(@Query('status') status?: string) {
    return this.adminService.getRevisions(status);
  }

  @Post('revisions/:id/approve')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN, AdminRole.CONTENT_MOD] })
  @ApiOperation({ summary: 'Approve a profile revision' })
  approveRevision(@Param('id') id: string, @Req() req: any) {
    return this.adminService.approveRevision(id, req.user?.id || 'admin-system');
  }

  @Post('revisions/:id/reject')
  @RequirePermissions({ adminRoles: [AdminRole.SUPER_ADMIN, AdminRole.OPS_ADMIN, AdminRole.CONTENT_MOD] })
  @ApiOperation({ summary: 'Reject a profile revision' })
  rejectRevision(@Param('id') id: string, @Body() body: { reason: string }, @Req() req: any) {
    return this.adminService.rejectRevision(id, body.reason, req.user?.id || 'admin-system');
  }

}
