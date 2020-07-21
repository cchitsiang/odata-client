"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationError = exports.FrameworkError = exports.AuthendicationError = exports.ODataServerError = void 0;
class ODataServerError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.ODataServerError = ODataServerError;
class AuthendicationError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.AuthendicationError = AuthendicationError;
class FrameworkError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.FrameworkError = FrameworkError;
class ValidationError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.ValidationError = ValidationError;
