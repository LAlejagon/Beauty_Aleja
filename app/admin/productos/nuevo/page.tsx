'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiUploadCloud } from 'react-icons/fi';

export default function NuevoProducto() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [categoria, setCategoria] = useState('');
  const [imagen, setImagen] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubiendo(true);
    setMensaje('');

    if (!imagen) {
      setMensaje('Debes seleccionar una imagen.');
      setSubiendo(false);
      return;
    }

    const nombreArchivo = `${Date.now()}-${imagen.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(nombreArchivo, imagen);

    if (uploadError) {
      console.error(uploadError);
      setMensaje('Error al subir la imagen.');
      setSubiendo(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from('productos')
      .getPublicUrl(nombreArchivo);

    const imageUrl = urlData.publicUrl;

    const { error: insertError } = await supabase.from('productos').insert([
      {
        name: nombre,
        price: Number(precio),
        stock: Number(stock),
        image_url: imageUrl,
        categories: [{ name: categoria }],
      },
    ]);

    if (insertError) {
      console.error(insertError);
      setMensaje('Error al guardar el producto.');
    } else {
      setMensaje('✅ Producto guardado correctamente.');
      setTimeout(() => {
        router.push('/admin');
      }, 2000);
    }

    setSubiendo(false);
  };

  return (
    <>
      <Header />
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-pink-600 mb-6">
          Agregar Nuevo Producto
        </h1>

        {mensaje && (
          <div
            className={`mb-4 p-3 rounded text-center text-sm font-medium ${
              mensaje.includes('✅')
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              placeholder="Nombre del producto"
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-pink-500"
            />
          </div>

          {/* Precio y Stock */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Precio</label>
              <input
                type="number"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                required
                placeholder="$"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-pink-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
                placeholder="Unidades"
                className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-pink-500"
              />
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <input
              type="text"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
              placeholder="Ej: Labiales, Cremas, etc."
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-pink-500"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImagen(e.target.files?.[0] || null)}
              required
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0 file:text-sm file:font-semibold
              file:bg-pink-100 file:text-pink-700 hover:file:bg-pink-200"
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={subiendo}
            className="w-full flex justify-center items-center gap-2 bg-pink-600 hover:bg-pink-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            <FiUploadCloud className="text-lg" />
            {subiendo ? 'Subiendo...' : 'Guardar producto'}
          </button>
        </form>
      </div>
      <Footer />
    </>
  );
}
