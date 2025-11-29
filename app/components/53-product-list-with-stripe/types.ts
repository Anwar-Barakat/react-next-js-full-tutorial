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
    gallery: GalleryItem[]
}

export interface GalleryItem {
    url: string;
    thumb_url: string;
}

export interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
    media: Media;
    category: Category;
    tags?: Tag[];
    created_at: string;
    updated_at: string;
}

export interface Tag {
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