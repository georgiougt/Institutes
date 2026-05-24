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
exports.OwnerAccountController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const institute_mgmt_service_1 = require("./institute-mgmt.service");
let OwnerAccountController = class OwnerAccountController {
    mgmtService;
    constructor(mgmtService) {
        this.mgmtService = mgmtService;
    }
    async updateEmail(userId, newEmail) {
        if (!userId)
            throw new common_1.UnauthorizedException();
        if (!newEmail)
            throw new common_1.BadRequestException('New email is required');
        return this.mgmtService.updateOwnerEmail(userId, newEmail);
    }
    async updateProfile(userId, dto) {
        if (!userId)
            throw new common_1.UnauthorizedException();
        return this.mgmtService.updateOwnerProfile(userId, dto);
    }
};
exports.OwnerAccountController = OwnerAccountController;
__decorate([
    (0, common_1.Patch)('email'),
    (0, swagger_1.ApiOperation)({ summary: 'Request to change account email' }),
    __param(0, (0, common_1.Headers)('X-User-Id')),
    __param(1, (0, common_1.Body)('newEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], OwnerAccountController.prototype, "updateEmail", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, swagger_1.ApiOperation)({ summary: 'Update owner personal information' }),
    __param(0, (0, common_1.Headers)('X-User-Id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], OwnerAccountController.prototype, "updateProfile", null);
exports.OwnerAccountController = OwnerAccountController = __decorate([
    (0, swagger_1.ApiTags)('Owner Account'),
    (0, common_1.Controller)('owner/account'),
    __metadata("design:paramtypes", [institute_mgmt_service_1.InstituteMgmtService])
], OwnerAccountController);
//# sourceMappingURL=owner-account.controller.js.map