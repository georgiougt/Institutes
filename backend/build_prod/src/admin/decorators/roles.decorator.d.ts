export declare enum AdminRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    OPS_ADMIN = "OPS_ADMIN",
    SUPPORT_ADMIN = "SUPPORT_ADMIN",
    CONTENT_MOD = "CONTENT_MOD"
}
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: AdminRole[]) => import("@nestjs/common").CustomDecorator<string>;
