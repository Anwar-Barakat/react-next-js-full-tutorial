import { AiFillStar } from 'react-icons/ai'
import useMarketStore from './store'
import { Product } from './types'

const MainContent = () => {
    const { filteredProducts, addToCart } = useMarketStore()

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {
                filteredProducts.map((product: Product, index: number) => (
                    <div key={`${product.title}-${index}`} className="glass">
                        <img src={product.img} alt={product.title} className='w-full h-48 object-cover rounded-t-lg' />
                        <div className="p-4">
                            <h2 className="text-lg font-semibold text-foreground">{product.title}</h2>
                            <div className="flex items-center my-2">
                                {Array.from({ length: product.star }).map((_, i) => <AiFillStar key={i} className="text-yellow-500" />)}
                            </div>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    {product.prevPrice && +product.prevPrice > 0 && (
                                        <span className='line-through text-muted-foreground mr-2'>${product.prevPrice}</span>
                                    )}
                                    <span className='font-bold text-lg text-foreground'>${product.newPrice}</span>
                                </div>
                                <div style={{ background: product.color }} className='w-6 h-6 rounded-full border border-border'></div>
                            </div>
                            <button onClick={() => addToCart(product)} className="btn bg-primary/50 w-full mt-4">Add to Cart</button>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default MainContent
