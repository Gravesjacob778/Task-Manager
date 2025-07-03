export interface HttpActionResponse {
    success: boolean;
    message: string;
    data?: unknown | null;
}