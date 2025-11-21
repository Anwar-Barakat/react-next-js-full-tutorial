import { create } from "zustand";
import { Product, CartItem } from "./types";
import { PaginationLinks, PaginationMeta } from "@/app/types";

interface ProductState {
    products: Product[];
    meta: PaginationMeta | null;
    links: PaginationLinks | null;
    isLoading: boolean;
    error: string | null;
    cart: CartItem[];
}

interface ProductActions {
    setProductsData: (data: Product[], meta: PaginationMeta, links: PaginationLinks) => void;
    setIsLoading: (isLoading: boolean) => void;
    setError: (error: string | null) => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
}

const useProductStore = create<ProductState & ProductActions>((set) => ({
    products: [],
    meta: null,
    links: null,
    isLoading: false,
    error: null,
    cart: [],

    setProductsData: (data, meta, links) =>
        set({
            products: data,
            meta,
            links,
            isLoading: false,
            error: null,
        }),

    setIsLoading: (isLoading) =>
        set({ isLoading }),

    setError: (error) =>
        set({ error }),

    addToCart: (product) =>
        set((state) => {
            const existingProduct = state.cart.find((item) => item.id === product.id);
            if (existingProduct) {
                return {
                    cart: state.cart.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                };
            }
            return { cart: [...state.cart, { ...product, quantity: 1 }] };
        }),

    removeFromCart: (productId) =>
        set((state) => ({
            cart: state.cart.filter((item) => item.id !== productId),
        })),

    updateQuantity: (productId, quantity) =>
        set((state) => ({
            cart: state.cart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            ),
        })),
}));

export default useProductStore;