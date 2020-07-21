"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CSRFProcessor = exports.InvalidCSRFTokenError = void 0;
const S_X_CSRF_TOKEN = 'x-csrf-token';
const S_REQUIRED = 'Required';
const S_FETCH = 'fetch';
class InvalidCSRFTokenError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.InvalidCSRFTokenError = InvalidCSRFTokenError;
class CSRFProcessor {
    constructor() {
        this.__CSRFToken = '';
    }
    pre(request) {
        return __awaiter(this, void 0, void 0, function* () {
            if (request.init == undefined) {
                request.init = {};
            }
            if (request.init.headers == undefined) {
                request.init.headers = {};
            }
            if (this.__CSRFToken) {
                request.init.headers[S_X_CSRF_TOKEN] = this.__CSRFToken;
            }
            else {
                request.init.headers[S_X_CSRF_TOKEN] = S_FETCH;
            }
            return request;
        });
    }
    post(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const csrfHeader = response.headers.get(S_X_CSRF_TOKEN);
            if (csrfHeader && csrfHeader != S_REQUIRED) {
                this.__CSRFToken = csrfHeader;
            }
            if (csrfHeader == S_REQUIRED) {
                throw new InvalidCSRFTokenError('Please do the READ operation firstly to get the CSRF token');
            }
            return response;
        });
    }
}
exports.CSRFProcessor = CSRFProcessor;
