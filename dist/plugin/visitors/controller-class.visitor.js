"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const ts = require("typescript");
const decorators_1 = require("../../decorators");
const plugin_constants_1 = require("../plugin-constants");
const ast_utils_1 = require("../utils/ast-utils");
const plugin_utils_1 = require("../utils/plugin-utils");
const abstract_visitor_1 = require("./abstract.visitor");
class ControllerClassVisitor extends abstract_visitor_1.AbstractFileVisitor {
    visit(sourceFile, ctx, program) {
        const typeChecker = program.getTypeChecker();
        sourceFile = this.updateImports(sourceFile);
        const visitNode = (node) => {
            if (ts.isMethodDeclaration(node)) {
                return this.addDecoratorToNode(node, typeChecker, sourceFile.fileName);
            }
            return ts.visitEachChild(node, visitNode, ctx);
        };
        return ts.visitNode(sourceFile, visitNode);
    }
    addDecoratorToNode(compilerNode, typeChecker, hostFilename) {
        const node = ts.getMutableClone(compilerNode);
        const nodeArray = node.decorators || ts.createNodeArray();
        const { pos, end } = nodeArray;
        node.decorators = Object.assign([
            ...nodeArray,
            ts.createDecorator(ts.createCall(ts.createIdentifier(`${plugin_constants_1.OPENAPI_NAMESPACE}.${decorators_1.ApiResponse.name}`), undefined, [
                this.createDecoratorObjectLiteralExpr(node, typeChecker, ts.createNodeArray(), hostFilename)
            ]))
        ], { pos, end });
        return node;
    }
    createDecoratorObjectLiteralExpr(node, typeChecker, existingProperties = ts.createNodeArray(), hostFilename) {
        const properties = [
            ...existingProperties,
            this.createStatusPropertyAssignment(node, existingProperties),
            this.createTypePropertyAssignment(node, typeChecker, existingProperties, hostFilename)
        ];
        return ts.createObjectLiteral(lodash_1.compact(properties));
    }
    createTypePropertyAssignment(node, typeChecker, existingProperties, hostFilename) {
        if (plugin_utils_1.hasPropertyKey('type', existingProperties)) {
            return undefined;
        }
        const signature = typeChecker.getSignatureFromDeclaration(node);
        const type = typeChecker.getReturnTypeOfSignature(signature);
        if (!type) {
            return undefined;
        }
        let typeReference = plugin_utils_1.getTypeReferenceAsString(type, typeChecker);
        if (!typeReference) {
            return undefined;
        }
        typeReference = plugin_utils_1.replaceImportPath(typeReference, hostFilename);
        return ts.createPropertyAssignment('type', ts.createIdentifier(typeReference));
    }
    createStatusPropertyAssignment(node, existingProperties) {
        if (plugin_utils_1.hasPropertyKey('status', existingProperties)) {
            return undefined;
        }
        const statusNode = this.getStatusCodeIdentifier(node);
        return ts.createPropertyAssignment('status', statusNode);
    }
    getStatusCodeIdentifier(node) {
        const decorators = node.decorators;
        const httpCodeDecorator = plugin_utils_1.getDecoratorOrUndefinedByNames(['HttpCode'], decorators);
        if (httpCodeDecorator) {
            const argument = lodash_1.head(ast_utils_1.getDecoratorArguments(httpCodeDecorator));
            if (argument) {
                return argument;
            }
        }
        const postDecorator = plugin_utils_1.getDecoratorOrUndefinedByNames(['Post'], decorators);
        if (postDecorator) {
            return ts.createIdentifier('201');
        }
        return ts.createIdentifier('200');
    }
}
exports.ControllerClassVisitor = ControllerClassVisitor;
