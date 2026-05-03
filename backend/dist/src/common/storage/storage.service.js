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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
const sharp_1 = __importDefault(require("sharp"));
const uuid_1 = require("uuid");
let StorageService = class StorageService {
    supabase;
    bucketName;
    constructor() {
        this.supabase = (0, supabase_js_1.createClient)(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');
        this.bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'institutes';
    }
    async uploadImage(file, folder) {
        try {
            const webpBuffer = await (0, sharp_1.default)(file.buffer)
                .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
                .webp({ quality: 80 })
                .toBuffer();
            const fileName = `${folder}/${(0, uuid_1.v4)()}.webp`;
            const { data, error } = await this.supabase.storage
                .from(this.bucketName)
                .upload(fileName, webpBuffer, {
                contentType: 'image/webp',
                cacheControl: '3600',
                upsert: false
            });
            if (error) {
                console.error(`Supabase upload error (Bucket: ${this.bucketName}):`, error);
                throw new common_1.InternalServerErrorException(`Failed to upload to storage: ${error.message}`);
            }
            const { data: { publicUrl } } = this.supabase.storage
                .from(this.bucketName)
                .getPublicUrl(fileName);
            return publicUrl;
        }
        catch (error) {
            console.error('Image processing error:', error);
            throw new common_1.InternalServerErrorException('Image processing failed');
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], StorageService);
//# sourceMappingURL=storage.service.js.map