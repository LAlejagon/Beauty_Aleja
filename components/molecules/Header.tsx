'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import {
  FiShoppingCart,
  FiHeart,
  FiUser,
  FiLogOut,
  FiSearch,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { useCartContext } from '@/context/CartContext';

type SessionUser = {
  id: string;
  email: string;
  role: string;
};

export default function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const { cartCount } = useCartContext();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        setUser({
          id: user.id,
          email: user.email ?? '',
          role: profile?.role ?? 'customer'
        });
      } else {
        setUser(null);
      }
    };

    fetchSession();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/login');
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-6">
        {/* Desktop Header */}
        <div className="hidden md:flex items-center justify-between py-5">
          <Link
            href="/"
            className="text-3xl font-serif font-light text-pink-600 hover:text-pink-700 transition-colors tracking-tight"
          >
            ALEJA BEAUTY
          </Link>

          <div className="relative mx-8 flex-grow max-w-xl">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-gray-50/70 border border-gray-200 rounded-full py-3 px-5 pl-12 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all"
            />
            <FiSearch className="absolute left-5 top-3.5 text-gray-400 text-xl" />
          </div>

          <nav className="flex items-center space-x-6">
            <Link
              href="/tienda"
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium text-lg"
            >
              Tienda
            </Link>
            <Link
              href="/wishlist"
              className="text-gray-700 hover:text-pink-600 transition-colors font-medium text-lg flex items-center"
            >
              <FiHeart className="mr-1.5" /> Favoritos
            </Link>
            <Link
              href="/checkout"
              className="relative text-gray-700 hover:text-pink-600 transition-colors font-medium text-lg flex items-center"
            >
              <FiShoppingCart className="mr-1.5" />
              Carrito
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </nav>

          <div className="flex items-center space-x-4 pl-6">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="hidden lg:inline text-sm text-gray-600 font-medium">
                  Hola, {user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-pink-600 transition-colors group"
                  title="Cerrar sesión"
                >
                  <FiLogOut className="text-xl group-hover:rotate-12 transition-transform" />
                  <span className="ml-1.5 hidden lg:inline">Salir</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-pink-600 transition-colors flex items-center text-lg"
                >
                  <FiUser className="mr-1.5" /> Iniciar sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full text-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between py-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-gray-700 p-2"
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>

          <Link
            href="/"
            className="text-2xl font-serif font-light text-pink-600"
          >
            ALEJA BEAUTY
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="text-gray-700 p-2"
            >
              <FiSearch size={20} />
            </button>
            <Link href="/checkout" className="relative text-gray-700 p-2">
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full px-1.5 font-bold">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-4 px-2">
            <input
              type="text"
              placeholder="Buscar productos..."
              className="w-full bg-gray-50 border border-gray-200 rounded-full py-2 px-4 pl-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>
        )}

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white py-4 px-6 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/tienda"
                className="text-gray-700 hover:text-pink-600 py-2"
              >
                Tienda
              </Link>
              <Link
                href="/wishlist"
                className="text-gray-700 hover:text-pink-600 py-2 flex items-center"
              >
                <FiHeart className="mr-2" /> Favoritos
              </Link>
              {user ? (
                <>
                  <div className="text-gray-600 py-2">
                    Hola, {user.email.split('@')[0]}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-pink-600 py-2 flex items-center w-full"
                  >
                    <FiLogOut className="mr-2" /> Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-pink-600 py-2 flex items-center"
                  >
                    <FiUser className="mr-2" /> Iniciar sesión
                  </Link>
                  <Link
                    href="/register"
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-center"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
