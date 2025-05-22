'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

type Item = {
  id: string;
  quantity: number;
  product: {
    name: string;
    price: number;
    image_url: string | null;
  };
};

export default function CarritoPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login'); // Redirección si no hay usuario
          return;
        }

        const { data, error } = await supabase
          .from('cart_items')
          .select('id, quantity, product:product_id(name, price, image_url)')
          .eq('user_id', user.id);

        if (error) throw error;

        // Estructura consistente con el tipo Item
        const transformedItems = data.map((item: any) => ({
          id: item.id,
          quantity: item.quantity,
          product: {
            name: item.product.name,
            price: item.product.price,
            image_url: item.product.image_url,
          },
        }));

        setItems(transformedItems);
      } catch (error) {
        console.error('Error cargando carrito:', error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [router]);

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Tu carrito</h1>
      {loading ? (
        <p className="text-gray-600">Cargando...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">Tu carrito está vacío.</p>
      ) : (
        <>
          <ul className="space-y-4">
            {items.map(item => (
              <li key={item.id} className="flex gap-4 items-center border p-4 rounded">
                <img
                  src={item.product.image_url || '/placeholder.jpg'}
                  className="w-20 h-20 object-cover rounded"
                  alt={item.product.name}
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{item.product.name}</h2>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  <p className="text-pink-500 font-bold">${item.product.price.toLocaleString()}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 text-right font-bold text-xl text-pink-600">
            Total: ${total.toLocaleString()}
          </div>
        </>
      )}
    </div>
  );
}
