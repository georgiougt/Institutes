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
exports.InstitutesController = void 0;
const common_1 = require("@nestjs/common");
const institutes_service_1 = require("./institutes.service");
const search_institutes_dto_1 = require("./dto/search-institutes.dto");
const onboard_institute_dto_1 = require("./dto/onboard-institute.dto");
const login_dto_1 = require("./dto/login.dto");
const contact_request_dto_1 = require("./dto/contact-request.dto");
const swagger_1 = require("@nestjs/swagger");
let InstitutesController = class InstitutesController {
    institutesService;
    constructor(institutesService) {
        this.institutesService = institutesService;
    }
    search(searchDto) {
        return this.institutesService.search(searchDto);
    }
    getRecent(lat, lng) {
        return this.institutesService.getRecent(lat ? Number(lat) : undefined, lng ? Number(lng) : undefined);
    }
    metadata() {
        return this.institutesService.getMetadata();
    }
    sitemap() {
        return this.institutesService.getSitemapData();
    }
    async findOne(id) {
        const institute = await this.institutesService.findOne(id);
        if (!institute)
            throw new common_1.NotFoundException('Institute not found');
        return institute;
    }
    async deleteInstitute(id) {
        return this.institutesService.delete(id);
    }
    async onboard(onboardDto) {
        try {
            return await this.institutesService.onboard(onboardDto);
        }
        catch (error) {
            console.error('Onboard error:', error);
            if (error.code === 'P2002' || error.message?.includes('χρησιμοποιείται ήδη')) {
                throw new common_1.ConflictException('Αυτό το email χρησιμοποιείται ήδη.');
            }
            if (error.message?.includes('Invalid') || error.message?.includes('missing')) {
                throw new common_1.BadRequestException(error.message);
            }
            throw new common_1.InternalServerErrorException(error.message || 'Internal Server Error during onboarding');
        }
    }
    async login(loginDto) {
        try {
            return await this.institutesService.login(loginDto.email, loginDto.password);
        }
        catch (error) {
            if (error.message === 'Invalid credentials' || error.message === 'User not found') {
                throw new common_1.UnauthorizedException('Λανθασμένα στοιχεία σύνδεσης.');
            }
            throw new common_1.InternalServerErrorException(error.message);
        }
    }
    async forgotPassword(email) {
        return this.institutesService.requestPasswordReset(email);
    }
    async resetPassword(dto) {
        return this.institutesService.resetPassword(dto.token, dto.password);
    }
    async findByOwner(ownerId) {
        return this.institutesService.findByOwner(ownerId);
    }
    async sendGeneralContact(dto) {
        return this.institutesService.createContactRequest(null, dto);
    }
    async sendContact(id, dto) {
        return this.institutesService.createContactRequest(id, dto);
    }
};
exports.InstitutesController = InstitutesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Search and list institutes' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return list of institutes matching the criteria.' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [search_institutes_dto_1.SearchInstitutesDto]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "search", null);
__decorate([
    (0, common_1.Get)('recent'),
    (0, swagger_1.ApiOperation)({ summary: 'Get the 3 most recent approved institutes (optionally near location)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return a small list of newly added or nearby institutes.' }),
    __param(0, (0, common_1.Query)('lat')),
    __param(1, (0, common_1.Query)('lng')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "getRecent", null);
__decorate([
    (0, common_1.Get)('metadata/lists'),
    (0, swagger_1.ApiOperation)({ summary: 'Get list of cities and services for dropdowns' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "metadata", null);
__decorate([
    (0, common_1.Get)('sitemap'),
    (0, swagger_1.ApiOperation)({ summary: 'Get lightweight institute data for sitemap generation' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], InstitutesController.prototype, "sitemap", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific institute' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Return a single institute with all its branches and services.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Institute not found.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "deleteInstitute", null);
__decorate([
    (0, common_1.Post)('onboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new institute and owner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Institute registration initiated.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboard_institute_dto_1.OnboardInstituteDto]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "onboard", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: 'Login for owners and admins' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('auth/forgot-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Request password reset email' }),
    __param(0, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "forgotPassword", null);
__decorate([
    (0, common_1.Post)('auth/reset-password'),
    (0, swagger_1.ApiOperation)({ summary: 'Reset password using token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Get)('owner/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get institutes for a specific owner' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Post)('general/contact'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a general platform contact message' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [contact_request_dto_1.CreateContactRequestDto]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "sendGeneralContact", null);
__decorate([
    (0, common_1.Post)(':id/contact'),
    (0, swagger_1.ApiOperation)({ summary: 'Send a contact message to an institute' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, contact_request_dto_1.CreateContactRequestDto]),
    __metadata("design:returntype", Promise)
], InstitutesController.prototype, "sendContact", null);
exports.InstitutesController = InstitutesController = __decorate([
    (0, swagger_1.ApiTags)('Institutes'),
    (0, common_1.Controller)('institutes'),
    __metadata("design:paramtypes", [institutes_service_1.InstitutesService])
], InstitutesController);
//# sourceMappingURL=institutes.controller.js.map