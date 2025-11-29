import React from 'react'
import useMarketStore from './store'
import { AiFillDelete } from 'react-icons/ai'

const Sidebar = () => {
  const {
    searchMinPrice,
    searchMaxPrice,
    searchCategory,
    setSearchMinPrice,
    setSearchMaxPrice,
    setSearchCategory,
    clearFilter,
    cart,
    removeFromCart,
  } = useMarketStore()

  const categories = ["All", "sneakers", "flats", "sandals", "heels"];

  const cartTotal = cart.reduce((total, item) => total + +item.newPrice, 0)

  return (
    <aside className="w-80 bg-card p-4 border-r border-border flex flex-col">
      <div>
        <h2 className="text-lg font-semibold mb-4 heading-gradient">Filters</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-muted-foreground mb-1">Min Price</label>
            <input
              id="minPrice"
              type="number"
              value={searchMinPrice || ''}
              onChange={e => setSearchMinPrice(e.target.value ? +e.target.value : null)}
              className="input bg-card"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-muted-foreground mb-1">Max Price</label>
            <input
              id="maxPrice"
              type="number"
              value={searchMaxPrice || ''}
              onChange={e => setSearchMaxPrice(e.target.value ? +e.target.value : null)}
              className="input bg-card"
              placeholder="1000"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
            <select
              id="category"
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
              className="input bg-card"
            >
              {categories.map(category => (
                <option key={category} value={category.toLowerCase()}>{category}</option>
              ))}
            </select>
          </div>
          <button onClick={clearFilter} className="btn bg-secondary/50 w-full mt-4">Clear Filters</button>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-border flex-1 flex flex-col">
        <h2 className="text-lg font-semibold mb-4 heading-gradient">Cart</h2>
        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.title} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-muted-foreground">${item.newPrice}</p>
                  </div>
                  <button onClick={() => removeFromCart(item.title)} className="text-red-500 hover:text-red-700">
                    <AiFillDelete size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn bg-primary/50 w-full mt-4">Checkout</button>
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
