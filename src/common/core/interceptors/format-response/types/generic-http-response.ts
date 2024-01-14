export interface GenericHttpResponse<T> {
    response: T | { records: T; count: number };
    message: string;
    validationErrors?: any;
}
