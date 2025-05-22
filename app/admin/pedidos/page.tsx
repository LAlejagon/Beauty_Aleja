'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

type Pedido = {
  id: string;
  created_at: string;
  total_amount: number;
  status: string;
  user: {
    email: string;
  };
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user?.id)
          .single();

        if (profile?.role !== 'admin') {
          alert('Acceso denegado');
          window.location.href = '/';
          return;
        }

        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total_amount,
            status,
            user: user_id ( email ),
            items: order_items (
              product_id,
              product_name,
              quantity,
              price
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transformar los datos para que coincidan con el tipo Pedido
        const pedidosTransformados = data.map(pedido => ({
          ...pedido,
          user: {
            email: pedido.user?.[0]?.email || 'desconocido'
          },
          items: pedido.items || []
        }));

        setPedidos(pedidosTransformados);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      } finally {
        setLoading(false);
      }
    };

    cargarPedidos();
  }, []);

  const handleEstadoChange = async (pedidoId: string, newEstado: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newEstado })
        .eq('id', pedidoId);

      if (error) {
        throw error;
      }

      setPedidos(prev =>
        prev.map(p => (p.id === pedidoId ? { ...p, status: newEstado } : p))
      );
    } catch (error) {
      alert('Error actualizando estado');
      console.error(error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Pedidos Recientes</h1>

      {loading ? (
        <p>Cargando pedidos...</p>
      ) : pedidos.length === 0 ? (
        <p>No hay pedidos aún.</p>
      ) : (
        pedidos.map(p => (
          <div
            key={p.id}
            className="border mb-6 p-4 rounded shadow-sm bg-white"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="font-semibold text-lg">Pedido #{p.id.slice(0, 8)}...</h2>
                <p className="text-sm text-gray-600">
                  Cliente: {p.user?.email || 'desconocido'}
                </p>
                <p className="text-sm text-gray-600">
                  Fecha: {new Date(p.created_at).toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm text-gray-700 font-medium mb-1">Estado:</label>
                <select
                  value={p.status}
                  onChange={e => handleEstadoChange(p.id, e.target.value)}
                  className="p-1 border rounded text-sm"
                >
                  <option value="processing">Procesando</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>
            </div>

            <ul className="mt-4 border-t pt-3 text-sm space-y-1">
              {p.items.map((item, idx) => (
                <li key={idx} className="flex justify-between">
                  <span>
                    {item.product_name} (x{item.quantity})
                  </span>
                  <span>${(item.price * item.quantity).toLocaleString()}</span>
                </li>
              ))}
            </ul>

            <div className="text-right font-bold mt-4 text-pink-600">
              Total: ${p.total_amount.toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
}