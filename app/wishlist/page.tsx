'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiShoppingCart } from 'react-icons/fi';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function FavoritosPage() {
  const [favoritos, setFavoritos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarFavoritos = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('wishlist_items')
        .select('id, product:products(id, name, price, image_url)')
        .eq('user_id', user.id);

      if (!error && data) setFavoritos(data);
      setIsLoading(false);
    };

    cargarFavoritos();
  }, []);

  return (
    <>
      <Header />

      <div className="min-h-screen bg-rose-50 px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-extrabold text-pink-600 mb-10 text-center">
            <FaHeart className="inline text-pink-600 mr-2" /> Mis Favoritos
          </h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center mt-32">
              <FaHeart className="animate-bounce text-red-600 text-6xl mb-6" />
              <p className="text-pink-700 font-medium">Cargando tus favoritos...</p>
            </div>
          ) : favoritos.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
              <FaRegHeart className="text-5xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-700">No tienes favoritos aún</h2>
              <p className="text-gray-500 mt-2">Explora productos y agrégalos a tu lista de deseos</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {favoritos.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
                  {item.product?.image_url && (
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      className="w-full h-56 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-gray-800 truncate mb-2">
                      {item.product.name}
                    </h2>
                    <p className="text-pink-600 font-semibold text-base mb-4">
                      ${item.product.price?.toFixed(2)}
                    </p>
                    <button className="flex items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white text-sm font-medium px-4 py-2 rounded transition w-full justify-center">
                      <FiShoppingCart /> Agregar al carrito
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
