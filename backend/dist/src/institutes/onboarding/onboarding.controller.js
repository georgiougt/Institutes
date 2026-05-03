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
exports.OnboardingController = void 0;
const common_1 = require("@nestjs/common");
const onboarding_service_1 = require("./onboarding.service");
const onboarding_dto_1 = require("./onboarding.dto");
const swagger_1 = require("@nestjs/swagger");
let OnboardingController = class OnboardingController {
    onboardingService;
    constructor(onboardingService) {
        this.onboardingService = onboardingService;
    }
    signup(dto) {
        return this.onboardingService.signup(dto);
    }
    updateDraft(dto) {
        return this.onboardingService.updateDraft(dto);
    }
    submit(id) {
        return this.onboardingService.submitForReview(id);
    }
    searchClaim(dto) {
        return this.onboardingService.searchToClaim(dto.query);
    }
    submitClaim(dto) {
        return this.onboardingService.submitClaim(dto);
    }
};
exports.OnboardingController = OnboardingController;
__decorate([
    (0, common_1.Post)('signup'),
    (0, swagger_1.ApiOperation)({ summary: 'Step 1: Create owner account' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboarding_dto_1.OnboardingSignupDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "signup", null);
__decorate([
    (0, common_1.Post)('draft'),
    (0, swagger_1.ApiOperation)({ summary: 'Save progress as draft' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboarding_dto_1.UpdateDraftDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "updateDraft", null);
__decorate([
    (0, common_1.Post)('submit/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Final Step: Submit for review' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)('search-claim'),
    (0, swagger_1.ApiOperation)({ summary: 'Search for institutes to claim' }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboarding_dto_1.SearchClaimsDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "searchClaim", null);
__decorate([
    (0, common_1.Post)('claim'),
    (0, swagger_1.ApiOperation)({ summary: 'Submit a claim request' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [onboarding_dto_1.ClaimSubmitDto]),
    __metadata("design:returntype", void 0)
], OnboardingController.prototype, "submitClaim", null);
exports.OnboardingController = OnboardingController = __decorate([
    (0, swagger_1.ApiTags)('Onboarding'),
    (0, common_1.Controller)('onboard'),
    __metadata("design:paramtypes", [onboarding_service_1.OnboardingService])
], OnboardingController);
//# sourceMappingURL=onboarding.controller.js.map