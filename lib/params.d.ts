import { ODataFilter } from './filter';
import { ODataVersion } from './types_v4';
export interface ODataParamOrderField {
    /**
     * field name
     */
    field: string;
    /**
     * order asc or desc
     */
    order?: 'asc' | 'desc';
}
/**
 * OData Param Object
 *
 * ref https://github.com/SAP/C4CODATAAPIDEVGUIDE
 */
export declare class ODataQueryParam {
    static newParam(): ODataQueryParam;
    private $skip;
    private $filter;
    private $top;
    private $select;
    private $orderby;
    private $format;
    private $search;
    private $inlinecount;
    private $expand;
    private $count;
    /**
     * with $inlinecount value
     *
     * @version 2.0.0
     */
    inlinecount(inlinecount?: boolean): ODataQueryParam;
    /**
     *
     * count items in odata v4
     *
     * @param count
     *
     * @version 4.0.0
     */
    count(count?: boolean): ODataQueryParam;
    /**
     * apply filter for query
     *
     * @param filter
     */
    filter(filter?: string | ODataFilter): this;
    /**
     * skip first records
     *
     * @param skip
     */
    skip(skip: number): this;
    /**
     * limit result max records
     *
     * @param top
     */
    top(top: number): this;
    /**
     * select viewed fields
     *
     * @param selects
     */
    select(selects: string | string[]): this;
    /**
     * set order sequence
     *
     * @param fieldOrOrders
     * @param order default desc, disabled when first params is array
     */
    orderby(fieldOrOrders: string | ODataParamOrderField[], order?: 'asc' | 'desc'): this;
    /**
     * set order by multi field
     *
     * @param fields
     */
    orderbyMulti(fields?: ODataParamOrderField[]): this;
    /**
     * result format, please keep it as json
     *
     * @param format deafult json
     */
    format(format: 'json' | 'xml'): this;
    /**
     * full text search
     *
     * default with fuzzy search, SAP system or OData V4 only
     *
     * @param value
     * @version 4.0.0
     */
    search(value: string, fuzzy?: boolean): this;
    /**
     * expand navigation props
     *
     * @param fields
     * @param replace
     */
    expand(fields: string | string[], replace?: boolean): this;
    toString(version?: ODataVersion): string;
}
export declare const ODataParam: typeof ODataQueryParam;
