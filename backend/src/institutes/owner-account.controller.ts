import { 
  Controller, 
  Patch, 
  Body, 
  Headers,
  BadRequestException,
  UnauthorizedException
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { InstituteMgmtService } from './institute-mgmt.service';

@ApiTags('Owner Account')
@Controller('owner/account')
export class OwnerAccountController {
  constructor(private readonly mgmtService: InstituteMgmtService) {}

  @Patch('email')
  @ApiOperation({ summary: 'Request to change account email' })
  async updateEmail(
    @Headers('X-User-Id') userId: string,
    @Body('newEmail') newEmail: string
  ) {
    if (!userId) throw new UnauthorizedException();
    if (!newEmail) throw new BadRequestException('New email is required');
    
    return this.mgmtService.updateOwnerEmail(userId, newEmail);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update owner personal information' })
  async updateProfile(
    @Headers('X-User-Id') userId: string,
    @Body() dto: { firstName?: string; lastName?: string; phone?: string }
  ) {
    if (!userId) throw new UnauthorizedException();
    return this.mgmtService.updateOwnerProfile(userId, dto);
  }

  @Patch('password')
  @ApiOperation({ summary: 'Update owner password' })
  async updatePassword(
    @Headers('X-User-Id') userId: string,
    @Body('newPassword') newPassword: string
  ) {
    if (!userId) throw new UnauthorizedException();
    if (!newPassword || newPassword.length < 6) throw new BadRequestException('Password must be at least 6 characters');
    return this.mgmtService.updateOwnerPassword(userId, newPassword);
  }
}
