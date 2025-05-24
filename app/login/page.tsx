'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiLock, FiMail, FiLogIn } from 'react-icons/fi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error(authError.message);

      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('No se pudo obtener el usuario');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      if (profileError) throw new Error('Perfil no encontrado');

      router.push(profile?.role === 'admin' ? '/admin' : '/tienda');
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-100 to-pink-200 px-4 py-12">
      <div className="absolute inset-0 bg-[url('/background-pattern.svg')] opacity-10 blur-xl bg-cover bg-center z-0"></div>

      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-extrabold text-center text-pink-600 mb-6 flex items-center justify-center gap-2">
          <FiLogIn className="text-2xl" />
          Bienvenido de nuevo
        </h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 border border-red-300 rounded px-4 py-2 mb-4 text-sm text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo</label>
            <div className="relative mt-1">
              <FiMail className="absolute top-2.5 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative mt-1">
              <FiLock className="absolute top-2.5 left-3 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 px-4 rounded-lg transition font-medium shadow-lg"
          >
            {loading ? 'Verificando...' : 'Iniciar sesión'}
          </button>
        </form>

        <div className="text-sm text-center text-gray-600 mt-6">
          <p>
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-pink-600 hover:underline">Regístrate</Link>
          </p>
          <p className="mt-2">
            <Link href="/forgot-password" className="text-pink-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
