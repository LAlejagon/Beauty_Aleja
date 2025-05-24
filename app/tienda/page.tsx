'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { FiShoppingCart, FiHeart } from 'react-icons/fi';
import Image from 'next/image';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { useCartContext } from '@/context/CartContext';
import Link from 'next/link';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
  categories: {
    name: string;
  }[];
};

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { refreshCart } = useCartContext();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, stock, image_url, categories(name)')
          .eq('status', 'active');

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAuthCheck = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  };

  const handleAddToCart = async (productId: string) => {
    const user = await handleAuthCheck();
    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase.from('cart_items').upsert(
      {
        user_id: user.id,
        product_id: productId,
        quantity: 1,
      },
      { onConflict: 'user_id,product_id' }
    );

    if (error) {
      console.error('Error al agregar al carrito:', error.message);
    } else {
      refreshCart();
      alert('Producto agregado al carrito');
    }
  };

  const handleAddToWishlist = async (productId: string) => {
    const user = await handleAuthCheck();
    if (!user) {
      router.push('/login');
      return;
    }

    const { error } = await supabase
      .from('wishlist_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
        },
        { onConflict: 'user_id,product_id' }
      );

    if (error) {
      console.error('Error al agregar a favoritos:', error.message);
    } else {
      alert('Producto agregado a favoritos');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50 text-gray-800">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-pink-700">Catálogo de Productos</h1>

        {loading ? (
          <div className="flex justify-center mt-20">
            <FiHeart className="animate-bounce text-pink-500 text-4xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 w-full">
                  <Image
                    src={product.image_url || 'https://via.placeholder.com/300x300'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-5 flex flex-col justify-between gap-3">
                  <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                  <p className="text-pink-600 font-bold text-lg">${product.price.toLocaleString()}</p>

                  <div className="flex justify-between items-center gap-2 mt-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex items-center gap-1 bg-pink-600 hover:bg-pink-700 text-white text-sm px-4 py-2 rounded-full transition"
                    >
                      <FiShoppingCart /> Añadir
                    </button>
                    <button
                      onClick={() => handleAddToWishlist(product.id)}
                      className="text-pink-500 hover:text-pink-700 text-xl transition"
                      title="Agregar a favoritos"
                    >
                      <FiHeart />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Sección CTA hacia tutoriales */}
        <div className="mt-20 text-center bg-white p-12 rounded-3xl shadow-md">
          <h2 className="text-3xl font-semibold text-rose-800 mb-4">¿Necesitas ayuda para usar los productos?</h2>
          <p className="text-gray-600 mb-6">
            Descubre tips, trucos y guías paso a paso para sacar el máximo provecho a tu belleza.
          </p>
          <Link
            href="/tutoriales"
            className="inline-block bg-rose-600 hover:bg-rose-700 text-white font-medium px-8 py-4 rounded-full transition"
          >
            Ver tutoriales
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
