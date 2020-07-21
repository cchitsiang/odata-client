import { ODataQueryParam } from './params';
import { OData } from './request';
import { ODataFilter } from './filter';
export declare class EntitySet<T> {
    private _collection;
    private _client;
    constructor(collection: string, client: OData);
    private _checkError;
    private _getResult;
    retrieve(id: any): Promise<T>;
    find(base: Partial<T>): Promise<T[]>;
    query(param?: ODataFilter): Promise<T[]>;
    query(param?: ODataQueryParam): Promise<T[]>;
    count(filter?: ODataFilter): Promise<number>;
    create(body: Partial<T>): Promise<T>;
    update(id: any, body: Partial<T>): Promise<T>;
    delete(id: any): Promise<void>;
}
