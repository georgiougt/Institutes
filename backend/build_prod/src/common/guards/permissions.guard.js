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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const permissions_decorator_1 = require("../decorators/permissions.decorator");
let PermissionGuard = class PermissionGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        let user = request.user;
        if (!user) {
            const headerUserId = request.headers['x-user-id'];
            if (headerUserId) {
                user = await this.prisma.user.findUnique({
                    where: { id: headerUserId },
                });
                request.user = user;
            }
        }
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        const permissions = this.reflector.getAllAndOverride(permissions_decorator_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        if (!permissions) {
            return true;
        }
        if (permissions.adminRoles && permissions.adminRoles.length > 0) {
            if (user.adminRole === 'SUPER_ADMIN')
                return true;
            if (user.adminRole && permissions.adminRoles.includes(user.adminRole)) {
                return true;
            }
        }
        if (permissions.instituteRoles && permissions.instituteRoles.length > 0) {
            const instituteId = request.params.id || request.body.instituteId || request.query.instituteId;
            if (!instituteId) {
                throw new common_1.ForbiddenException('Institute context required');
            }
            const membership = await this.prisma.instituteMember.findUnique({
                where: {
                    instituteId_userId: {
                        instituteId,
                        userId: user.id,
                    },
                },
            });
            if (membership && permissions.instituteRoles.includes(membership.role)) {
                return true;
            }
        }
        throw new common_1.ForbiddenException('Insufficient permissions for this resource');
    }
};
exports.PermissionGuard = PermissionGuard;
exports.PermissionGuard = PermissionGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PermissionGuard);
//# sourceMappingURL=permissions.guard.js.map