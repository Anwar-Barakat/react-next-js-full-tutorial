"use client";

import React from 'react';
import useProductStore from './product.store';
import { CartItem } from './types';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
    const { cart, removeFromCart, updateQuantity } = useProductStore();

    const total = cart.reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0);

    return (
        <div className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg flex flex-col p-5 z-50 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out`}>
            <div className="flex justify-between items-center mb-5">
                <h2 className="text-2xl font-bold">Your Cart</h2>
                <button onClick={onClose} className="bg-transparent border-none text-2xl cursor-pointer">&times;</button>
            </div>

            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    {cart.map((item: CartItem) => (
                        <div key={item.id} className="flex items-center mb-4 pb-4 border-b border-gray-200">
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4 rounded-md" />
                            <div className="flex-1">
                                <h4 className="m-0 text-base">{item.name}</h4>
                                <p className="my-1 text-gray-700">${item.price}</p>
                                <div className="flex items-center">
                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="px-2 py-1 border rounded">-</button>
                                    <span className="mx-2">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 border rounded">+</button>
                                </div>
                            </div>
                            <button onClick={() => removeFromCart(item.id)} className="text-red-500 bg-transparent border-none cursor-pointer">Remove</button>
                        </div>
                    ))}
                </div>
            )}

            {cart.length > 0 && (
                <div className="mt-auto pt-5 border-t border-gray-200">
                    <h3 className="text-xl font-bold flex justify-between">
                        <span>Total:</span>
                        <span>${total.toFixed(2)}</span>
                    </h3>
                    <button className="w-full py-3 bg-blue-600 text-white border-none rounded text-lg font-semibold cursor-pointer mt-4 hover:bg-blue-700 transition-colors">
                        Checkout
                    </button>
                </div>
            )}
        </div>
    );
};

export default CartDrawer;
