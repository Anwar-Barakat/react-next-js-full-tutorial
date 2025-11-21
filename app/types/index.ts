export interface PaginationMeta {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
}

export interface PaginationLinks {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
}

export interface PaginationData<T> {
    data: T[];
    meta: PaginationMeta;
    links: PaginationLinks;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: PaginationData<T>;
}