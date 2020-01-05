import * as ts from 'typescript';
import { PluginOptions } from '../merge-options';
import { AbstractFileVisitor } from './abstract.visitor';
export declare class ModelClassVisitor extends AbstractFileVisitor {
    visit(sourceFile: ts.SourceFile, ctx: ts.TransformationContext, program: ts.Program, options: PluginOptions): ts.SourceFile;
    addMetadataFactory(node: ts.ClassDeclaration): ts.ClassDeclaration;
    inspectPropertyDeclaration(compilerNode: ts.PropertyDeclaration, typeChecker: ts.TypeChecker, options: PluginOptions, hostFilename: string): void;
    createDecoratorObjectLiteralExpr(node: ts.PropertyDeclaration, typeChecker: ts.TypeChecker, existingProperties?: ts.NodeArray<ts.PropertyAssignment>, options?: PluginOptions, hostFilename?: string): ts.ObjectLiteralExpression;
    createTypePropertyAssignment(node: ts.PropertyDeclaration, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.PropertyAssignment;
    createEnumPropertyAssignment(node: ts.PropertyDeclaration, typeChecker: ts.TypeChecker, existingProperties: ts.NodeArray<ts.PropertyAssignment>, hostFilename: string): ts.PropertyAssignment | ts.PropertyAssignment[];
    createDefaultPropertyAssignment(node: ts.PropertyDeclaration, existingProperties: ts.NodeArray<ts.PropertyAssignment>): ts.PropertyAssignment;
    createValidationPropertyAssignments(node: ts.PropertyDeclaration): ts.PropertyAssignment[];
    addPropertyByValidationDecorator(decoratorName: string, propertyKey: string, decorators: ts.NodeArray<ts.Decorator>, assignments: ts.PropertyAssignment[]): void;
    addClassMetadata(node: ts.PropertyDeclaration, objectLiteral: ts.ObjectLiteralExpression): void;
    getClassMetadata(node: ts.ClassDeclaration): any;
}
