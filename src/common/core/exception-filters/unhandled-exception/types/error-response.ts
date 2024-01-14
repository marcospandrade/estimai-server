export interface ErrorResponse {
    requestId: string | number;
    path: string;
    message: string;
    validationErrors?: any;
    additionalErrorMessage?: string;
}
