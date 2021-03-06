import * as ts from 'typescript';
export declare function getDecoratorOrUndefinedByNames(names: string[], decorators: ts.NodeArray<ts.Decorator>): ts.Decorator | undefined;
export declare function getTypeReferenceAsString(type: ts.Type, typeChecker: ts.TypeChecker): string;
export declare function isPromiseOrObservable(type: string): boolean;
export declare function hasPropertyKey(key: string, properties: ts.NodeArray<ts.PropertyAssignment>): boolean;
export declare function replaceImportPath(typeReference: string, fileName: string): string;
export declare function isDynamicallyAdded(identifier: ts.Node): boolean;
