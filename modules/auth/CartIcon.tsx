'use client'
import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { FaShoppingCart, FaTimes } from 'react-icons/fa'

export default function CartIcon() {
  const { cart, cartCount } = useCart()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-gray-700 hover:text-pink-600"
      >
        <FaShoppingCart size={20} />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-pink-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-bold">Tu Carrito ({cartCount})</h2>
              <button onClick={() => setIsOpen(false)}>
                <FaTimes size={20} />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="p-6 text-center">Tu carrito está vacío</div>
            ) : (
              <div>
                {cart.map(item => (
                  <div key={item.id} className="p-4 border-b flex justify-between">
                    <div>
                      <h3>{item.name}</h3>
                      <p>${item.price} x {item.quantity}</p>
                    </div>
                    <p>${(item.price * item.quantity).toLocaleString('es-CO')}</p>
                  </div>
                ))}
                <div className="p-4">
                  <button className="w-full bg-pink-600 text-white py-2 rounded">
                    Pagar ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toLocaleString('es-CO')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}