"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../constants");
const helpers_1 = require("./helpers");
function ApiProduces(...mimeTypes) {
    return helpers_1.createMixedDecorator(constants_1.DECORATORS.API_PRODUCES, mimeTypes);
}
exports.ApiProduces = ApiProduces;
