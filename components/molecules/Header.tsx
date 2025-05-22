'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiHeart, FiUser, FiLogOut } from 'react-icons/fi';

type SessionUser = {
  id: string;
  email: string;
  role: string;
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      const {
        data: { user },
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
          role: profile?.role ?? 'customer',
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
    <div className="min-h-screen flex flex-col">
      {/* Header moderno */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="text-2xl font-serif font-light text-pink-600 hover:text-pink-700 transition-colors">
              ALEJA BEAUTY
            </Link>

            {/* Navegación principal */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/tienda" className="text-gray-700 hover:text-pink-600 transition-colors font-medium">
                Tienda
              </Link>
              <Link href="/wishlist" className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center">
                <FiHeart className="mr-1" /> Favoritos
              </Link>
              <Link href="/checkout" className="text-gray-700 hover:text-pink-600 transition-colors font-medium flex items-center">
                <FiShoppingCart className="mr-1" /> Carrito
              </Link>
            </nav>

            {/* Autenticación */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="hidden sm:inline text-sm text-gray-600">
                    Hola, {user.email.split('@')[0]}
                  </span>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-pink-600 transition-colors"
                    title="Cerrar sesión"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="ml-1 hidden sm:inline">Salir</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-pink-600 transition-colors flex items-center">
                    <FiUser className="mr-1" /> Iniciar sesión
                  </Link>
                  <Link 
                    href="/register" 
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow">
        {children}
      </main>

    </div>
  );
}