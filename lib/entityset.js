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
exports.EntitySet = void 0;
const params_1 = require("./params");
const request_1 = require("./request");
const filter_1 = require("./filter");
class EntitySet {
    constructor(collection, client) {
        this._collection = collection;
        this._client = client;
    }
    _checkError(res) {
        var _a, _b, _c;
        if (res.error) {
            switch (this._client.getVersion()) {
                case 'v2':
                    throw new Error((_b = (_a = res.error) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.value);
                case 'v4':
                    throw new Error((_c = res.error) === null || _c === void 0 ? void 0 : _c.message);
                default:
                    break;
            }
        }
    }
    _getResult(res) {
        var _a;
        switch (this._client.getVersion()) {
            case 'v2':
                // @ts-ignore
                return ((_a = res.d) === null || _a === void 0 ? void 0 : _a.results) || res.d;
            case 'v4':
                // @ts-ignore
                return (res === null || res === void 0 ? void 0 : res.value) || res;
            default:
                break;
        }
    }
    retrieve(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._client.newRequest({
                collection: this._collection,
                method: 'GET',
                id
            });
            this._checkError(res);
            return this._getResult(res);
        });
    }
    find(base) {
        return __awaiter(this, void 0, void 0, function* () {
            const filter = request_1.OData.newFilter();
            Object.entries(base).forEach(([key, value]) => {
                if (typeof value == 'string') {
                    filter.field(key).eqString(value);
                }
                else {
                    filter.field(key).eq(value);
                }
            });
            return this.query(request_1.OData.newParam().filter(filter));
        });
    }
    query(param) {
        return __awaiter(this, void 0, void 0, function* () {
            if (param instanceof filter_1.ODataFilter) {
                param = params_1.ODataQueryParam.newParam().filter(param);
            }
            if (param == undefined) {
                param = request_1.OData.newParam();
            }
            const res = yield this._client.newRequest({
                collection: this._collection,
                method: 'GET',
                params: param
            });
            this._checkError(res);
            return this._getResult(res);
        });
    }
    count(filter) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const params = request_1.OData.newParam().inlinecount(true).count(true); // set count flag
            if (filter) {
                params.filter(filter);
            }
            const res = yield this._client.newRequest({
                collection: this._collection,
                method: 'GET',
                params
            });
            this._checkError(res);
            switch (this._client.getVersion()) {
                case 'v2':
                    return parseInt((_a = res === null || res === void 0 ? void 0 : res.d) === null || _a === void 0 ? void 0 : _a.__count);
                case 'v4':
                    return res['@odata.count'];
                default:
                    break;
            }
        });
    }
    create(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._client.newRequest({
                collection: this._collection,
                method: 'POST',
                entity: body
            });
            this._checkError(res);
            return this._getResult(res);
        });
    }
    update(id, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._client.newRequest({
                collection: this._collection,
                method: 'PATCH',
                id,
                entity: body
            });
            this._checkError(res);
            return this._getResult(res);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this._client.newRequest({
                collection: this._collection,
                method: 'DELETE',
                id
            });
            this._checkError(res);
        });
    }
}
exports.EntitySet = EntitySet;
