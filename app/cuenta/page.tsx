'use client'
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';

export default function CuentaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push('/auth/login');
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

      // Redirigir según el rol
      if (profile.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/cliente');
      }
    };

    checkUser();
  }, [router]);

  return (
    <div className="text-center mt-20 text-pink-600">
      Redirigiendo a tu cuenta...
    </div>
  );
}
