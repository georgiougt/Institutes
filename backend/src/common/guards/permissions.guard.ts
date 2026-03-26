import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { PERMISSIONS_KEY, PermissionMetadata } from '../decorators/permissions.decorator';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.getAllAndOverride<PermissionMetadata>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no specific permissions required, allow if authenticated
    if (!permissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('Authentication required');
    }

    // 1. Check Admin Roles (System Level)
    if (permissions.adminRoles && permissions.adminRoles.length > 0) {
      if (user.adminRole === 'SUPER_ADMIN') return true;
      if (user.adminRole && permissions.adminRoles.includes(user.adminRole as any)) {
        return true;
      }
    }

    // 2. Check Institute Membership (Tenant Level)
    if (permissions.instituteRoles && permissions.instituteRoles.length > 0) {
      const instituteId = request.params.id || request.body.instituteId || request.query.instituteId;

      if (!instituteId) {
        // If we need institute roles but no ID is provided, we can't verify
        throw new ForbiddenException('Institute context required');
      }

      const membership = await this.prisma.instituteMember.findUnique({
        where: {
          instituteId_userId: {
            instituteId,
            userId: user.id,
          },
        },
      });

      if (membership && permissions.instituteRoles.includes(membership.role as any)) {
        return true;
      }
    }

    throw new ForbiddenException('Insufficient permissions for this resource');
  }
}
