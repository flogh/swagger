"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const enum_utils_1 = require("../utils/enum.utils");
const helpers_1 = require("./helpers");
const defaultQueryOptions = {
    name: '',
    required: true
};
function ApiQuery(options) {
    const [type, isArray] = helpers_1.getTypeIsArrayTuple(options.type, options.isArray);
    const param = Object.assign(Object.assign({ name: lodash_1.isNil(options.name) ? defaultQueryOptions.name : options.name, in: 'query' }, lodash_1.omit(options, 'enum')), { type,
        isArray });
    if (enum_utils_1.isEnumArray(options)) {
        enum_utils_1.addEnumArraySchema(param, options);
    }
    else if (enum_utils_1.isEnumDefined(options)) {
        enum_utils_1.addEnumSchema(param, options);
    }
    !param['enumName'] && delete param['enumName'];
    return helpers_1.createParamDecorator(param, defaultQueryOptions);
}
exports.ApiQuery = ApiQuery;
