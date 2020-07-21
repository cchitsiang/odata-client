"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ODataParam = exports.ODataQueryParam = void 0;
const filter_1 = require("./filter");
const concat_1 = __importDefault(require("@newdash/newdash/concat"));
const join_1 = __importDefault(require("@newdash/newdash/join"));
const isArray_1 = __importDefault(require("@newdash/newdash/isArray"));
const uniq_1 = __importDefault(require("@newdash/newdash/uniq"));
class SearchParams {
    constructor() {
        this._store = new Map();
    }
    append(key, value) {
        this._store.set(key, value);
    }
    toString() {
        const coll = [];
        this._store.forEach((value, key) => {
            coll.push(`${key}=${value}`);
        });
        return coll.join('&');
    }
}
/**
 * OData Param Object
 *
 * ref https://github.com/SAP/C4CODATAAPIDEVGUIDE
 */
class ODataQueryParam {
    constructor() {
        this.$skip = 0;
        this.$top = 0;
        this.$select = [];
        this.$format = 'json';
        this.$expand = [];
        this.$count = false;
    }
    static newParam() {
        return new ODataQueryParam();
    }
    /**
     * with $inlinecount value
     *
     * @version 2.0.0
     */
    inlinecount(inlinecount = false) {
        if (inlinecount) {
            this.$inlinecount = 'allpages';
        }
        else {
            delete this.$inlinecount;
        }
        return this;
    }
    /**
     *
     * count items in odata v4
     *
     * @param count
     *
     * @version 4.0.0
     */
    count(count = true) {
        this.$count = count;
        return this;
    }
    /**
     * apply filter for query
     *
     * @param filter
     */
    filter(filter) {
        if (filter instanceof filter_1.ODataFilter) {
            this.$filter = filter.build();
            return this;
        }
        else if (typeof filter === 'string') {
            this.$filter = filter;
            return this;
        }
        throw Error('ODataQueryParam.filter only accept string or ODataFilter type parameter');
    }
    /**
     * skip first records
     *
     * @param skip
     */
    skip(skip) {
        this.$skip = skip;
        return this;
    }
    /**
     * limit result max records
     *
     * @param top
     */
    top(top) {
        this.$top = top;
        return this;
    }
    /**
     * select viewed fields
     *
     * @param selects
     */
    select(selects) {
        this.$select = concat_1.default(this.$select, selects);
        return this;
    }
    /**
     * set order sequence
     *
     * @param fieldOrOrders
     * @param order default desc, disabled when first params is array
     */
    orderby(fieldOrOrders, order = 'desc') {
        if (isArray_1.default(fieldOrOrders)) {
            return this.orderbyMulti(fieldOrOrders);
        }
        this.$orderby = `${fieldOrOrders} ${order}`;
        return this;
    }
    /**
     * set order by multi field
     *
     * @param fields
     */
    orderbyMulti(fields = []) {
        this.$orderby = join_1.default(fields.map((f) => `${f.field} ${f.order || 'desc'}`), ',');
        return this;
    }
    /**
     * result format, please keep it as json
     *
     * @param format deafult json
     */
    format(format) {
        if (format === 'json') {
            this.$format = format;
        }
        else {
            throw new Error('light-odata dont support xml response');
        }
        return this;
    }
    /**
     * full text search
     *
     * default with fuzzy search, SAP system or OData V4 only
     *
     * @param value
     * @version 4.0.0
     */
    search(value, fuzzy = true) {
        this.$search = fuzzy ? `%${value}%` : value;
        return this;
    }
    /**
     * expand navigation props
     *
     * @param fields
     * @param replace
     */
    expand(fields, replace = false) {
        if (replace) {
            if (typeof fields == 'string') {
                this.$expand = [fields];
            }
            else if (isArray_1.default(fields)) {
                this.$expand = fields;
            }
        }
        else {
            this.$expand = concat_1.default(this.$expand, fields);
        }
        return this;
    }
    toString(version = 'v2') {
        const rt = new SearchParams();
        if (this.$format) {
            rt.append('$format', this.$format);
        }
        if (this.$filter) {
            rt.append('$filter', this.$filter.toString());
        }
        if (this.$orderby) {
            rt.append('$orderby', this.$orderby);
        }
        if (this.$search) {
            rt.append('$search', this.$search);
        }
        if (this.$select && this.$select.length > 0) {
            rt.append('$select', join_1.default(uniq_1.default(this.$select), ','));
        }
        if (this.$skip) {
            rt.append('$skip', this.$skip.toString());
        }
        if (this.$top && this.$top > 0) {
            rt.append('$top', this.$top.toString());
        }
        if (this.$expand && this.$expand.length > 0) {
            rt.append('$expand', this.$expand.join(','));
        }
        switch (version) {
            case 'v2':
                if (this.$inlinecount) {
                    rt.append('$inlinecount', this.$inlinecount);
                }
                break;
            case 'v4':
                if (this.$count) {
                    rt.append('$count', 'true');
                }
                break;
            default:
                break;
        }
        return rt.toString();
    }
}
exports.ODataQueryParam = ODataQueryParam;
exports.ODataParam = ODataQueryParam;
