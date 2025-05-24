'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiEdit3 } from 'react-icons/fi';

export default function EditarProducto() {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [categorias, setCategorias] = useState<any[]>([]);
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  useEffect(() => {
    const cargarProductoYCategorias = async () => {
      const { data: cat } = await supabase.from('categories').select('*');
      if (cat) setCategorias(cat);

      const { data: producto } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (producto) {
        setNombre(producto.name);
        setPrecio(producto.price);
        setStock(producto.stock);
        setImageUrl(producto.image_url);
        setCategoriaId(producto.category_id);
      }
    };

    cargarProductoYCategorias();
  }, [id]);

  const handleActualizar = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase
      .from('products')
      .update({
        name: nombre,
        price: Number(precio),
        stock: Number(stock),
        image_url: imageUrl,
        category_id: categoriaId,
      })
      .eq('id', id);

    router.push('/admin');
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-12 bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-8">Editar Producto</h1>

        <form onSubmit={handleActualizar} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Precio"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Stock"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL de imagen</label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-purple-500"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded flex justify-center items-center gap-2 transition"
          >
            <FiEdit3 className="text-xl" />
            Guardar cambios
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
