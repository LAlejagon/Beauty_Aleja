'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import { FaTrash } from 'react-icons/fa';
import '@/styles/wishlist.css';

type WishItem = {
  id: string;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchWishlist = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('wishlist_items')
        .select(`
          id,
          product:product_id (
            name,
            price,
            image_url
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error al cargar favoritos:', error);
      } else {
        setItems(data as unknown as WishItem[]);
      }

      setLoading(false);
    };

    fetchWishlist();
  }, [router]);

  const removeFromWishlist = async (id: string) => {
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  if (loading) return <p className="wishlist-loading">Cargando favoritos...</p>;

  return (
    <div className="wishlist">
      <h1 className="wishlist-title">Tus Favoritos ❤️</h1>

      {items.length === 0 ? (
        <p className="wishlist-empty">No tienes productos en tu lista de deseos.</p>
      ) : (
        <div className="wishlist-grid">
          {items.map(item => (
            <div key={item.id} className="wishlist-card">
              <img
                src={item.product.image_url || 'https://via.placeholder.com/250'}
                alt={item.product.name}
                className="wishlist-img"
              />
              <div className="wishlist-info">
                <h2>{item.product.name}</h2>
                <p>${item.product.price.toLocaleString()}</p>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="wishlist-remove"
                >
                  <FaTrash /> Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
