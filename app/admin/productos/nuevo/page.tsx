'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function NuevoProducto() {
  const router = useRouter()
  const [nombre, setNombre] = useState('')
  const [precio, setPrecio] = useState('')
  const [stock, setStock] = useState('')
  const [categoria, setCategoria] = useState('')
  const [imagen, setImagen] = useState<File | null>(null)
  const [mensaje, setMensaje] = useState('')
  const [subiendo, setSubiendo] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubiendo(true)
    setMensaje('')

    if (!imagen) {
      setMensaje('Debes seleccionar una imagen.')
      setSubiendo(false)
      return
    }

    // 1. Subir imagen al bucket
    const nombreArchivo = `${Date.now()}-${imagen.name}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('productos')
      .upload(nombreArchivo, imagen)

    if (uploadError) {
      console.error(uploadError)
      setMensaje('Error al subir la imagen.')
      setSubiendo(false)
      return
    }

    // 2. Obtener URL pública
    const { data: urlData } = supabase.storage
      .from('productos')
      .getPublicUrl(nombreArchivo)

    const imageUrl = urlData.publicUrl

    // 3. Insertar producto en la base de datos
    const { error: insertError } = await supabase.from('productos').insert([
      {
        name: nombre,
        price: Number(precio),
        stock: Number(stock),
        image_url: imageUrl,
        categories: [{ name: categoria }],
      },
    ])

    if (insertError) {
      console.error(insertError)
      setMensaje('Error al guardar el producto.')
    } else {
      setMensaje('✅ Producto guardado correctamente.')
      setTimeout(() => {
        router.push('/admin') // volver al panel
      }, 2000)
    }

    setSubiendo(false)
  }

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Nuevo Producto</h1>
      {mensaje && (
        <p
          className={`mb-4 p-2 rounded text-sm ${
            mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {mensaje}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          required
          className="w-full p-2 border rounded"
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files?.[0] || null)}
          required
          className="w-full"
        />
        <button
          type="submit"
          disabled={subiendo}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {subiendo ? 'Subiendo...' : 'Guardar producto'}
        </button>
      </form>
    </div>
  )
}
