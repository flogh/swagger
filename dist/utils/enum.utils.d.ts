import { BaseParameterObject } from '../interfaces/open-api-spec.interface';
import { SchemaObjectMetadata } from '../interfaces/schema-object-metadata.interface';
import { ParamWithTypeMetadata } from '../services/parameter-metadata-accessor';
import { SwaggerEnumType } from '../types/swagger-enum.type';
export declare function getEnumValues(enumType: SwaggerEnumType): {
    values: string[] | number[];
    enumName: string;
};
export declare function getEnumType(values: (string | number)[]): 'string' | 'number';
export declare function addEnumArraySchema(paramDefinition: Record<'schema' | 'isArray' | 'enumName', any>, decoratorOptions: Partial<Record<'enum', any>>): void;
export declare function addEnumSchema(paramDefinition: Record<'schema' | 'enumName', any>, decoratorOptions: Partial<Record<'enum', any>>): void;
export declare const cleanUpParam: (param: ParamWithTypeMetadata & BaseParameterObject) => void;
export declare const isEnumArray: <T extends Partial<Record<"enum" | "isArray", any>>>(obj: Record<string, any>) => obj is T;
export declare const isEnumDefined: <T extends Partial<Record<"enum", any>>>(obj: Record<string, any>) => obj is T;
export declare const isEnumMetadata: (metadata: SchemaObjectMetadata) => any;
