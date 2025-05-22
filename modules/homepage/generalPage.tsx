'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import { FiShoppingCart, FiUser, FiHeart, FiStar } from 'react-icons/fi';
import Image from 'next/image';
//import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';

export default function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    const loadProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('id, name, price, stock, image_url, category, rating');
      if (data) setProducts(data);
    };

    loadSession();
    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
    //Header lo modificas
      {/* Hero Banner (reemplazando el carrusel) */}
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="relative h-full w-full">
          <Image
            src="/hero-banner.jpg" // Reemplaza con tu imagen estática
            alt="Banner principal"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          
          {/* Overlay de texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/60 to-pink-800/60 flex items-center">
            <div className="container mx-auto px-8 text-white max-w-4xl">
              <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 leading-tight">
                Descubre tu belleza natural
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl">
                Productos de alta calidad para cuidar de ti
              </p>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-10 py-4 rounded-full font-medium tracking-wider transition-all duration-300 hover:scale-105">
                Explorar colección
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Productos */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-serif font-light text-purple-900 mb-6">
            Nuestra Colección
          </h1>
          <p className="text-lg text-purple-700 max-w-2xl mx-auto">
            Productos cuidadosamente seleccionados para realzar tu belleza natural
          </p>
          <div className="w-32 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group relative"
            >
              <div className="relative h-80 overflow-hidden">
                {product.image_url ? (
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-400">Imagen no disponible</span>
                  </div>
                )}
                <button className="absolute top-5 right-5 bg-white/80 hover:bg-white p-3 rounded-full text-pink-600 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110">
                  <FiHeart size={20} />
                </button>
                {product.stock <= 0 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-white text-purple-900 px-4 py-2 rounded-full font-medium text-sm tracking-wider">AGOTADO</span>
                  </div>
                )}
                {product.rating && (
                  <div className="absolute bottom-4 left-4 bg-white/90 text-amber-500 px-3 py-1 rounded-full flex items-center text-sm font-medium">
                    <FiStar className="mr-1 fill-current" />
                    {product.rating}
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-medium text-purple-600 uppercase tracking-wider">{product.category}</span>
                  <span className="text-lg font-bold text-pink-600">${product.price}</span>
                </div>
                
                <h3 className="text-xl font-medium text-gray-900 mb-4">{product.name}</h3>
                
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
                  <button 
                    className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${product.stock > 0 ? 
                      'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg' : 
                      'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                    disabled={product.stock <= 0}
                  >
                    <FiShoppingCart className="inline mr-2" />
                    {product.stock > 0 ? 'Añadir' : 'Agotado'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-purple-900 to-pink-800 py-20 mt-20">
        <div className="container mx-auto px-6 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-light mb-6">Únete a nuestra comunidad</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-10">
            Recibe ofertas exclusivas y consejos de belleza directamente en tu inbox
          </p>
          <div className="flex flex-col sm:flex-row justify-center max-w-md mx-auto gap-4">
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="px-6 py-4 rounded-full bg-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-pink-300 flex-grow"
            />
            <button className="bg-white text-purple-900 hover:bg-gray-100 px-8 py-4 rounded-full font-medium tracking-wider transition-colors duration-300">
              Suscribirse
            </button>
          </div>
        </div>
      </div>

      {session && (
        <div className="fixed bottom-8 right-8 z-50">
          <Link href="/admin">
            <button className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center transition-all duration-300 hover:scale-105">
              <FiUser className="mr-2" /> Panel Admin
            </button>
          </Link>
        </div>
      )}
      
      <Footer />
    </div>
  );
}