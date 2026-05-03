"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
async function convert() {
    const source = 'C:\\Users\\Georg\\.gemini\\antigravity\\brain\\ff68261c-7643-4fa4-b600-fb7d103c5827\\institute_placeholder_v2_1776844053683.png';
    const targetDir = path_1.default.join(__dirname, '..', '..', 'web', 'public', 'images');
    const target = path_1.default.join(targetDir, 'placeholder-institute.webp');
    if (!fs_1.default.existsSync(targetDir)) {
        fs_1.default.mkdirSync(targetDir, { recursive: true });
    }
    console.log(`Converting ${source} to ${target}...`);
    await (0, sharp_1.default)(source)
        .webp({ quality: 80 })
        .toFile(target);
    console.log('Conversion successful!');
}
convert().catch(console.error);
//# sourceMappingURL=convert-placeholder.js.map