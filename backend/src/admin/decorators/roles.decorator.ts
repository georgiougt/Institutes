import { SetMetadata } from '@nestjs/common';

// Admin roles enum - mirrors prisma AdminRole
export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPS_ADMIN = 'OPS_ADMIN',
  SUPPORT_ADMIN = 'SUPPORT_ADMIN',
  CONTENT_MOD = 'CONTENT_MOD',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: AdminRole[]) => SetMetadata(ROLES_KEY, roles);
