'use client'
import { useCart } from '@/context/CartContext'

export default function ProductCard({ product }: {
  product: {
    id: number
    name: string
    price: number
    description?: string
    image_url?: string
    stock?: number
  }
}) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            Sin imagen
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="font-semibold text-lg">{product.name}</h2>
        <p className="text-pink-600 font-bold">${product.price.toLocaleString('es-CO')}</p>
        
        <button
          onClick={() => addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image_url: product.image_url
          })}
          className="w-full mt-4 bg-pink-600 text-white py-2 rounded hover:bg-pink-700"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}