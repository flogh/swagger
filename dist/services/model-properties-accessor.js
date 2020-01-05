"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
require("reflect-metadata");
const constants_1 = require("../constants");
const decorators_1 = require("../decorators");
const plugin_constants_1 = require("../plugin/plugin-constants");
class ModelPropertiesAccessor {
    getModelProperties(prototype) {
        const properties = Reflect.getMetadata(constants_1.DECORATORS.API_MODEL_PROPERTIES_ARRAY, prototype) ||
            [];
        return properties
            .filter(shared_utils_1.isString)
            .filter((key) => key.charAt(0) === ':' && !shared_utils_1.isFunction(prototype[key]))
            .map((key) => key.slice(1));
    }
    applyMetadataFactory(prototype) {
        if (!prototype.constructor) {
            return;
        }
        if (!prototype.constructor[plugin_constants_1.METADATA_FACTORY_NAME]) {
            return;
        }
        const metadata = prototype.constructor[plugin_constants_1.METADATA_FACTORY_NAME]();
        const properties = Object.keys(metadata);
        properties.forEach(key => {
            decorators_1.ApiProperty(metadata[key])(prototype, key);
        });
    }
}
exports.ModelPropertiesAccessor = ModelPropertiesAccessor;
