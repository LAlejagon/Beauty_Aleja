'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

type CartItem = {
  id: string;
  quantity: number;
  product_id: string;
  product: {
    name: string;
    price: number;
  };
};

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [form, setForm] = useState({
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_postal_code: '',
    payment_method: 'card',
    notes: '',
  });

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0
  );

  useEffect(() => {
    const loadCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert('Debes iniciar sesión para finalizar tu compra');
        router.push('/login');
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from('cart_items')
        .select('id, quantity, product_id, product:product_id(name, price)')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error al cargar carrito', error);
      } else {
        const transformedItems = data.map(item => ({
          ...item,
          product: item.product?.[0] || { name: 'Producto desconocido', price: 0 }
        }));
        setItems(transformedItems as CartItem[]);
      }

      setLoading(false);
    };

    loadCart();
  }, [router]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.shipping_address || !form.shipping_city || !form.shipping_state) {
      alert('Por favor completa todos los campos de envío');
      return;
    }

    const { error: orderError, data: orderData } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId,
          total_amount: total,
          status: 'processing',
          shipping_address: form.shipping_address,
          shipping_city: form.shipping_city,
          shipping_state: form.shipping_state,
          shipping_postal_code: form.shipping_postal_code,
          payment_method: form.payment_method,
          payment_status: 'pending',
          notes: form.notes,
        },
      ])
      .select()
      .single();

    if (orderError || !orderData) {
      console.error('Error creando pedido:', orderError);
      alert('No se pudo completar la compra');
      return;
    }

    const itemsToInsert = items.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error agregando productos al pedido:', itemsError);
      alert('Error interno al procesar productos');
      return;
    }

    await supabase.from('cart_items').delete().eq('user_id', userId!);

    alert('Compra realizada con éxito 🎉');
    router.push('/cliente');
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-serif font-bold text-rose-800 mb-2">Finalizar compra</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-rose-600 to-pink-500 mx-auto"></div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tu carrito está vacío.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Resumen de productos */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Resumen de tu pedido</h2>
            
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-gray-800">{item.product.name}</p>
                    <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-rose-700">
                    ${(item.product.price * item.quantity).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total:</span>
                <span className="text-xl font-bold text-rose-800">
                  ${total.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Formulario de envío */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">Información de envío</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input
                  type="text"
                  name="shipping_address"
                  onChange={handleInput}
                  placeholder="Calle y número"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input
                    type="text"
                    name="shipping_city"
                    onChange={handleInput}
                    placeholder="Tu ciudad"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Departamento</label>
                  <input
                    type="text"
                    name="shipping_state"
                    onChange={handleInput}
                    placeholder="Tu departamento"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Código postal</label>
                <input
                  type="text"
                  name="shipping_postal_code"
                  onChange={handleInput}
                  placeholder="Tu código postal"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notas adicionales (opcional)</label>
                <textarea
                  name="notes"
                  onChange={handleInput}
                  placeholder="Instrucciones especiales para la entrega"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition"
                />
              </div>
            </div>
            
            <button
              onClick={handleCheckout}
              className="mt-6 w-full bg-gradient-to-r from-rose-700 to-pink-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-rose-800 hover:to-pink-700 transition-all shadow-lg"
            >
              Confirmar compra
            </button>
          </div>
        </div>
      )}
    </div>
  );
}