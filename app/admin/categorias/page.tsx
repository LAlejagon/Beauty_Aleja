'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NuevaCategoriaPage() {
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nombre) {
      setError('El nombre de la categoría es obligatorio.');
      return;
    }

    const { error } = await supabase.from('categories').insert([{ name: nombre }]);
    if (error) {
      setError(error.message);
    } else {
      router.push('/admin/productos');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-purple-600 mb-6">Nueva Categoría</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow p-6 rounded">
        <input
          type="text"
          placeholder="Nombre de la categoría"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Crear categoría
        </button>
      </form>
    </div>
  );
}
