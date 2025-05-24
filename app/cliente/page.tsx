'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiBox, FiCreditCard, FiCalendar, FiShoppingBag, FiTruck } from 'react-icons/fi';

export default function ClientePage() {
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    const fetchLastOrder = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('orders')
        .select(`
          id, total, created_at, status,
          items ( quantity, products ( name, price, image_url ) )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!error) setPedido(data);
    };

    fetchLastOrder();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-rose-50">
      <Header />

      <main className="flex-grow container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center text-pink-700 mb-10">Historial de Compra</h1>

        {pedido ? (
          <div className="bg-white rounded-xl shadow p-6 max-w-3xl mx-auto">
            <div className="mb-6 border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-2">
                <FiShoppingBag className="text-pink-500" /> Resumen del último pedido
              </h2>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FiCalendar /> Fecha: {new Date(pedido.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FiCreditCard /> Total pagado: <span className="font-bold text-pink-600 ml-1">${pedido.total.toLocaleString()}</span>
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FiBox /> Número de orden: #{pedido.id}
              </p>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <FiTruck /> Estado: <span className="font-semibold ml-1">{pedido.status || 'Procesando'}</span>
              </p>
            </div>

            <div className="grid gap-4">
              {pedido.items?.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <img
                    src={item.products.image_url || 'https://via.placeholder.com/80'}
                    alt={item.products.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.products.name}</h3>
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                    <p className="text-sm text-pink-600 font-semibold">
                      Precio: ${item.products.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center mt-20 text-gray-600">
            <p>No hay pedidos recientes disponibles.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
