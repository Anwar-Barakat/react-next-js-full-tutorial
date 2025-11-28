/* eslint-disable @typescript-eslint/no-unused-vars */
import { create } from "zustand";
import { type Product } from "./types";

interface MarketState {
    allProducts: Product[];
    filteredProducts: Product[];
    cart: Product[];
    cartCount: number;

    searchTitle: string;
    searchMinPrice: number | null;
    searchMaxPrice: number | null;
    searchCategory: string;
}

interface MarketAction {
    setProducts: (products: Product[]) => void;
    setSearchTitle: (title: string) => void;
    setSearchMinPrice: (minPrice: number | null) => void;
    setSearchMaxPrice: (maxPrice: number | null) => void;
    setSearchCategory: (category: string) => void;
    applyFilters: () => void;
    clearFilter: () => void;
    addToCart: (product: Product) => void;
    removeFromCart: (productTitle: string) => void;
}

const useMarketStore = create<MarketState & MarketAction>((set, get) => ({
    allProducts: [],
    filteredProducts: [],
    cart: [],
    cartCount: 0,
    searchTitle: "",
    searchMinPrice: null,
    searchMaxPrice: null,
    searchCategory: '',

    setProducts: (products: Product[]) => {
        set((state) => ({
            allProducts: products,
            filteredProducts: products,
        }))
    },
    setSearchTitle: (title: string) => {
        set((state) => ({
            searchTitle: title,
        }));
        get().applyFilters();
    },
    setSearchMinPrice: (minPrice: number | null) => {
        set((state) => ({
            searchMinPrice: minPrice
        }));
        get().applyFilters();
    },
    setSearchMaxPrice: (maxPrice: number | null) => {
        set((state) => ({
            searchMaxPrice: maxPrice
        }));
        get().applyFilters();
    },
    setSearchCategory: (category: string) => {
        set((state) => ({
            searchCategory: category,
        }));
        get().applyFilters();
    },

    applyFilters: () => {
        const state = get()
        let filtered = state.allProducts;

        if (state.searchTitle.trim()) {
            filtered = filtered.filter((product) => (
                product.title.toLowerCase().includes(state.searchTitle.toLowerCase())
            ))
        }

        if (state.searchCategory.trim() && state.searchCategory !== 'all') {
            filtered = filtered.filter((product) => (
                product.category.toLowerCase() === state.searchCategory.toLowerCase()
            ))
        }

        if (state.searchMinPrice !== null) {
            filtered = filtered.filter((product) => (
                +product.newPrice >= +state.searchMinPrice!
            ))
        }

        if (state.searchMaxPrice !== null) {
            filtered = filtered.filter((product) => (
                +product.newPrice <= +state.searchMaxPrice!
            ))
        }
        set({
            filteredProducts: filtered
        })
    },
    clearFilter: () => {
        set((state) => ({
            filteredProducts: get().allProducts,
            searchTitle: '',
            searchCategory: '',
            searchMaxPrice: null,
            searchMinPrice: null,
        }))
    },
    addToCart: (product: Product) => {
        set((state) => ({
            cart: [...state.cart, product],
            cartCount: state.cart.length + 1,
        }))
    },
    removeFromCart: (productTitle: string) => {
        set((state) => ({
            cart: state.cart.filter(item => item.title !== productTitle),
            cartCount: state.cart.length > 0 ? state.cart.length - 1 : 0,
        }))
    }
}))

export default useMarketStore