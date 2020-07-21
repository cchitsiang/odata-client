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
exports.OData = void 0;
const attempt_1 = __importDefault(require("@newdash/newdash/attempt"));
const join_1 = __importDefault(require("@newdash/newdash/join"));
const slice_1 = __importDefault(require("@newdash/newdash/slice"));
const startsWith_1 = __importDefault(require("@newdash/newdash/startsWith"));
const uuid_1 = require("uuid");
const batch_1 = require("./batch");
const filter_1 = require("./filter");
const params_1 = require("./params");
const util_1 = require("./util");
const entityset_1 = require("./entityset");
const errors_1 = require("./errors");
const S_X_CSRF_TOKEN = 'x-csrf-token';
const S_CONTENT_TYPE = 'Content-Type';
const odataDefaultFetchProxy = (url, init) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield fetch(url, init);
    let content = yield res.text();
    if (res.headers.has(S_CONTENT_TYPE) && startsWith_1.default(res.headers.get(S_CONTENT_TYPE), 'application/json')) {
        const jsonResult = attempt_1.default(JSON.parse, content);
        // supress error
        if (!(jsonResult instanceof Error)) {
            content = jsonResult;
        }
    }
    return {
        content,
        response: res
    };
});
/**
 * OData Client
 */
class OData {
    /**
     * OData
     *
     * @deprecated please use static method create instance
     * @private
     */
    constructor(metadataUri, credential, headers = {}, 
    /**
     * deprecated, DONT use it
     */
    urlRewrite, fetchProxy, 
    /**
     * auto fetch csrf token before broken operation
     */
    processCsrfToken = true) {
        /**
         * internal csrf token
         */
        this.csrfToken = '';
        /**
         * dont direct use this object
         */
        this.commonHeader = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };
        this.fetchProxy = odataDefaultFetchProxy;
        this.processCsrfToken = true;
        this.forSAP = false;
        this.variant = 'default';
        this.version = 'v2';
        if (fetchProxy) {
            this.fetchProxy = fetchProxy;
        }
        if (!metadataUri) {
            throw new Error('metadata url required !');
        }
        else {
            this.metadataUri = metadataUri;
            // e.g https://c4c-system/sap/c4c/odata/v1/c4codata/
            this.odataEnd =
                `${join_1.default(slice_1.default(this.metadataUri.split('/'), 0, -1), '/')}/`;
            if (credential) {
                this.credential = credential;
            }
        }
        this.commonHeader = Object.assign(Object.assign({}, this.commonHeader), headers);
        this.processCsrfToken = processCsrfToken;
    }
    /**
     * alternative constructor
     *
     * @param options config options
     */
    static New(options) {
        const rt = new OData(options.metadataUri, options.credential, undefined, undefined, options.fetchProxy, options.processCsrfToken);
        rt.forSAP = options.forSAP || false;
        rt.version = options.version || 'v2';
        rt.variant = options.variant || 'default';
        return rt;
    }
    /**
     * create odata client instance for odata v4
     *
     * @param options
     */
    static New4(options) {
        options.version = 'v4';
        return OData.New(options);
    }
    /**
     * new odata query param
     */
    static newParam() {
        return params_1.ODataParam.newParam();
    }
    /**
     * new filter
     */
    static newFilter() {
        return filter_1.ODataFilter.newFilter();
    }
    /**
     * generate dynamic header
     */
    getHeaders() {
        return __awaiter(this, void 0, void 0, function* () {
            let rt = Object.assign({}, this.commonHeader);
            if (this.credential) {
                rt = Object.assign(Object.assign({}, rt), util_1.GetAuthorizationPair(this.credential.username, this.credential.password));
            }
            if (this.processCsrfToken) {
                rt[S_X_CSRF_TOKEN] = yield this.getCsrfToken();
            }
            return rt;
        });
    }
    /**
     * getEntitySet
     *
     * @param entitySetName the name of entity set, you can get it from metadata
     *
     */
    getEntitySet(entitySetName) {
        return new entityset_1.EntitySet(entitySetName, this);
    }
    /**
     * Set OData Client Http Basic credential
     *
     * @param credential
     */
    setCredential(credential) {
        this.credential = credential;
    }
    /**
     * setODataEndPath
     *
     * e.g. https://tenant.c4c.saphybriscloud.cn/sap/c4c/odata/v1/c4codata/
     */
    setODataEndPath(odataEnd) {
        if (odataEnd) {
            this.odataEnd = odataEnd;
        }
    }
    getVersion() {
        return this.version;
    }
    /**
     * fetch CSRF Token
     */
    getCsrfToken() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.csrfToken && this.csrfToken != null) {
                return this.csrfToken;
            }
            const config = {
                method: 'GET',
                headers: { [S_X_CSRF_TOKEN]: 'fetch' }
            };
            if (this.credential) {
                config.headers = Object.assign(Object.assign({}, config.headers), util_1.GetAuthorizationPair(this.credential.username, this.credential.password));
            }
            const { response: { headers } } = yield this.fetchProxy(this.odataEnd, config);
            if (headers) {
                this.csrfToken = headers.get(S_X_CSRF_TOKEN);
            }
            else {
                throw new Error('csrf token need the odata proxy give out headers!');
            }
            return this.csrfToken;
        });
    }
    cleanCsrfToken() {
        if (this.csrfToken) {
            delete this.csrfToken;
        }
    }
    /**
     * odata request uri
     *
     * @param uri HTTP URI
     * @param queryParams odata query params
     * @param method HTTP method
     * @param body request content
     */
    requestUri(uri, queryParams, method = 'GET', body) {
        return __awaiter(this, void 0, void 0, function* () {
            const finalUri = uri;
            const config = { method, headers: yield this.getHeaders() };
            // format body
            if (method !== 'GET' && body) {
                if (typeof body !== 'string') {
                    config.body = JSON.stringify(body);
                }
                else {
                    config.body = body;
                }
            }
            // request & response
            let res = yield this.fetchProxy(finalUri, config);
            // one time retry if csrf token time expired
            if (this.processCsrfToken) {
                if (res.response.headers) {
                    if (res.response.headers.get(S_X_CSRF_TOKEN) === 'Required') {
                        this.cleanCsrfToken();
                        config.headers[S_X_CSRF_TOKEN] = yield this.getCsrfToken();
                        res = yield this.fetchProxy(finalUri, config);
                    }
                }
            }
            const { content } = res;
            return content;
        });
    }
    /**
     * odata request
     *
     * @param collection CollectionName
     * @param id entity uuid or compound key
     * @param queryParams query param, not work for single entity uri
     * @param method request method
     * @param entity C4C Entity instance
     */
    request(collection, id, queryParams, method = 'GET', entity) {
        return __awaiter(this, void 0, void 0, function* () {
            let url = `${this.odataEnd}${collection}`;
            if (id) {
                url += this.formatIdString(id);
            }
            if (queryParams) {
                url = `${url}?${queryParams.toString(this.version)}`;
            }
            return this.requestUri(url, queryParams, method, entity);
        });
    }
    /**
     * format id part of url
     *
     * @param id
     */
    formatIdString(id) {
        let rt = '';
        switch (typeof id) {
            // for compound key like
            // Alphabetical_list_of_products(CategoryName='Beverages',Discontinued=false,ProductID=1,ProductName='Chai')
            case 'object':
                const compoundId = Object.entries(id).map((kv) => {
                    const k = kv[0];
                    const v = kv[1];
                    switch (typeof v) {
                        case 'string':
                            return `${k}='${v}'`;
                        case 'number':
                            return `${k}=${v}`;
                        case 'boolean':
                            return `${k}=${v}`;
                        default:
                            // other type will be removed
                            return '';
                    }
                }).filter((v) => v).join(',');
                rt = `(${compoundId})`;
                break;
            case 'number':
                rt = `(${id})`;
                break;
            case 'string':
                if (this.variant == 'cap') {
                    rt = `(${id})`; // for cap framework, id string should remove singlequote
                }
                else {
                    rt = `('${id}')`;
                }
                break;
            case 'undefined':
                break;
            default:
                throw new errors_1.FrameworkError(`Not supported ObjectID type ${typeof id} for request`);
        }
        return rt;
    }
    newRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(options.collection, options.id, options.params, options.method, options.entity);
        });
    }
    /**
     * format batch request parameter
     */
    formatBatchRequests(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const url = `${this.odataEnd}$batch`;
            const req = {
                method: 'POST',
                headers: yield this.getHeaders()
            };
            // format promised requests
            const r = yield Promise.all(requests.map((aBatchR) => __awaiter(this, void 0, void 0, function* () { return yield aBatchR; })));
            const requestBoundaryString = uuid_1.v4();
            req.headers['Content-Type'] = `multipart/mixed; boundary=${requestBoundaryString}`;
            req.body = batch_1.formatBatchRequest(r, requestBoundaryString);
            return { url, req };
        });
    }
    /**
     * execute batch requests and get response
     *
     * @param requests batch request
     */
    execBatchRequests(requests) {
        return __awaiter(this, void 0, void 0, function* () {
            const { url, req } = yield this.formatBatchRequests(requests);
            const { content, response: { headers } } = yield this.fetchProxy(url, req);
            const responseBoundaryString = headers.get('Content-Type').split('=').pop();
            if (responseBoundaryString.length == 0) {
                // if boundary string empty, error here
            }
            return yield batch_1.parseMultiPartContent(content, responseBoundaryString);
        });
    }
    newBatchRequest(options) {
        return __awaiter(this, void 0, void 0, function* () {
            let { withContentLength = false } = options;
            const { collection, method = 'GET', id, params, entity } = options;
            if (this.forSAP) {
                // for SAP NetWeaver Platform OData, need content length header
                withContentLength = true;
            }
            let url = collection;
            const headers = Object.assign({}, this.commonHeader); // clone
            const rt = { url, init: { method, headers, body: '' } };
            if (id) {
                url += this.formatIdString(id);
            }
            // READ OPERATION
            if (method === 'GET' || method === 'DELETE') {
                delete headers['Content-Type'];
                // other request don't need param
                if (params) {
                    url = `${url}?${params.toString(this.version)}`;
                }
            }
            // WRITE OPERATION
            else {
                switch (typeof entity) {
                    case 'string':
                        rt.init.body = entity;
                        break;
                    case 'object':
                        rt.init.body = JSON.stringify(entity);
                        break;
                    default:
                        break;
                }
                if (withContentLength) {
                    rt.init.headers['Content-Length'] = encodeURI(rt.init.body.toString()).length;
                }
            }
            rt.init.headers = headers;
            rt.url = url;
            return rt;
        });
    }
}
exports.OData = OData;
