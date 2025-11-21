export interface CartItem extends Product {
    quantity: number;
}

export interface Category {
    id: number;
    name: string;
    description: string;
}

export interface Media {
    image: {
        url: string;
        thumb_url: string;
    },
    gallery: any[]
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string; // Price is a string from the backend
    image: string;
    media: Media;
    category: Category;
    tags?: Tag[]; // Added tags to product interface as it's included by the backend
    created_at: string;
    updated_at: string;
}

export interface Tag { // Added Tag interface
    id: number;
    name: string;
}

export interface ProductFilters {
    page: number;
    name?: string;
    minPrice?: number;
    maxPrice?: number;
    sort: string;
    per_page?: number;
}