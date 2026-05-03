"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequirePermissions = exports.PERMISSIONS_KEY = exports.InstituteRole = exports.AdminRole = exports.SystemRole = void 0;
const common_1 = require("@nestjs/common");
var SystemRole;
(function (SystemRole) {
    SystemRole["ADMIN"] = "ADMIN";
    SystemRole["OWNER"] = "OWNER";
    SystemRole["USER"] = "USER";
})(SystemRole || (exports.SystemRole = SystemRole = {}));
var AdminRole;
(function (AdminRole) {
    AdminRole["SUPER_ADMIN"] = "SUPER_ADMIN";
    AdminRole["OPS_ADMIN"] = "OPS_ADMIN";
    AdminRole["SUPPORT_ADMIN"] = "SUPPORT_ADMIN";
    AdminRole["CONTENT_MOD"] = "CONTENT_MOD";
})(AdminRole || (exports.AdminRole = AdminRole = {}));
var InstituteRole;
(function (InstituteRole) {
    InstituteRole["OWNER"] = "OWNER";
    InstituteRole["MANAGER"] = "MANAGER";
    InstituteRole["STAFF"] = "STAFF";
})(InstituteRole || (exports.InstituteRole = InstituteRole = {}));
exports.PERMISSIONS_KEY = 'permissions';
const RequirePermissions = (permissions) => (0, common_1.SetMetadata)(exports.PERMISSIONS_KEY, permissions);
exports.RequirePermissions = RequirePermissions;
//# sourceMappingURL=permissions.decorator.js.map