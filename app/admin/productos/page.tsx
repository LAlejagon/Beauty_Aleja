'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';

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
    <>
      <Header />

      <main className="max-w-6xl mx-auto mt-12 px-6">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold text-pink-600 tracking-tight">Productos</h1>
          <Link
            href="/admin/productos/nuevo"
            className="inline-block bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full font-semibold shadow-md transition"
          >
            + Nuevo producto
          </Link>
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Cargando productos...</p>
        ) : productos.length === 0 ? (
          <p className="text-gray-500 text-center">No hay productos aún.</p>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((p) => (
              <li
                key={p.id}
                className="bg-white border rounded-xl shadow hover:shadow-lg p-5 flex flex-col sm:flex-row gap-5 transition"
              >
                {p.image_url && (
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-full sm:w-32 h-32 object-cover rounded"
                  />
                )}
                <div className="flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{p.name}</h2>
                    <p className="text-sm text-gray-500 mb-1">Categoría: {p.categories?.name || 'Sin categoría'}</p>
                    <p className="text-sm text-gray-700">Stock: <strong>{p.stock}</strong></p>
                    <p className="text-lg font-bold text-pink-600 mt-1">${p.price}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      <Footer />
    </>
  );
}
