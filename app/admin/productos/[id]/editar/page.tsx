'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';

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
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-purple-600">Editar producto</h1>
      <form onSubmit={handleActualizar} className="space-y-4">
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="Precio"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          placeholder="Stock"
          className="w-full border px-4 py-2 rounded"
        />
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="URL de imagen"
          className="w-full border px-4 py-2 rounded"
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="">Selecciona una categoría</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Guardar cambios
        </button>
      </form>
    </div>
  );
}
