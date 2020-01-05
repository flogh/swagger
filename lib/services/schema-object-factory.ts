import { Type } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import {
  includes,
  isFunction,
  isString,
  keyBy,
  mapValues,
  omit,
  omitBy
} from 'lodash';
import { DECORATORS } from '../constants';
import { getTypeIsArrayTuple } from '../decorators/helpers';
import { exploreGlobalApiExtraModelsMetadata } from '../explorers/api-extra-models.explorer';
import {
  BaseParameterObject,
  ReferenceObject,
  SchemaObject
} from '../interfaces/open-api-spec.interface';
import { SchemaObjectMetadata } from '../interfaces/schema-object-metadata.interface';
import { getSchemaPath } from '../utils';
import { cleanUpParam, isEnumMetadata } from '../utils/enum.utils';
import { isBodyParameter } from '../utils/is-body-parameter.util';
import { isBuiltInType } from '../utils/is-built-in-type.util';
import { ModelPropertiesAccessor } from './model-properties-accessor';
import { ParamWithTypeMetadata } from './parameter-metadata-accessor';
import { SwaggerTypesMapper } from './swagger-types-mapper';

export class SchemaObjectFactory {
  constructor(
    private readonly modelPropertiesAccessor: ModelPropertiesAccessor,
    private readonly swaggerTypesMapper: SwaggerTypesMapper
  ) {}

  createFromModel(
    parameters: ParamWithTypeMetadata[],
    schemas: SchemaObject[],
    schemaRefsStack: string[] = []
  ): Array<ParamWithTypeMetadata | BaseParameterObject> {
    return parameters.map(param => {
      if (!isBodyParameter(param)) {
        if (param.enumName) {
          return this.createEnumParam(param, schemas, schemaRefsStack);
        }
        return param;
      }
      if (this.isPrimitiveType(param.type)) {
        return param;
      }
      if (this.isArrayCtor(param.type)) {
        return this.mapArrayCtorParam(param);
      }

      const modelName = this.exploreModelSchema(
        param.type,
        schemas,
        schemaRefsStack
      );
      const name = param.name || modelName;
      const schema = {
        ...((param as BaseParameterObject).schema || {}),
        $ref: getSchemaPath(modelName)
      };
      const isArray = param.isArray;
      param = omit(param, 'isArray');

      if (isArray) {
        return {
          ...param,
          name,
          schema: {
            type: 'array',
            items: schema
          }
        };
      }
      return {
        ...param,
        name,
        schema
      };
    });
  }

  exploreModelSchema(
    type: Type<unknown> | Function,
    schemas: SchemaObject[],
    schemaRefsStack: string[] = []
  ) {
    if (this.isLazyTypeFunc(type as Function)) {
      type = (type as Function)();
    }

    const { prototype } = type;
    if (!prototype) {
      return '';
    }
    const extraModels = exploreGlobalApiExtraModelsMetadata(
      type as Type<unknown>
    );
    extraModels.forEach(item =>
      this.exploreModelSchema(item, schemas, schemaRefsStack)
    );

    this.modelPropertiesAccessor.applyMetadataFactory(prototype);
    const modelProperties = this.modelPropertiesAccessor.getModelProperties(
      prototype
    );
    const propertiesWithType = modelProperties.map(key => {
      const property = this.mergePropertyWithMetadata(
        key,
        prototype,
        schemas,
        schemaRefsStack
      );

      const schemaCombinators = ['oneOf', 'anyOf', 'allOf'];
      if (schemaCombinators.some(key => key in property)) {
        delete (property as SchemaObjectMetadata).type;
      }
      return property;
    });
    const typeDefinition: SchemaObject = {
      type: 'object',
      properties: mapValues(keyBy(propertiesWithType, 'name'), property =>
        omit(property, ['name', 'isArray', 'required', 'enumName'])
      ) as Record<string, SchemaObject | ReferenceObject>
    };
    const typeDefinitionRequiredFields = (propertiesWithType as SchemaObjectMetadata[])
      .filter(property => property.required != false)
      .map(property => property.name);

    if (typeDefinitionRequiredFields.length > 0) {
      typeDefinition['required'] = typeDefinitionRequiredFields;
    }
    schemas.push({
      [type.name]: typeDefinition
    });
    return type.name;
  }

  mergePropertyWithMetadata(
    key: string,
    prototype: Type<unknown>,
    schemas: SchemaObject[],
    schemaRefsStack: string[] = []
  ): SchemaObjectMetadata | ReferenceObject {
    const metadata: SchemaObjectMetadata =
      Reflect.getMetadata(DECORATORS.API_MODEL_PROPERTIES, prototype, key) ||
      {};

    if (this.isLazyTypeFunc(metadata.type as Function)) {
      metadata.type = (metadata.type as Function)();
      [metadata.type, metadata.isArray] = getTypeIsArrayTuple(
        metadata.type,
        metadata.isArray
      );
    }
    if (isString(metadata.type)) {
      if (isEnumMetadata(metadata)) {
        return this.createEnumSchemaType(
          key,
          metadata,
          schemas,
          schemaRefsStack
        );
      }

      return {
        ...metadata,
        name: metadata.name || key
      };
    }
    if (!isBuiltInType(metadata.type as Function)) {
      return this.createNotBuiltInTypeReference(
        key,
        metadata,
        schemas,
        schemaRefsStack
      );
    }
    const typeName = this.getTypeName(metadata.type as Type<unknown>);
    const itemType = this.swaggerTypesMapper.mapTypeToOpenAPIType(typeName);
    if (metadata.isArray) {
      return this.transformToArraySchemaProperty(metadata, key, {
        type: itemType
      });
    } else if (itemType === 'array') {
      const defaultOnArray = 'string';
      return this.transformToArraySchemaProperty(metadata, key, {
        type: defaultOnArray
      });
    }
    return {
      ...metadata,
      name: metadata.name || key,
      type: itemType
    };
  }

