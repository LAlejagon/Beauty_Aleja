'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (error || profile?.role !== 'admin') {
        router.push('/login');
      } else {
        setIsAdmin(true);
      }

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  if (loading) return <p className="text-center mt-10 text-gray-600">Verificando permisos...</p>;

  if (!isAdmin) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">Panel de Administración</h1>
      <p className="text-gray-700">Bienvenido administrador. Aquí podrás gestionar productos, categorías y más.</p>

      <div className="mt-6">
        {/* Próximo paso: listado de productos */}
        <p className="text-sm text-gray-500">Módulo de productos próximamente aquí...</p>
      </div>
    </div>
  );
}
