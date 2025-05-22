'use client'
import Link from 'next/link'
import { FaUserCircle } from 'react-icons/fa'
import CartIcon from '@/components/CartIcon'


export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <Link href="/" className="text-2xl font-bold text-pink-600">
        ALEJA BEAUTY
      </Link>
      <a href="/wishlist" className="hover:text-pink-600">Favoritos</a>

      <div className="flex gap-6 items-center">
        <Link href="/tienda" className="text-gray-700 hover:text-pink-600">
          Tienda
        </Link>
        <Link href="/cuenta" className="text-gray-700 hover:text-pink-600">
          <FaUserCircle size={20} />
        </Link>
        <CartIcon />
      </div>
    </nav>
  )
}