export declare function createMethodDecorator<T = any>(metakey: string, metadata: T): MethodDecorator;
export declare function createClassDecorator<T extends Array<any> = any>(metakey: string, metadata?: T): ClassDecorator;
export declare function createPropertyDecorator<T extends Record<string, any> = any>(metakey: string, metadata: T): PropertyDecorator;
export declare function createMixedDecorator<T = any>(metakey: string, metadata: T): any;
export declare function createParamDecorator<T extends Record<string, any> = any>(metadata: T, initial: Partial<T>): MethodDecorator;
export declare function getTypeIsArrayTuple(input: Function | [Function] | undefined | string, isArrayFlag: boolean): [Function | undefined, boolean];
