'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { FaSave } from 'react-icons/fa';

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

export default function ProductForm({ onClose, onSuccess }: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '',
    image_url: '',
    status: 'active',
  });

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('id, name');
      if (error) console.error(error);
      else setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category_id) {
      alert('Todos los campos obligatorios deben estar completos');
      return;
    }

    const { error } = await supabase.from('products').insert({
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: form.category_id,
      image_url: form.image_url,
      status: form.status,
    });

    if (error) {
      alert('Error al crear producto');
      console.error(error);
    } else {
      alert('Producto creado correctamente');
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/30 flex justify-center items-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold text-pink-600 mb-4">Crear nuevo producto</h2>

        <input type="text" name="name" placeholder="Nombre" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <textarea name="description" placeholder="Descripción" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="number" name="price" placeholder="Precio" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="number" name="stock" placeholder="Stock" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />
        <input type="text" name="image_url" placeholder="URL de imagen" onChange={handleChange} className="w-full p-2 mb-3 border rounded" />

        <select name="category_id" onChange={handleChange} className="w-full p-2 mb-3 border rounded">
          <option value="">Selecciona categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select name="status" onChange={handleChange} className="w-full p-2 mb-4 border rounded">
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
        </select>

        <button
          onClick={handleSubmit}
          className="bg-pink-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-pink-700"
        >
          <FaSave /> Guardar producto
        </button>
      </div>
    </div>
  );
}
