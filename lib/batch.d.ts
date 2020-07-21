/**
 * parsed mock batch response
 */
export interface ParsedResponse<T> {
    text: () => Promise<string>;
    json: () => Promise<T>;
    status: number;
    headers: {
        [key: string]: string;
    };
    statusText: string;
}
/**
 * batch request
 */
export interface BatchRequest {
    /**
     * for odata batch request, please give a relative path from odata endpoint
     */
    url: string;
    init?: RequestInit;
}
export declare const formatHttpRequestString: (u: string, r: any) => string;
/**
 * format batch request string body
 *
 * @param requests
 * @param boundary a given boundary id
 */
export declare const formatBatchRequest: (requests: BatchRequest[], boundary: string) => string;
/**
 * parse stringify response in multipart
 */
export declare const parseResponse2: (httpResponseString: string) => Promise<ParsedResponse<any>>;
export declare const parseMultiPartContent: (multipartBody: string, boundaryId: string) => Promise<ParsedResponse<any>[]>;
