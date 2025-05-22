'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

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

  if (!perfil) return <p className="text-center mt-10">Cargando perfil...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Mi Perfil</h1>
      <ul className="space-y-2 text-gray-700">
        <li><strong>Nombre:</strong> {perfil.first_name} {perfil.last_name}</li>
        <li><strong>Correo:</strong> {perfil.email}</li>
        <li><strong>Teléfono:</strong> {perfil.phone || 'No registrado'}</li>
        <li><strong>Dirección:</strong> {perfil.address || 'No registrada'}</li>
        <li><strong>Ciudad:</strong> {perfil.city || 'No registrada'}</li>
        <li><strong>Rol:</strong> {perfil.role}</li>
      </ul>
    </div>
  );
}
