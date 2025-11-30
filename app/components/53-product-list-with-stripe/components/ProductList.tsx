"use client";

import React, { useEffect } from "react";
import useProductStore from '../product.store';
import ProductDetails from '../ProductDetails';
import { useProducts } from '../useProducts';
import Header from '../Header';

const ProductList = () => {
    const { products, setProductsData } = useProductStore();

    const { data, isLoading, isError } = useProducts({});

    useEffect(() => {
        if (data?.data) {
            setProductsData(data.data.data, data.data.meta, data.data.links);
        }
    }, [data, setProductsData]);

    const hasProducts = products && products.length > 0;

    return (
        <div className="glass mx-auto my-8 max-w-7xl min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto p-6">
                {isLoading ? (
                    <div className="center-content p-10">
                        <div className="alert alert-info">Loading products...</div>
                    </div>
                ) : isError ? (
                    <div className="center-content p-10">
                        <div className="alert alert-danger">Error loading products.</div>
                    </div>
                ) : !hasProducts ? (
                    <div className="center-content p-10">
                        <div className="alert alert-warning">There are no products yet.</div>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
                            {products.map((product) => (
                                <ProductDetails key={product.id} product={product} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductList;