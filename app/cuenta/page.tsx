'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiLoader } from 'react-icons/fi';

export default function CuentaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
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

      if (error || !profile) {
        alert('No se pudo obtener el rol');
        return;
      }

      if (profile.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/cliente');
      }
    };

    checkUser();
  }, [router]);

  return (
    <>
      <Header />
      <div className="flex flex-col justify-center items-center min-h-[60vh] text-center">
        <FiLoader className="animate-spin text-pink-600 text-4xl mb-4" />
        <p className="text-lg text-gray-700 font-medium">Redirigiendo a tu cuenta...</p>
      </div>
      <Footer />
    </>
  );
}
