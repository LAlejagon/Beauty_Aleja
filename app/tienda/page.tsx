'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

type Product = {
  id: string;
  name: string;
  price: number;
  image_url: string | null;
  stock: number;
};

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, stock')
        .eq('status', 'active');

      if (error) {
        console.error('Error al cargar productos:', error.message);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
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

    const { error } = await supabase
      .from('cart_items')
      .upsert(
        {
          user_id: user.id,
          product_id: productId,
          quantity: 1,
        },
        { onConflict: 'user_id,product_id' } // ✅ string, no array
      );

    if (error) {
      console.error('Error al agregar al carrito:', error.message);
    } else {
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

  if (loading) return <p className="tienda-loading">Cargando productos...</p>;

  return (
    <div className="tienda">
      <h1 className="tienda-title">Catálogo de Productos</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={product.image_url || 'https://via.placeholder.com/250'}
              alt={product.name}
            />
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price.toLocaleString()}</p>
              <div className="button-group">
                <button onClick={() => handleAddToCart(product.id)}>
                  Agregar al carrito
                </button>
                <button className="wishlist" onClick={() => handleAddToWishlist(product.id)}>
                  ❤️ Favorito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
