import { PreProcessor, BoundedRequest } from './processor';
export interface UserCredential {
    username: string;
    password?: string;
}
export declare class BaiscAuthProcessor implements PreProcessor {
    constructor(credential: UserCredential);
    private _credential;
    pre(request: BoundedRequest): Promise<BoundedRequest>;
}
