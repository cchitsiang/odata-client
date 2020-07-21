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
exports.BaiscAuthProcessor = void 0;
const base64_1 = require("../base64");
const S_AUTHORIZATION = 'Authorization';
class BaiscAuthProcessor {
    constructor(credential) {
        this._credential = credential;
    }
    pre(request) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, password = '' } = this._credential;
            if (request.init == undefined) {
                request.init = {};
            }
            if (request.init.headers == undefined) {
                request.init.headers = {};
            }
            request.init.headers[S_AUTHORIZATION] = `Basic ${base64_1.encode(`${username}:${password}`)}`;
            return request;
        });
    }
}
exports.BaiscAuthProcessor = BaiscAuthProcessor;
