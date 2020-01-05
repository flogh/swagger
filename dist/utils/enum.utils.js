"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
function getEnumValues(enumType) {
    if (Array.isArray(enumType)) {
        return {
            values: enumType,
            enumName: ''
        };
    }
    if (typeof enumType === 'object') {
        return {
            values: _getEnumFromDefinition(enumType),
            enumName: ''
        };
    }
    if (typeof enumType === 'function') {
        return {
            values: _getEnumFromDefinition(enumType()),
            enumName: _getEnumNameFromTypeFn(enumType.toString())
        };
    }
    return { values: [], enumName: '' };
}
exports.getEnumValues = getEnumValues;
function _getEnumNameFromTypeFn(fnString) {
    return fnString
        .replace(/(?:\s|return|{|}|\(|\)|\$|_|,|;|\d)+/gm, '')
        .replace(/^[^A-Z]+/, '')
        .split('=>')
        .pop()
        .split('.')
        .pop();
}
function _getEnumFromDefinition(enumType) {
    const values = [];
    const uniqueValues = {};
    for (const key in enumType) {
        const value = enumType[key];
        if (!uniqueValues.hasOwnProperty(value) &&
            !uniqueValues.hasOwnProperty(key)) {
            values.push(value);
            uniqueValues[value] = value;
        }
    }
    return values;
}
function getEnumType(values) {
    const hasString = values.filter(lodash_1.isString).length > 0;
    return hasString ? 'string' : 'number';
}
exports.getEnumType = getEnumType;
function addEnumArraySchema(paramDefinition, decoratorOptions) {
    const paramSchema = paramDefinition.schema || {};
    paramDefinition.schema = paramSchema;
    paramSchema.type = 'array';
    delete paramDefinition.isArray;
    const enumValues = getEnumValues(decoratorOptions.enum);
    paramSchema.items = {
        type: getEnumType(enumValues.values),
        enum: enumValues.values
    };
    paramDefinition.enumName = enumValues.enumName;
}
exports.addEnumArraySchema = addEnumArraySchema;
function addEnumSchema(paramDefinition, decoratorOptions) {
    const paramSchema = paramDefinition.schema || {};
    const enumValues = getEnumValues(decoratorOptions.enum);
    paramDefinition.schema = paramSchema;
    paramSchema.enum = enumValues.values;
    paramSchema.type = getEnumType(enumValues.values);
    paramDefinition.enumName = enumValues.enumName;
}
exports.addEnumSchema = addEnumSchema;
exports.cleanUpParam = (param) => {
    if (param.isArray) {
        delete param.isArray;
        delete param['items'];
    }
    delete param.enumName;
    delete param.enum;
};
exports.isEnumArray = (obj) => obj.isArray && obj.enum;
exports.isEnumDefined = (obj) => obj.enum;
exports.isEnumMetadata = (metadata) => { var _a; return metadata.enum || (metadata.isArray && ((_a = metadata.items) === null || _a === void 0 ? void 0 : _a['enum'])); };
