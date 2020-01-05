"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_security_decorator_1 = require("./api-security.decorator");
function ApiBasicAuth(name = 'basic') {
    return api_security_decorator_1.ApiSecurity(name);
}
exports.ApiBasicAuth = ApiBasicAuth;
