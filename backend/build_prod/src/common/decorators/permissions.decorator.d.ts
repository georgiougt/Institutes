export declare enum SystemRole {
    ADMIN = "ADMIN",
    OWNER = "OWNER",
    USER = "USER"
}
export declare enum AdminRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    OPS_ADMIN = "OPS_ADMIN",
    SUPPORT_ADMIN = "SUPPORT_ADMIN",
    CONTENT_MOD = "CONTENT_MOD"
}
export declare enum InstituteRole {
    OWNER = "OWNER",
    MANAGER = "MANAGER",
    STAFF = "STAFF"
}
export interface PermissionMetadata {
    adminRoles?: AdminRole[];
    instituteRoles?: InstituteRole[];
}
export declare const PERMISSIONS_KEY = "permissions";
export declare const RequirePermissions: (permissions: PermissionMetadata) => import("@nestjs/common").CustomDecorator<string>;
