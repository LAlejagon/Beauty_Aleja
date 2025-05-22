'use client';
import { useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      // 1. Autenticación con Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      // 2. Obtener usuario autenticado
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        throw new Error('No se pudo obtener el usuario');
      }

      // 3. Verificar rol en la tabla profiles (sin modificar lógica admin)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw new Error('Perfil no encontrado');
      }

      // Redirección según rol (admin → /admin, otros → /tienda)
      router.push(profile?.role === 'admin' ? '/admin' : '/tienda');

    } catch (error) {
      setErrorMsg(
        error instanceof Error 
          ? error.message 
          : 'Credenciales inválidas. Verifica tu correo y contraseña.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <h1>Iniciar sesión</h1>
      <form onSubmit={handleLogin}>
        {errorMsg && <p className="error">{errorMsg}</p>}
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        
        <button 
          type="submit" 
          disabled={loading}
        >
          {loading ? 'Verificando...' : 'Entrar'}
        </button>
      </form>
      
      <div className="auth-links">
        <p>¿No tienes cuenta? <Link href="/register">Regístrate</Link></p>
        <p>
          <Link href="/forgot-password">¿Olvidaste tu contraseña?</Link>
        </p>
      </div>
    </div>
  );
}