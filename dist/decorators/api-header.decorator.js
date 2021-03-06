"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const enum_utils_1 = require("../utils/enum.utils");
const helpers_1 = require("./helpers");
const defaultHeaderOptions = {
    name: ''
};
function ApiHeader(options) {
    const param = {
        name: lodash_1.isNil(options.name) ? defaultHeaderOptions.name : options.name,
        in: 'header',
        description: options.description,
        required: options.required,
        schema: {
            type: 'string'
        }
    };
    if (options.enum) {
        const enumValues = enum_utils_1.getEnumValues(options.enum).values;
        param.schema = {
            enum: enumValues,
            type: enum_utils_1.getEnumType(enumValues)
        };
    }
    return (target, key, descriptor) => {
        if (descriptor) {
            return helpers_1.createParamDecorator(param, defaultHeaderOptions)(target, key, descriptor);
        }
        return helpers_1.createClassDecorator(constants_1.DECORATORS.API_HEADERS, [param])(target);
    };
}
exports.ApiHeader = ApiHeader;
exports.ApiHeaders = (headers) => {
    return (target, key, descriptor) => {
        headers.forEach(options => ApiHeader(options)(target, key, descriptor));
    };
};
