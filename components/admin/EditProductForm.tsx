'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaSave } from 'react-icons/fa';

type Props = {
  productId: string;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditProductForm({ productId, onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: catData } = await supabase.from('categories').select('id, name');
      setCategories(catData || []);

      const { data: prodData } = await supabase.from('products').select('*').eq('id', productId).single();
      if (prodData) setForm(prodData);
    };

    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const { error } = await supabase.from('products').update({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url,
      status: form.status,
      category_id: form.category_id,
    }).eq('id', productId);

    if (error) {
      alert('Error al guardar cambios');
      console.error(error);
    } else {
      alert('Producto actualizado correctamente');
      onSuccess();
      onClose();
    }
  };

  if (!form) return <div className="text-center p-4">Cargando producto...</div>;

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-pink-600 mb-4">Editar producto</h2>

        <input type="text" name="name" value={form.name} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="number" name="stock" value={form.stock} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="text" name="image_url" value={form.image_url} onChange={handleChange} className="w-full p-2 mb-3 border rounded" />

        <select name="category_id" value={form.category_id} onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="">Selecciona categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select name="status" value={form.status} onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>

        <button
          onClick={handleSave}
          className="bg-pink-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-700"
        >
          <FaSave /> Guardar cambios
        </button>
      </div>
    </div>
  );
}
