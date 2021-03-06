"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_enum_1 = require("@nestjs/common/enums/http-status.enum");
const lodash_1 = require("lodash");
const constants_1 = require("../constants");
const helpers_1 = require("./helpers");
function ApiResponse(options) {
    const [type, isArray] = helpers_1.getTypeIsArrayTuple(options.type, options.isArray);
    options.type = type;
    options.isArray = isArray;
    options.description = options.description ? options.description : '';
    const groupedMetadata = { [options.status]: lodash_1.omit(options, 'status') };
    return (target, key, descriptor) => {
        if (descriptor) {
            const responses = Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, descriptor.value) || {};
            Reflect.defineMetadata(constants_1.DECORATORS.API_RESPONSE, Object.assign(Object.assign({}, responses), groupedMetadata), descriptor.value);
            return descriptor;
        }
        const responses = Reflect.getMetadata(constants_1.DECORATORS.API_RESPONSE, target) || {};
        Reflect.defineMetadata(constants_1.DECORATORS.API_RESPONSE, Object.assign(Object.assign({}, responses), groupedMetadata), target);
        return target;
    };
}
exports.ApiResponse = ApiResponse;
exports.ApiOkResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.OK }));
exports.ApiCreatedResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.CREATED }));
exports.ApiAcceptedResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.ACCEPTED }));
exports.ApiNoContentResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.NO_CONTENT }));
exports.ApiMovedPermanentlyResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.MOVED_PERMANENTLY }));
exports.ApiBadRequestResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.BAD_REQUEST }));
exports.ApiUnauthorizedResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.UNAUTHORIZED }));
exports.ApiTooManyRequestsResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.TOO_MANY_REQUESTS }));
exports.ApiNotFoundResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.NOT_FOUND }));
exports.ApiInternalServerErrorResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.INTERNAL_SERVER_ERROR }));
exports.ApiBadGatewayResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.BAD_GATEWAY }));
exports.ApiConflictResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.CONFLICT }));
exports.ApiForbiddenResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.FORBIDDEN }));
exports.ApiGatewayTimeoutResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.GATEWAY_TIMEOUT }));
exports.ApiGoneResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.GONE }));
exports.ApiMethodNotAllowedResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.METHOD_NOT_ALLOWED }));
exports.ApiNotAcceptableResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.NOT_ACCEPTABLE }));
exports.ApiNotImplementedResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.NOT_IMPLEMENTED }));
exports.ApiPayloadTooLargeResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.PAYLOAD_TOO_LARGE }));
exports.ApiRequestTimeoutResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.REQUEST_TIMEOUT }));
exports.ApiServiceUnavailableResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.SERVICE_UNAVAILABLE }));
exports.ApiUnprocessableEntityResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.UNPROCESSABLE_ENTITY }));
exports.ApiUnsupportedMediaTypeResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: http_status_enum_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE }));
exports.ApiDefaultResponse = (options = {}) => ApiResponse(Object.assign(Object.assign({}, options), { status: 'default' }));
