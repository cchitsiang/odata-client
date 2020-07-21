"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ODataFilter = exports.ExprOperator = exports.ODataDateTimeOffset = exports.ODataDateTime = exports.ODataDataObject = void 0;
const join_1 = __importDefault(require("@newdash/newdash/join"));
const errors_1 = require("./errors");
class ODataDataObject {
}
exports.ODataDataObject = ODataDataObject;
class ODataDateTime extends ODataDataObject {
    constructor(date) {
        super();
        this._date = date;
    }
    static from(date) {
        const rt = new ODataDateTime(date);
        return rt;
    }
    toString() {
        return `datetime'${this._date.toISOString()}'`;
    }
}
exports.ODataDateTime = ODataDateTime;
class ODataDateTimeOffset extends ODataDataObject {
    constructor(date) {
        super();
        this._date = date;
    }
    static from(date) {
        const rt = new ODataDateTimeOffset(date);
        return rt;
    }
    toString() {
        return `datetimeoffset'${this._date.toISOString()}'`;
    }
}
exports.ODataDateTimeOffset = ODataDateTimeOffset;
var ExprOperator;
(function (ExprOperator) {
    ExprOperator["eq"] = "eq";
    ExprOperator["ne"] = "ne";
    ExprOperator["gt"] = "gt";
    ExprOperator["lt"] = "lt";
    ExprOperator["ge"] = "ge";
    ExprOperator["le"] = "le";
})(ExprOperator = exports.ExprOperator || (exports.ExprOperator = {}));
/**
 * @private
 * @internal
 */
class ODataFieldExpr {
    constructor(filter, fieldName, mapping) {
        this._exprMappings = mapping;
        this._fieldName = fieldName;
        this._filter = filter;
        // initilize
        if (this._getFieldExprs() == undefined) {
            this._exprMappings[this._fieldName] = [];
        }
    }
    _getFieldExprs() {
        return this._exprMappings[this._fieldName];
    }
    _addExpr(op, value) {
        var _a;
        switch (typeof value) {
            case 'number':
                this._getFieldExprs().push({ op, value: `${value}` });
                break;
            case 'string':
                if (value.startsWith("'") || value.startsWith('datetime')) {
                    this._getFieldExprs().push({ op, value });
                }
                else {
                    this._getFieldExprs().push({ op, value: `'${value}'` });
                }
                break;
            case 'object':
                if (value instanceof ODataDataObject) {
                    this._getFieldExprs().push({ op, value: value.toString() });
                }
                else {
                    throw new errors_1.FrameworkError(`Not support object ${((_a = value === null || value === void 0 ? void 0 : value.constructor) === null || _a === void 0 ? void 0 : _a.name) || typeof value} in odata filter eq/ne/gt/ge/ne/nt ...`);
                }
                break;
            case 'undefined':
                throw new errors_1.ValidationError(`You must set value in odata filter eq/ne/gt/ge/ne/nt ...`);
            default:
                throw new errors_1.FrameworkError(`Not support typeof ${typeof value}: ${value} in odata filter eq/ne/gt/ge/ne/nt ...`);
        }
    }
    /**
     * equal
     * @param value
     */
    eq(value) {
        this._addExpr(ExprOperator.eq, value);
        return this._filter;
    }
    /**
     * not equal
     * @param value
     */
    ne(value) {
        this._addExpr(ExprOperator.ne, value);
        return this._filter;
    }
    eqString(value) {
        this._addExpr(ExprOperator.eq, `'${value}'`);
        return this._filter;
    }
    neString(value) {
        this._addExpr(ExprOperator.ne, `'${value}'`);
        return this._filter;
    }
    /**
     * greater or equal
     * @param value
     */
    ge(value) {
        this._addExpr(ExprOperator.ge, value);
        return this._filter;
    }
    /**
     * greater than
     * @param value
     */
    gt(value) {
        this._addExpr(ExprOperator.gt, value);
        return this._filter;
    }
    /**
     * less or equal
     * @param value
     */
    le(value) {
        this._addExpr(ExprOperator.le, value);
        return this._filter;
    }
    /**
     * less than
     * @param value
     */
    lt(value) {
        this._addExpr(ExprOperator.lt, value);
        return this._filter;
    }
    /**
     * match any value in an array
     *
     * @param values
     */
    in(values = []) {
        if (values.length > 0) {
            values.forEach((value) => {
                this.eqString(value);
            });
        }
        return this._filter;
    }
    /**
     * filter by value range
     *
     * @param low
     * @param max
     * @param includeBoundary
     */
    between(low, max, includeBoundary = true) {
        if (low == undefined || max == undefined) {
            throw new errors_1.ValidationError('You must give out the start and end value');
        }
        if (includeBoundary) {
            this.ge(low);
            this.le(max);
        }
        else {
            this.gt(low);
            this.lt(max);
        }
        return this._filter;
    }
    betweenDateTime(start, end, includeBoundary = true) {
        if (start == undefined && end == undefined) {
            throw new errors_1.ValidationError('You must give out the start or end date');
        }
        if (start instanceof Date) {
            if (includeBoundary) {
                this.ge(`datetime'${start.toISOString()}'`);
            }
            else {
                this.gt(`datetime'${start.toISOString()}'`);
            }
        }
        if (end instanceof Date) {
            if (includeBoundary) {
                this.le(`datetime'${end.toISOString()}'`);
            }
            else {
                this.lt(`datetime'${end.toISOString()}'`);
            }
        }
        return this._filter;
    }
    betweenDateTimeOffset(start, end, includeBoundary = true) {
        if (start == undefined && end == undefined) {
            throw new errors_1.ValidationError('You must give out the start or end date');
        }
        if (start instanceof Date) {
            if (includeBoundary) {
                this.ge(`datetimeoffset'${start.toISOString()}'`);
            }
            else {
                this.gt(`datetimeoffset'${start.toISOString()}'`);
            }
        }
        if (end instanceof Date) {
            if (includeBoundary) {
                this.le(`datetimeoffset'${end.toISOString()}'`);
            }
            else {
                this.lt(`datetimeoffset'${end.toISOString()}'`);
            }
        }
        return this._filter;
    }
}
/**
 * OData filter builder
 */
