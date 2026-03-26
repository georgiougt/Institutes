import { SetMetadata } from '@nestjs/common';

export enum SystemRole {
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
  USER = 'USER',
}

export enum AdminRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  OPS_ADMIN = 'OPS_ADMIN',
  SUPPORT_ADMIN = 'SUPPORT_ADMIN',
  CONTENT_MOD = 'CONTENT_MOD',
}

export enum InstituteRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

export interface PermissionMetadata {
  adminRoles?: AdminRole[];
  instituteRoles?: InstituteRole[];
}

export const PERMISSIONS_KEY = 'permissions';
export const RequirePermissions = (permissions: PermissionMetadata) => 
  SetMetadata(PERMISSIONS_KEY, permissions);
