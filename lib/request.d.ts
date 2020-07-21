import { BatchRequest, ParsedResponse } from './batch';
import { ODataFilter } from './filter';
import { ODataQueryParam } from './params';
import { Credential, PlainODataMultiResponse, PlainODataSingleResponse, ODataNewOptions, BatchRequestOptions, ODataReadIDRequest, ODataWriteRequest, ODataQueryRequest } from './types';
import { ODataVersion } from './types_v4';
import { EntitySet } from './entityset';
/**
 * OData Client
 */
export declare class OData {
    private metadataUri;
    /**
     * odata service path, like /sap/c4c/odata/v1/c4codata/
     */
    private odataEnd;
    /**
     * http basic credential
     */
    private credential;
    /**
     * internal csrf token
     */
    private csrfToken;
    /**
     * dont direct use this object
     */
    private commonHeader;
    private fetchProxy;
    private processCsrfToken;
    private forSAP;
    private variant;
    private version;
    /**
     * alternative constructor
     *
     * @param options config options
     */
    static New(options: ODataNewOptions): OData;
    /**
     * create odata client instance for odata v4
     *
     * @param options
     */
    static New4(options: ODataNewOptions): OData;
    /**
     * new odata query param
     */
    static newParam(): ODataQueryParam;
    /**
     * new filter
     */
    static newFilter(): ODataFilter;
    /**
     * OData
     *
     * @deprecated please use static method create instance
     * @private
     */
    private constructor();
    /**
     * generate dynamic header
     */
    private getHeaders;
    /**
     * getEntitySet
     *
     * @param entitySetName the name of entity set, you can get it from metadata
     *
     */
    getEntitySet<T>(entitySetName: string): EntitySet<T>;
    /**
     * Set OData Client Http Basic credential
     *
     * @param credential
     */
    setCredential(credential: Credential): void;
    /**
     * setODataEndPath
     *
     * e.g. https://tenant.c4c.saphybriscloud.cn/sap/c4c/odata/v1/c4codata/
     */
    setODataEndPath(odataEnd: string): void;
    getVersion(): ODataVersion;
    /**
     * fetch CSRF Token
     */
    private getCsrfToken;
    cleanCsrfToken(): void;
    /**
     * odata request uri
     *
     * @param uri HTTP URI
     * @param queryParams odata query params
     * @param method HTTP method
     * @param body request content
     */
    private requestUri;
    /**
     * odata request
     *
     * @param collection CollectionName
     * @param id entity uuid or compound key
     * @param queryParams query param, not work for single entity uri
     * @param method request method
     * @param entity C4C Entity instance
     */
    private request;
    /**
     * format id part of url
     *
     * @param id
     */
    private formatIdString;
    /**
     * new odata http request
     */
    newRequest<T>(options: ODataQueryRequest<T>): Promise<PlainODataMultiResponse<T>>;
    newRequest<T>(options: ODataWriteRequest<T>): Promise<PlainODataSingleResponse<T>>;
    newRequest<T>(options: ODataReadIDRequest<T>): Promise<PlainODataSingleResponse<T>>;
    /**
     * format batch request parameter
     */
    private formatBatchRequests;
    /**
     * execute batch requests and get response
     *
     * @param requests batch request
     */
    execBatchRequests(requests: Array<Promise<BatchRequest>>): Promise<Array<ParsedResponse<PlainODataMultiResponse>>>;
    newBatchRequest<T>(options: BatchRequestOptions<T>): Promise<BatchRequest>;
}
