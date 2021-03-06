"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
class SwaggerTypesMapper {
    mapParamTypes(parameters) {
        return parameters.map(param => {
            if (this.hasSchemaDefinition(param)) {
                return this.omitParamType(param);
            }
            const { type } = param;
            const typeName = type && lodash_1.isFunction(type)
                ? this.mapTypeToOpenAPIType(type.name)
                : this.mapTypeToOpenAPIType(type);
            const paramWithTypeMetadata = lodash_1.omitBy(Object.assign(Object.assign({}, param), { type: typeName }), lodash_1.isUndefined);
            const keysToRemove = ['type', 'isArray', 'enum', 'items'];
            if (this.isEnumArrayType(paramWithTypeMetadata)) {
                return this.mapEnumArrayType(paramWithTypeMetadata, keysToRemove);
            }
            else if (paramWithTypeMetadata.isArray) {
                return this.mapArrayType(paramWithTypeMetadata, keysToRemove);
            }
            return Object.assign(Object.assign({}, lodash_1.omit(param, keysToRemove)), { schema: lodash_1.omitBy(Object.assign(Object.assign({}, (param.schema || {})), { enum: paramWithTypeMetadata.enum, type: paramWithTypeMetadata.type }), lodash_1.isUndefined) });
        });
    }
    mapTypeToOpenAPIType(type) {
        if (!(type && type.charAt)) {
            return '';
        }
        return type.charAt(0).toLowerCase() + type.slice(1);
    }
    isEnumArrayType(param) {
        return param.isArray && param.items && param.items.enum;
    }
    mapEnumArrayType(param, keysToRemove) {
        return Object.assign(Object.assign({}, lodash_1.omit(param, keysToRemove)), { schema: {
                type: 'array',
                items: param.items
            } });
    }
    mapArrayType(param, keysToRemove) {
        const items = lodash_1.omitBy(Object.assign(Object.assign({}, (param.schema || {})), { enum: param.enum, type: this.mapTypeToOpenAPIType(param.type) }), lodash_1.isUndefined);
        return Object.assign(Object.assign({}, lodash_1.omit(param, keysToRemove)), { schema: {
                type: 'array',
                items
            } });
    }
    hasSchemaDefinition(param) {
        return !!param.schema;
    }
    omitParamType(param) {
        return lodash_1.omit(param, 'type');
    }
}
exports.SwaggerTypesMapper = SwaggerTypesMapper;
