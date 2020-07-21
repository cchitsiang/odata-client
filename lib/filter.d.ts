export declare abstract class ODataDataObject {
    abstract toString(): string;
}
export declare class ODataDateTime extends ODataDataObject {
    private constructor();
    static from(date: Date): ODataDateTime;
    private _date;
    toString(): string;
}
export declare class ODataDateTimeOffset extends ODataDataObject {
    private constructor();
    static from(date: Date): ODataDateTimeOffset;
    private _date;
    toString(): string;
}
export declare enum ExprOperator {
    eq = "eq",
    ne = "ne",
    gt = "gt",
    lt = "lt",
    ge = "ge",
    le = "le"
}
declare type FieldExpr = {
    op: ExprOperator;
    value: string;
};
declare type FieldExprMappings = {
    [key: string]: FieldExpr[];
};
/**
 * @private
 * @internal
 */
declare class ODataFieldExpr {
    constructor(filter: ODataFilter, fieldName: string, mapping: FieldExprMappings);
    private _filter;
    private _fieldName;
    private _exprMappings;
    private _getFieldExprs;
    private _addExpr;
    /**
     * equal
     * @param value
     */
    eq(value: number | string | ODataDataObject): ODataFilter;
    /**
     * not equal
     * @param value
     */
    ne(value: number | string | ODataDataObject): ODataFilter;
    eqString(value: string): ODataFilter;
    neString(value: string): ODataFilter;
    /**
     * greater or equal
     * @param value
     */
    ge(value: number | string | ODataDataObject): ODataFilter;
    /**
     * greater than
     * @param value
     */
    gt(value: number | string | ODataDataObject): ODataFilter;
    /**
     * less or equal
     * @param value
     */
    le(value: number | string | ODataDataObject): ODataFilter;
    /**
     * less than
     * @param value
     */
    lt(value: number | string | ODataDataObject): ODataFilter;
    /**
     * match any value in an array
     *
     * @param values
     */
    in(values?: string[]): ODataFilter;
    /**
     * filter by value range
     *
     * @param low
     * @param max
     * @param includeBoundary
     */
    between(low: any, max: any, includeBoundary?: boolean): ODataFilter;
    betweenDateTime(start?: Date, end?: Date, includeBoundary?: boolean): ODataFilter;
    betweenDateTimeOffset(start?: Date, end?: Date, includeBoundary?: boolean): ODataFilter;
}
/**
 * OData filter builder
 */
export declare class ODataFilter {
    static newBuilder(): ODataFilter;
    /**
     * construct a new filter
     */
    static newFilter(): ODataFilter;
    private _fieldExprMappings;
    /**
     * getExprMapping
     *
     * @internal
     * @private
     */
    private getExprMapping;
    /**
     * @param name filed name
     */
    field(name: string): ODataFieldExpr;
    /**
     * The value of a field matches any value in the list.
     *
     * @deprecated please use filter.field().in()
     * @param name
     * @param values
     */
    fieldIn(name: string, values: string[]): this;
    /**
     * The value of a field matches any value in the list.
     *
     * @deprecated please use filter.field().in()
     * @param name
     * @param values
     */
    fieldValueMatchArray(name: string, values?: string[]): this;
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
    inPeriod(name: string, start: Date, end: Date): ODataFilter;
    /**
     * @deprecated
     * @param name
     * @param start
     * @param end
     */
    betweenDateTime(name: string, start: Date, end: Date): ODataFilter;
    /**
     * @deprecated
     * @param name
     * @param start
     * @param end
     */
    betweenDateTimeOffset(name: string, start: Date, end: Date): ODataFilter;
    /**
     * @deprecated
     * @param name
     * @param date
     */
    gtDateTime(name: string, date: Date): ODataFilter;
    /**
     * @deprecated
     * @param name
     * @param date
     */
    gtDateTimeOffset(name: string, date: Date): ODataFilter;
    /**
     * @deprecated
     * @param name
     * @param date
     */
    ltDateTime(name: string, date: Date): ODataFilter;
    /**
     * @deprecated
     * @param name
     * @param date
     */
    ltDateTimeOffset(name: string, date: Date): ODataFilter;
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
    and(filter?: string | ODataFilter): ODataFilter;
    /**
     * @deprecated c4codata will auto detect connect operator in same fields
     * @param filter
     */
    or(filter?: string | ODataFilter): ODataFilter;
    /**
     * @deprecated c4codata will auto group exprs
     * @param filter
     */
    group(filter: ODataFilter): ODataFilter;
    toString(): string;
    protected _buildFieldExprString(field: string): string;
    build(): string;
}
export {};
