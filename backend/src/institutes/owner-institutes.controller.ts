import { 
  Controller, 
  Get, 
  Param, 
  Patch, 
  Post,
  Delete,
  Body, 
  NotFoundException,
  BadRequestException,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InstituteMgmtService } from './institute-mgmt.service';
import { UpdateInstituteProfileDto } from './dto/owner-dashboard.dto';
import { PermissionGuard } from '../common/guards/permissions.guard';
import { RequirePermissions, InstituteRole } from '../common/decorators/permissions.decorator';

@ApiTags('Owner Dashboard')
@Controller('owner/institutes')
@UseGuards(PermissionGuard)
export class OwnerInstitutesController {
  constructor(private readonly mgmtService: InstituteMgmtService) {}

  @Get(':id/metrics')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER, InstituteRole.STAFF] })
  @ApiOperation({ summary: 'Get summary metrics for owner dashboard' })
  async getMetrics(@Param('id') id: string) {
    return this.mgmtService.getDashboardMetrics(id);
  }

  @Patch(':id/profile')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER] })
  @ApiOperation({ summary: 'Update institute profile fields' })
  async updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateInstituteProfileDto
  ) {
    return this.mgmtService.updateProfile(id, dto);
  }

  @Get(':id/inquiries')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER, InstituteRole.STAFF] })
  @ApiOperation({ summary: 'Get all enquiries for an institute' })
  async getInquiries(@Param('id') id: string) {
    return this.mgmtService.getInquiries(id);
  }

  @Patch('inquiries/:inquiryId/status')
  @ApiOperation({ summary: 'Update inquiry status' })
  async updateInquiryStatus(
    @Param('inquiryId') inquiryId: string,
    @Body('status') status: string
  ) {
    // Basic validation
    const validStatuses = ['NEW', 'READ', 'ASSIGNED', 'RESOLVED', 'SPAM', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
       throw new BadRequestException('Invalid status');
    }
    return this.mgmtService.updateInquiryStatus(inquiryId, status);
  }

  @Patch(':id/services')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER, InstituteRole.STAFF] })
  @ApiOperation({ summary: 'Bulk update institute services' })
  async updateServices(
    @Param('id') id: string,
    @Body('serviceIds') serviceIds: string[]
  ) {
    return this.mgmtService.updateServices(id, serviceIds);
  }

  // ─── SCHEDULES ──────────────────────────────────────────────────────────

  @Get(':id/schedules')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER, InstituteRole.STAFF] })
  @ApiOperation({ summary: 'Get all schedules for an institute' })
  async getSchedules(@Param('id') id: string) {
    return this.mgmtService.getSchedules(id);
  }

  @Patch('branches/:branchId/schedules')
  @ApiOperation({ summary: 'Update schedules for a branch' })
  async updateBranchSchedules(
    @Param('branchId') branchId: string,
    @Body('schedules') schedules: any[]
  ) {
    return this.mgmtService.updateBranchSchedules(branchId, schedules);
  }

  // ─── MEDIA ──────────────────────────────────────────────────────────────

  @Get(':id/media')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER, InstituteRole.STAFF] })
  @ApiOperation({ summary: 'Get institute image gallery' })
  async getMedia(@Param('id') id: string) {
    return this.mgmtService.getImages(id);
  }

  @Post(':id/media')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER, InstituteRole.STAFF] })
  @ApiOperation({ summary: 'Add image to gallery' })
  async addMedia(
    @Param('id') id: string,
    @Body('url') url: string,
    @Body('caption') caption?: string
  ) {
    return this.mgmtService.addImage(id, url, caption);
  }

  @Delete('media/:imageId')
  @ApiOperation({ summary: 'Delete image from gallery' })
  async deleteMedia(@Param('imageId') imageId: string) {
    return this.mgmtService.deleteImage(imageId);
  }

  @Patch(':id/logo')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER, InstituteRole.MANAGER] })
  @ApiOperation({ summary: 'Set institute logo' })
  async setLogo(
    @Param('id') id: string,
    @Body('url') url: string
  ) {
    return this.mgmtService.setLogo(id, url);
  }

  // ─── TEAM ───────────────────────────────────────────────────────────────

  @Get(':id/team')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER] })
  @ApiOperation({ summary: 'Get institute team members' })
  async getTeam(@Param('id') id: string) {
    return this.mgmtService.getTeam(id);
  }

  @Post(':id/team')
  @RequirePermissions({ instituteRoles: [InstituteRole.OWNER] })
  @ApiOperation({ summary: 'Add member to team' })
  async addTeamMember(
    @Param('id') id: string,
    @Body('email') email: string,
    @Body('role') role: 'MANAGER' | 'STAFF'
  ) {
    return this.mgmtService.addMemberByEmail(id, email, role);
  }

  @Delete('team/:memberId')
  @ApiOperation({ summary: 'Remove member from team' })
  async removeTeamMember(@Param('memberId') memberId: string) {
    return this.mgmtService.removeMember(memberId);
  }
}