  createEnumParam(
    param: ParamWithTypeMetadata & BaseParameterObject,
    schemas: SchemaObject[],
    schemaRefsStack: string[]
  ) {
    let enumName = param.enumName;
    const $ref = getSchemaPath(enumName);

    if (!includes(schemaRefsStack, enumName)) {
      schemaRefsStack.push(enumName);

      const _enum = param.enum
        ? param.enum
        : param.schema['items']
        ? param.schema['items']['enum']
        : param.schema['enum'];

      schemas.push({
        [enumName]: {
          type: 'string',
          enum: _enum
        }
      });
    }

    param.schema =
      param.isArray || param.schema?.['items']
        ? { type: 'array', items: { $ref } }
        : { $ref };

    cleanUpParam(param);
    return param;
  }

  createEnumSchemaType(
    key: string,
    metadata: SchemaObjectMetadata,
    schemas: SchemaObject[],
    schemaRefsStack: string[]
  ): BaseParameterObject & Record<string, any> {
    if (!metadata.enumName) {
      return {
        ...metadata,
        name: metadata.name || key
      } as any;
    }

    let enumName = metadata.enumName;
    const $ref = getSchemaPath(enumName);

    if (!includes(schemaRefsStack, enumName)) {
      schemaRefsStack.push(enumName);
      schemas.push({
        [enumName]: {
          type: 'string',
          enum: metadata.isArray ? metadata.items['enum'] : metadata.enum
        }
      });
    }

    const _schemaObject = {
      ...metadata,
      name: metadata.name || key,
      type: metadata.isArray ? 'array' : 'string'
    };

    const _ref = metadata.isArray ? { items: { $ref } } : { $ref };

    const _paramObject = { ..._schemaObject, ..._ref };

    if (!metadata.isArray) {
      delete _paramObject.type;
    }

    delete _paramObject.enum;
    return _paramObject as any;
  }

  createNotBuiltInTypeReference(
    key: string,
    metadata: SchemaObjectMetadata,
    schemas: SchemaObject[],
    schemaRefsStack: string[]
  ): BaseParameterObject & Record<string, any> {
    if (isUndefined(metadata.type)) {
      throw new Error(
        `A circular dependency has been detected (property key: "${key}"). Please, make sure that each side of a bidirectional relationships are using lazy resolvers ("type: () => ClassType").`
      );
    }
    let schemaObjectName = (metadata.type as Function).name;

    if (!includes(schemaRefsStack, schemaObjectName)) {
      schemaRefsStack.push(schemaObjectName);

      schemaObjectName = this.exploreModelSchema(
        metadata.type as Function,
        schemas,
        schemaRefsStack
      );
    }
    const $ref = getSchemaPath(schemaObjectName);
    if (metadata.isArray) {
      return this.transformToArraySchemaProperty(metadata, key, { $ref });
    }
    const keysToRemove = ['type', 'isArray'];
    const validMetadataObject = omit(metadata, keysToRemove);
    return ({
      ...validMetadataObject,
      name: metadata.name || key,
      $ref
    } as any) as BaseParameterObject;
  }

  transformToArraySchemaProperty(
    metadata: SchemaObjectMetadata,
    key: string,
    type: string | Record<string, any>
  ): BaseParameterObject & Record<string, any> {
    const keysToRemove = ['type', 'enum'];
    const schemaHost = {
      ...omit(metadata, keysToRemove),
      name: metadata.name || key,
      type: 'array',
      items: isString(type)
        ? {
            type
          }
        : { ...type }
    };
    schemaHost.items = omitBy(schemaHost.items, isUndefined);

    return (schemaHost as unknown) as BaseParameterObject & Record<string, any>;
  }

  mapArrayCtorParam(param: ParamWithTypeMetadata): any {
    return {
      ...omit(param, 'type'),
      schema: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    };
  }

  private isArrayCtor(type: Type<unknown> | string): boolean {
    return type === Array;
  }

  private isPrimitiveType(type: Type<unknown> | string): boolean {
    return (
      isFunction(type) && [String, Boolean, Number].some(item => item === type)
    );
  }

  private isLazyTypeFunc(
    type: Function | Type<unknown> | string
  ): type is { type: Function } & Function {
    return isFunction(type) && type.name == 'type';
  }

  private getTypeName(type: Type<unknown> | string): string {
    return type && isFunction(type) ? type.name : (type as string);
  }
}
