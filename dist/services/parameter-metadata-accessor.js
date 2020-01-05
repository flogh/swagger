"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("@nestjs/common/constants");
const route_paramtypes_enum_1 = require("@nestjs/common/enums/route-paramtypes.enum");
const lodash_1 = require("lodash");
const reverse_object_keys_util_1 = require("../utils/reverse-object-keys.util");
const PARAM_TOKEN_PLACEHOLDER = 'placeholder';
class ParameterMetadataAccessor {
    explore(instance, prototype, method) {
        const types = Reflect.getMetadata(constants_1.PARAMTYPES_METADATA, instance, method.name);
        const routeArgsMetadata = Reflect.getMetadata(constants_1.ROUTE_ARGS_METADATA, instance.constructor, method.name) || {};
        const parametersWithType = lodash_1.mapValues(reverse_object_keys_util_1.reverseObjectKeys(routeArgsMetadata), (param) => ({
            type: types[param.index],
            name: param.data,
            required: true
        }));
        const excludePredicate = (val) => val.in === PARAM_TOKEN_PLACEHOLDER || (val.name && val.in === 'body');
        const parameters = lodash_1.omitBy(lodash_1.mapValues(parametersWithType, (val, key) => (Object.assign(Object.assign({}, val), { in: this.mapParamType(key) }))), excludePredicate);
        return !lodash_1.isEmpty(parameters) ? parameters : undefined;
    }
    mapParamType(key) {
        const keyPair = key.split(':');
        switch (Number(keyPair[0])) {
            case route_paramtypes_enum_1.RouteParamtypes.BODY:
                return 'body';
            case route_paramtypes_enum_1.RouteParamtypes.PARAM:
                return 'path';
            case route_paramtypes_enum_1.RouteParamtypes.QUERY:
                return 'query';
            case route_paramtypes_enum_1.RouteParamtypes.HEADERS:
                return 'header';
            default:
                return PARAM_TOKEN_PLACEHOLDER;
        }
    }
}
exports.ParameterMetadataAccessor = ParameterMetadataAccessor;
