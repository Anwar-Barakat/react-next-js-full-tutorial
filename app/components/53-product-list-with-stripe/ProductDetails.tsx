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
        <div className="flex flex-col h-full bg-card/50 border border-border rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4 flex flex-col flex-grow items-center text-center">
                <h2 className="text-xl font-bold h-14 text-foreground">{product.name}</h2>
                <p className="mt-2 flex-grow text-muted-foreground">{product.description.slice(0, 80)}{product.description.length > 80 ? '...' : ''}</p>
                <div className="mt-4">
                    <p className="text-lg font-semibold text-primary">
                        ${product.price}
                    </p>
                </div>
                <button
                    onClick={() => addToCart(product)}
                    className="btn bg-primary/50 text-foreground w-full mt-4"
                >
                    Add To Cart
                </button>
            </div>
        </div>
    )
}

export default ProductDetails;