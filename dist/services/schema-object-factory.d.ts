import { Type } from '@nestjs/common';
import { BaseParameterObject, ReferenceObject, SchemaObject } from '../interfaces/open-api-spec.interface';
import { SchemaObjectMetadata } from '../interfaces/schema-object-metadata.interface';
import { ModelPropertiesAccessor } from './model-properties-accessor';
import { ParamWithTypeMetadata } from './parameter-metadata-accessor';
import { SwaggerTypesMapper } from './swagger-types-mapper';
export declare class SchemaObjectFactory {
    private readonly modelPropertiesAccessor;
    private readonly swaggerTypesMapper;
    constructor(modelPropertiesAccessor: ModelPropertiesAccessor, swaggerTypesMapper: SwaggerTypesMapper);
    createFromModel(parameters: ParamWithTypeMetadata[], schemas: SchemaObject[], schemaRefsStack?: string[]): Array<ParamWithTypeMetadata | BaseParameterObject>;
    exploreModelSchema(type: Type<unknown> | Function, schemas: SchemaObject[], schemaRefsStack?: string[]): string;
    mergePropertyWithMetadata(key: string, prototype: Type<unknown>, schemas: SchemaObject[], schemaRefsStack?: string[]): SchemaObjectMetadata | ReferenceObject;
    createEnumParam(param: ParamWithTypeMetadata & BaseParameterObject, schemas: SchemaObject[], schemaRefsStack: string[]): ParamWithTypeMetadata & BaseParameterObject;
    createEnumSchemaType(key: string, metadata: SchemaObjectMetadata, schemas: SchemaObject[], schemaRefsStack: string[]): BaseParameterObject & Record<string, any>;
    createNotBuiltInTypeReference(key: string, metadata: SchemaObjectMetadata, schemas: SchemaObject[], schemaRefsStack: string[]): BaseParameterObject & Record<string, any>;
    transformToArraySchemaProperty(metadata: SchemaObjectMetadata, key: string, type: string | Record<string, any>): BaseParameterObject & Record<string, any>;
    mapArrayCtorParam(param: ParamWithTypeMetadata): any;
    private isArrayCtor;
    private isPrimitiveType;
    private isLazyTypeFunc;
    private getTypeName;
}
