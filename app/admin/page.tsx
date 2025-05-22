'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Link from 'next/link';
import { FiEdit2, FiTrash2, FiPlus, FiTag, FiDollarSign, FiBox } from 'react-icons/fi';
// }import { Toaster } from 'react-hot-toast';

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
   //     Toaster.error('Error al cargar productos');
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
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProductos(productos.filter(p => p.id !== id));
 //     Toaster.success('Producto eliminado correctamente');
    } catch (error) {
 //     Toaster.error('Error al eliminar producto');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Administración de Productos</h1>
            <p className="mt-2 text-gray-600">Gestiona tu catálogo de productos</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Link
              href="/admin/productos/nuevo"
              className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
            >
              <FiPlus className="mr-2" />
              Nuevo Producto
            </Link>
            <Link
              href="/admin/categorias"
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <FiTag className="mr-2" />
              Categorías
            </Link>
          </div>
        </div>

        {productos.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FiBox className="mx-auto text-4xl text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No hay productos</h3>
            <p className="mt-2 text-gray-600">Comienza agregando tu primer producto</p>
            <div className="mt-6">
              <Link
                href="/admin/productos/nuevo"
                className="inline-flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
              >
                <FiPlus className="mr-2" />
                Crear primer producto
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {productos.map((producto) => (
              <div key={producto.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {producto.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={producto.image_url}
                      alt={producto.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{producto.name}</h3>
                    <div className="flex space-x-2">
                      <Link
                        href={`/admin/productos/${producto.id}/editar`}
                        className="text-gray-500 hover:text-pink-600 transition-colors"
                        title="Editar"
                      >
                        <FiEdit2 />
                      </Link>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="text-gray-500 hover:text-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-gray-600">
                      <FiDollarSign className="mr-2 text-pink-500" />
                      <span>${producto.price.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiBox className="mr-2 text-pink-500" />
                      <span>Stock: {producto.stock}</span>
                    </div>
                    {producto.categories?.name && (
                      <div className="flex items-center text-gray-600">
                        <FiTag className="mr-2 text-pink-500" />
                        <span>{producto.categories.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}