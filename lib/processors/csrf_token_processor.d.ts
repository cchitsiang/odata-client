import { PostProcessor, BoundedRequest, PreProcessor } from './processor';
export declare class InvalidCSRFTokenError extends Error {
    constructor(msg: string);
}
export declare class CSRFProcessor implements PreProcessor, PostProcessor {
    private __CSRFToken;
    pre(request: BoundedRequest): Promise<BoundedRequest>;
    post(request: BoundedRequest, response: Response): Promise<Response>;
}
