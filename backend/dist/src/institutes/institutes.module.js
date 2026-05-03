"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstitutesModule = void 0;
const common_1 = require("@nestjs/common");
const institutes_controller_1 = require("./institutes.controller");
const owner_institutes_controller_1 = require("./owner-institutes.controller");
const institutes_service_1 = require("./institutes.service");
const institute_mgmt_service_1 = require("./institute-mgmt.service");
const onboarding_controller_1 = require("./onboarding/onboarding.controller");
const onboarding_service_1 = require("./onboarding/onboarding.service");
const storage_service_1 = require("../common/storage/storage.service");
let InstitutesModule = class InstitutesModule {
};
exports.InstitutesModule = InstitutesModule;
exports.InstitutesModule = InstitutesModule = __decorate([
    (0, common_1.Module)({
        controllers: [institutes_controller_1.InstitutesController, owner_institutes_controller_1.OwnerInstitutesController, onboarding_controller_1.OnboardingController],
        providers: [institutes_service_1.InstitutesService, institute_mgmt_service_1.InstituteMgmtService, onboarding_service_1.OnboardingService, storage_service_1.StorageService],
        exports: [institutes_service_1.InstitutesService, institute_mgmt_service_1.InstituteMgmtService, onboarding_service_1.OnboardingService, storage_service_1.StorageService]
    })
], InstitutesModule);
//# sourceMappingURL=institutes.module.js.map