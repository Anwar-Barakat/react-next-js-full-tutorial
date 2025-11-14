import React from 'react'
import useMarketStore from './store'
import { AiOutlineShoppingCart } from 'react-icons/ai'

const Header = () => {
    const { searchTitle, setSearchTitle, cartCount } = useMarketStore()
    return (
        <header className="bg-card border-b border-border p-4 flex items-center justify-between">
            <div className="flex-1">
                <input
                    type="text"
                    value={searchTitle}
                    name='title'
                    onChange={(e) => setSearchTitle(e.target.value)}
                    className="input w-full md:w-1/2"
                    placeholder="Search for products..."
                />
            </div>
            <div className="relative">
                <AiOutlineShoppingCart className="w-8 h-8 text-gray-600" />
                {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        {cartCount}
                    </span>
                )}
            </div>
        </header>
    )
}

export default Header
