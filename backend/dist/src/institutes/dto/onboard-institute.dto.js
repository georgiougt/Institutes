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
exports.OnboardInstituteDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class OnboardInstituteDto {
    email;
    password;
    firstName;
    lastName;
    ownerId;
    instituteName;
    description;
    website;
    address;
    phone;
    cityId;
    latitude;
    longitude;
    serviceIds;
}
exports.OnboardInstituteDto = OnboardInstituteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'owner@example.com' }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Password123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MinLength)(8, { message: 'Ο κωδικός πρέπει να είναι τουλάχιστον 8 χαρακτήρες' }),
    (0, class_validator_1.Matches)(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'Ο κωδικός είναι πολύ αδύναμος (χρειάζεται κεφαλαία, πεζά, αριθμούς)',
    }),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Γιώργος' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Παπαδόπουλος' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-existing-owner' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "ownerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Φροντιστήριο Η Γνώση' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MinLength)(3, { message: 'Το όνομα του φροντιστηρίου είναι πολύ μικρό' }),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "instituteName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Εξειδικευμένο κέντρο μαθημάτων στην Κύπρο.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://ignosi.cy' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "website", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Λεωφόρος Αμαθούντος 123' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "address", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '25123456' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^\d{8}$/, { message: 'Το τηλέφωνο πρέπει να είναι 8 ψηφία' }),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-of-city' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], OnboardInstituteDto.prototype, "cityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 35.1264 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OnboardInstituteDto.prototype, "latitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 33.3677 }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], OnboardInstituteDto.prototype, "longitude", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['uuid-of-math', 'uuid-of-physics'], type: [String] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], OnboardInstituteDto.prototype, "serviceIds", void 0);
//# sourceMappingURL=onboard-institute.dto.js.map