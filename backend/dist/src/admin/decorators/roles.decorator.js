"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Roles = exports.ROLES_KEY = exports.AdminRole = void 0;
const common_1 = require("@nestjs/common");
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    AdminRole["OPS_ADMIN"] = "OPS_ADMIN";
    AdminRole["SUPPORT_ADMIN"] = "SUPPORT_ADMIN";
    AdminRole["CONTENT_MOD"] = "CONTENT_MOD";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
exports.ROLES_KEY = 'roles';
const Roles = (...roles) => (0, common_1.SetMetadata)(exports.ROLES_KEY, roles);
exports.Roles = Roles;
//# sourceMappingURL=roles.decorator.js.map