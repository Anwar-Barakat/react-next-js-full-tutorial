"use client";

import React, { FC } from 'react'
import { Product } from './types'
import useProductStore from './product.store';

interface ProductDetailsProps {
    product: Product;
}

const ProductDetails: FC<ProductDetailsProps> = ({ product }) => {
    const { addToCart } = useProductStore();

    return (
        <div className="flex flex-col h-full bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 flex flex-col flex-grow items-center text-center">
                <h2 className="text-xl font-bold h-14 text-gray-900 dark:text-gray-100">{product.name}</h2>
                <p className="mt-2 flex-grow text-gray-600 dark:text-gray-300">{product.description.slice(0, 80)}{product.description.length > 80 ? '...' : ''}</p>
                <div className="mt-4">
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                        ${product.price}
                    </p>
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="w-full mt-4 px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                    Add To Cart
                </button>
            </div>
        </div>
    )
}

export default ProductDetails;