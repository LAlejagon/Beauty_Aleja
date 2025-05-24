'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiTag,
  FiDollarSign,
  FiBox,
  FiRefreshCcw
} from 'react-icons/fi';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';

export default function ProductosPage() {
  const [productos, setProductos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('products')
          .select('id, name, price, stock, image_url, categories(name)')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setProductos(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    cargarProductos();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Header />

      <main className="min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <div>
              <h1 className="text-4xl font-extrabold text-pink-600 tracking-tight">Panel de Productos</h1>
              <p className="mt-1 text-gray-600">Controla el inventario y visualiza tu catálogo en un solo lugar.</p>
            </div>
            <div className="mt-4 md:mt-0 flex gap-2 flex-wrap">
              <Link
                href="/admin/productos/nuevo"
                className="flex items-center gap-2 bg-pink-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-pink-700 transition"
              >
                <FiPlus /> Nuevo
              </Link>
              <Link
                href="/admin/categorias"
                className="flex items-center gap-2 bg-purple-600 text-white font-medium px-4 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                <FiTag /> Categorías
              </Link>
              <button
                disabled
                title="Próximamente"
                className="flex items-center gap-2 bg-gray-200 text-gray-500 font-medium px-4 py-2 rounded-lg cursor-not-allowed"
              >
                <FiRefreshCcw /> Duplicar
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500" />
            </div>
          ) : productos.length === 0 ? (
            <div className="text-center bg-white p-10 rounded-xl shadow">
              <FiBox className="text-5xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800">No hay productos registrados</h2>
              <p className="text-gray-500 mt-2">Agrega el primer producto para comenzar a vender</p>
              <Link
                href="/admin/productos/nuevo"
                className="mt-5 inline-block bg-pink-600 text-white px-5 py-2 rounded hover:bg-pink-700 transition"
              >
                <FiPlus className="inline-block mr-2" /> Agregar producto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productos.map((producto) => (
                <div
                  key={producto.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition border border-gray-100"
                >
                  {producto.image_url && (
                    <div className="h-48 w-full overflow-hidden rounded-t-xl">
                      <img
                        src={producto.image_url}
                        alt={producto.name}
                        className="object-cover h-full w-full"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{producto.name}</h3>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/productos/${producto.id}/editar`}
                          className="text-gray-500 hover:text-pink-600"
                          title="Editar"
                        >
                          <FiEdit2 />
                        </Link>
                        <button
                          onClick={() => handleDelete(producto.id)}
                          className="text-gray-500 hover:text-red-600"
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="flex items-center">
                        <FiDollarSign className="mr-2 text-pink-500" /> ${producto.price.toFixed(2)}
                      </p>
                      <p className="flex items-center">
                        <FiBox className="mr-2 text-pink-500" /> Stock: {producto.stock}
                      </p>
                      {producto.categories?.name && (
                        <p className="flex items-center">
                          <FiTag className="mr-2 text-pink-500" /> {producto.categories.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
