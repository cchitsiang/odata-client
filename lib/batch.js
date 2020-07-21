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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseMultiPartContent = exports.parseResponse2 = exports.formatBatchRequest = exports.formatHttpRequestString = void 0;
const slice_1 = __importDefault(require("@newdash/newdash/slice"));
const join_1 = __importDefault(require("@newdash/newdash/join"));
const flatten_1 = __importDefault(require("@newdash/newdash/flatten"));
const concat_1 = __importDefault(require("@newdash/newdash/concat"));
const startsWith_1 = __importDefault(require("@newdash/newdash/startsWith"));
const http_string_parser_1 = require("http-string-parser");
const uuid_1 = require("uuid");
const HTTP_EOL = '\r\n';
exports.formatHttpRequestString = (u, r) => join_1.default([
    `${r.method || 'GET'} ${u} HTTP/1.1`,
    `${join_1.default(Object.entries(r.headers).map(([k, v]) => `${k}: ${v}`), HTTP_EOL)}`,
    `${r.body ? HTTP_EOL + r.body : ''}`
], HTTP_EOL);
/**
 * format batch request string body
 *
 * @param requests
 * @param boundary a given boundary id
 */
exports.formatBatchRequest = (requests, boundary) => join_1.default(concat_1.default(requests.map((r) => {
    if (r.init.method === 'GET' || !r.init.method) {
        return join_1.default([
            `--${boundary}`,
            'Content-Type: application/http',
            `Content-Transfer-Encoding: binary`,
            '',
            exports.formatHttpRequestString(r.url, r.init),
            ''
        ], HTTP_EOL);
    }
    const generatedUuid = uuid_1.v4();
    return join_1.default([
        `--${boundary}`,
        `Content-Type: multipart/mixed; boundary=${generatedUuid}`,
        '',
        `--${generatedUuid}`,
        'Content-Type: application/http',
        `Content-Transfer-Encoding: binary`,
        '',
        exports.formatHttpRequestString(r.url, r.init),
        '',
        `--${generatedUuid}--`
    ], HTTP_EOL);
}), `--${boundary}--`), HTTP_EOL);
/**
 * parse stringify response in multipart
 */
exports.parseResponse2 = (httpResponseString) => __awaiter(void 0, void 0, void 0, function* () {
    const response = http_string_parser_1.parseResponse(httpResponseString);
    const rt = {
        json: () => __awaiter(void 0, void 0, void 0, function* () { return JSON.parse(response.body); }),
        text: () => __awaiter(void 0, void 0, void 0, function* () { return response.body; }),
        headers: response.headers,
        status: parseInt(response.statusCode, 10),
        statusText: response.statusMessage
    };
    return rt;
});
exports.parseMultiPartContent = (multipartBody, boundaryId) => __awaiter(void 0, void 0, void 0, function* () {
    if (multipartBody && boundaryId) {
        // split
        const parts = multipartBody.split(`--${boundaryId}`);
        // remote head and tail parts
        const meaningfulParts = slice_1.default(parts, 1, parts.length - 1);
        return flatten_1.default(yield Promise.all(meaningfulParts.map((p) => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield exports.parseResponse2(p);
            const contentType = response.headers['Content-Type'];
            // recursive parse changeset response
            if (startsWith_1.default(contentType, 'multipart/mixed')) {
                const innerBoundaryString = contentType.split('=').pop();
                return exports.parseMultiPartContent(yield response.text(), innerBoundaryString);
            }
            else if (contentType === 'application/http') {
                return exports.parseResponse2(yield response.text());
            }
        }))));
    }
    throw new Error('parameter lost');
});