class ODataFilter {
    constructor() {
        this._fieldExprMappings = {};
    }
    static newBuilder() {
        return new ODataFilter();
    }
    /**
     * construct a new filter
     */
    static newFilter() {
        return new ODataFilter();
    }
    /**
     * getExprMapping
     *
     * @internal
     * @private
     */
    getExprMapping() {
        return this._fieldExprMappings;
    }
    /**
     * @param name filed name
     */
    field(name) {
        return new ODataFieldExpr(this, name, this.getExprMapping());
    }
    /**
     * The value of a field matches any value in the list.
     *
     * @deprecated please use filter.field().in()
     * @param name
     * @param values
     */
    fieldIn(name, values) {
        return this.fieldValueMatchArray(name, values);
    }
    /**
     * The value of a field matches any value in the list.
     *
     * @deprecated please use filter.field().in()
     * @param name
     * @param values
     */
    fieldValueMatchArray(name, values = []) {
        if (values) {
            values.forEach((value) => {
                this.field(name).eqString(value);
            });
        }
        return this;
    }
    /**
     * DEPRECATED
     *
     * please use betweenDateTime/betweenDateTimeOffset
     *
     * @deprecated
     * @param name
     * @param start
     * @param end
     */
    inPeriod(name, start, end) {
        return this.betweenDateTime(name, start, end);
    }
    /**
     * @deprecated
     * @param name
     * @param start
     * @param end
     */
    betweenDateTime(name, start, end) {
        if (start && end) {
            return this.gtDateTime(name, start).ltDateTime(name, end);
        }
        throw new errors_1.ValidationError('You must give out the start and end date');
    }
    /**
     * @deprecated
     * @param name
     * @param start
     * @param end
     */
    betweenDateTimeOffset(name, start, end) {
        if (start && end) {
            return this.gtDateTimeOffset(name, start).ltDateTimeOffset(name, end);
        }
        throw new errors_1.ValidationError('You must give out the start and end date');
    }
    /**
     * @deprecated
     * @param name
     * @param date
     */
    gtDateTime(name, date) {
        return this.field(name).gt(`datetime'${date.toISOString()}'`);
    }
    /**
     * @deprecated
     * @param name
     * @param date
     */
    gtDateTimeOffset(name, date) {
        return this.field(name).gt(`datetimeoffset'${date.toISOString()}'`);
    }
    /**
     * @deprecated
     * @param name
     * @param date
     */
    ltDateTime(name, date) {
        return this.field(name).lt(`datetime'${date.toISOString()}'`);
    }
    /**
     * @deprecated
     * @param name
     * @param date
     */
    ltDateTimeOffset(name, date) {
        return this.field(name).lt(`datetimeoffset'${date.toISOString()}'`);
    }
    /**
     * AND expr
     *
     * filter.field("A").eq("'a'").and().field("B").eq("'b").build() == "A eq 'a' and B eq 'b'"
     *
     * filter.field("A").eq("'a'").and("B eq 'b'").build() == "A eq 'a' and (B eq 'b')"
     *
     * @deprecated c4codata will auto detect connect operator between difference fields
     * @param filter
     */
    and(filter) {
        return this;
    }
    /**
     * @deprecated c4codata will auto detect connect operator in same fields
     * @param filter
     */
    or(filter) {
        return this;
    }
    /**
     * @deprecated c4codata will auto group exprs
     * @param filter
     */
    group(filter) {
        this._fieldExprMappings = Object.assign(this._fieldExprMappings, filter.getExprMapping());
        return this;
    }
    toString() {
        return this.build();
    }
    _buildFieldExprString(field) {
        const exprs = this.getExprMapping()[field];
        if (exprs.length > 0) {
            if (exprs.filter((expr) => expr.op == ExprOperator.eq).length == 0) {
                return `(${join_1.default(exprs.map(({ op, value }) => `${field} ${op} ${value}`), ' and ')})`;
            }
            return `(${join_1.default(exprs.map(({ op, value }) => `${field} ${op} ${value}`), ' or ')})`;
        }
        return '';
    }
    build() {
        let _rt = '';
        _rt = join_1.default(
        // join all fields exprs string
        Object.entries(this.getExprMapping()).map(([fieldName, exprs]) => {
            switch (exprs.length) {
                // if one field expr mapping array is empty
                case 0:
                    return '';
                // only have one expr
                case 1:
                    const { op, value } = exprs[0];
                    return `${fieldName} ${op} ${value}`;
                default:
                    // multi exprs
                    return this._buildFieldExprString(fieldName);
            }
        }), ' and ');
        return _rt;
    }
}
exports.ODataFilter = ODataFilter;
