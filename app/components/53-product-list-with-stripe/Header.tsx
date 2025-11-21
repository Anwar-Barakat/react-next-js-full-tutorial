"use client";

import React, { useState } from 'react';
import useProductStore from './product.store';
import CartDrawer from './CartDrawer';

const Header: React.FC = () => {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart } = useProductStore();

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <>
            <header className="flex justify-between items-center p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-50">
                <h1 className="text-3xl font-bold heading-gradient">Our Products</h1>
                <button onClick={() => setIsCartOpen(true)} className="relative btn btn-sm btn-primary">
                    <span>Cart</span>
                    {cartCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-secondary text-white rounded-full px-1.5 py-0.5 text-xs">
                            {cartCount}
                        </span>
                    )}
                </button>
            </header>
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Header;
