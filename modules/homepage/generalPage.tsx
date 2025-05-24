'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import HeroCarrusel from '@/components/organisms/HeroCarrusel';
import { FiHeart, FiShoppingCart, FiUser, FiStar } from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  rating?: number;
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        setSession(sessionData.session);

        const { data: productData, error } = await supabase
          .from('products')
          .select('id, name, price, stock, image_url, category, rating');

        if (error) throw error;
        setProducts(productData || []);
      } catch (error) {
        console.error('Error al cargar productos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />

      {/* Carrusel Hero */}
      <HeroCarrusel />

      {/* Productos destacados */}
      <div className="container mx-auto px-6 py-24">
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif font-light text-indigo-900 mb-6">
            Nuestra Colección
          </h1>
          <p className="text-xl text-indigo-700/90 max-w-3xl mx-auto">
            Ingredientes limpios y éticos para resultados naturales
          </p>
          <div className="w-40 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-8 rounded-full"></div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 text-lg">Cargando productos...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group relative border border-white/20"
              >
                <div className="relative h-96 overflow-hidden">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100/50 flex items-center justify-center">
                      <span className="text-gray-400">Imagen no disponible</span>
                    </div>
                  )}

                  <button className="absolute top-6 right-6 bg-white/90 hover:bg-white p-3.5 rounded-full text-blue-600 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 hover:text-blue-700">
                    <FiHeart size={22} />
                  </button>

                  {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-indigo-900 px-5 py-2.5 rounded-full font-medium text-sm">
                        AGOTADO
                      </span>
                    </div>
                  )}

                  {product.rating && (
                    <div className="absolute bottom-5 left-5 bg-white/95 text-amber-500 px-3.5 py-1.5 rounded-full flex items-center text-sm font-medium shadow-md">
                      <FiStar className="mr-1.5" size={16} />
                      {product.rating}
                    </div>
                  )}
                </div>

                <div className="p-7">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {product.category || 'Sin categoría'}
                    </span>
                    <span className="text-xl font-bold text-indigo-600">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>

                  <h3 className="text-2xl font-medium text-gray-900 mb-5">
                    {product.name}
                  </h3>

                  <div className="flex justify-between items-center">
                    <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
                    </span>

                    <button
                      className={`px-6 py-3 rounded-full text-sm font-medium ${
                        product.stock > 0
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg hover:scale-105'
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={product.stock <= 0}
                    >
                      <FiShoppingCart className="inline mr-2" size={18} />
                      {product.stock > 0 ? 'Añadir' : 'Agotado'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA de newsletter */}
      <div className="bg-gradient-to-r from-indigo-900 to-blue-800 py-24 mt-24">
        <div className="container mx-auto text-white text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-light mb-6">Únete a nuestra comunidad</h2>
          <p className="text-xl opacity-90 max-w-3xl mx-auto mb-12">
            Descubre los secretos de una belleza consciente con nuestro newsletter
          </p>
          <div className="flex flex-col sm:flex-row justify-center max-w-xl mx-auto gap-4">
            <input
              type="email"
              placeholder="Tu correo electrónico"
              className="px-7 py-5 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none flex-grow text-lg"
            />
            <button className="bg-white text-indigo-900 hover:bg-gray-100 px-10 py-5 rounded-full font-medium text-lg shadow-lg">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      {session && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link href="/admin">
            <button className="bg-indigo-700 hover:bg-indigo-800 text-white px-7 py-3.5 rounded-full shadow-xl flex items-center transition-all duration-300 hover:scale-105 group">
              <FiUser className="mr-2 group-hover:rotate-12 transition-transform" size={18} />
              <span>Panel Admin</span>
            </button>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}
