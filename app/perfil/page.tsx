'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiUser } from 'react-icons/fi';

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<any>(null);

  useEffect(() => {
    const cargarPerfil = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (!error) setPerfil(data);
    };

    cargarPerfil();
  }, []);

  if (!perfil) {
    return (
      <>
        <Header />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-gray-500">Cargando perfil...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="max-w-2xl mx-auto px-6 py-12 bg-white shadow-lg rounded-xl mt-10">
        <div className="flex items-center gap-3 mb-6">
          <FiUser className="text-pink-600 text-3xl" />
          <h1 className="text-3xl font-bold text-pink-600">Mi Perfil</h1>
        </div>

        <ul className="divide-y divide-gray-200 text-gray-700 text-base">
          <li className="py-2"><strong>Nombre:</strong> {perfil.first_name} {perfil.last_name}</li>
          <li className="py-2"><strong>Correo:</strong> {perfil.email}</li>
          <li className="py-2"><strong>Teléfono:</strong> {perfil.phone || 'No registrado'}</li>
          <li className="py-2"><strong>Dirección:</strong> {perfil.address || 'No registrada'}</li>
          <li className="py-2"><strong>Ciudad:</strong> {perfil.city || 'No registrada'}</li>
          <li className="py-2"><strong>Rol:</strong> <span className="capitalize">{perfil.role}</span></li>
        </ul>
      </main>

      <Footer />
    </>
  );
}
