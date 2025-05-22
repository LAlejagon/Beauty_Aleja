'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, name, price, stock, image_url,
          categories ( name )
        `);

      if (data) setProductos(data);
      setLoading(false);
    };

    cargarProductos();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600">Productos</h1>
        <Link
          href="/admin/productos/nuevo"
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          + Nuevo producto
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando productos...</p>
      ) : productos.length === 0 ? (
        <p className="text-gray-500">No hay productos aún.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productos.map((p) => (
            <li
              key={p.id}
              className="border rounded p-4 flex gap-4 items-center shadow"
            >
              {p.image_url && (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="w-24 h-24 object-cover rounded"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">{p.name}</h2>
                <p className="text-sm text-gray-600">Categoría: {p.categories?.name || 'Sin categoría'}</p>
                <p className="text-gray-700">Precio: ${p.price}</p>
                <p className="text-gray-700">Stock: {p.stock}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
