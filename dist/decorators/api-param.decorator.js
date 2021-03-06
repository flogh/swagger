"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const enum_utils_1 = require("../utils/enum.utils");
const helpers_1 = require("./helpers");
const defaultParamOptions = {
    name: '',
    required: true
};
function ApiParam(options) {
    const param = Object.assign({ name: lodash_1.isNil(options.name) ? defaultParamOptions.name : options.name, in: 'path' }, lodash_1.omit(options, 'enum'));
    if (options.enum) {
        param.schema = param.schema || {};
        const enumValues = enum_utils_1.getEnumValues(options.enum);
        param.schema.type = enum_utils_1.getEnumType(enumValues.values);
        param.schema.enum = enumValues.values;
        if (enumValues.enumName) {
            param['enumName'] = enumValues.enumName;
        }
    }
    !param['enumName'] && delete param['enumName'];
    return helpers_1.createParamDecorator(param, defaultParamOptions);
}
exports.ApiParam = ApiParam;
