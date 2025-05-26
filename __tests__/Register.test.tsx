import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '@/app/register/page';
import { supabase } from '@/utils/supabaseClient';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mocks
jest.mock('../utils/supabaseClient');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));
jest.mock('react-icons/fi', () => ({
  FiUser: () => <span>FiUser</span>,
  FiMail: () => <span>FiMail</span>,
  FiLock: () => <span>FiLock</span>
}));

describe('RegisterPage', () => {
  const mockRouter = {
    push: jest.fn()
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({ error: null });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza correctamente el formulario de registro', () => {
    render(<RegisterPage />);
    
    expect(screen.getByText('Crear cuenta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Apellido')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Correo electrónico')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Registrarse' })).toBeInTheDocument();
  });

  it('muestra mensaje de error cuando falla el registro', async () => {
    const errorMessage = 'Error al crear la cuenta';
    (supabase.auth.signUp as jest.Mock).mockResolvedValueOnce({
      error: { message: errorMessage }
    });

    render(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Gómez' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('redirige a login después de registro exitoso', async () => {
    window.alert = jest.fn(); // Mock para alert
    
    render(<RegisterPage />);
    
    fireEvent.change(screen.getByPlaceholderText('Nombre'), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByPlaceholderText('Apellido'), { target: { value: 'Gómez' } });
    fireEvent.change(screen.getByPlaceholderText('Correo electrónico'), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByPlaceholderText('Contraseña'), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Cuenta creada correctamente. Ahora puedes iniciar sesión.');
      expect(mockRouter.push).toHaveBeenCalledWith('/login');
    });
  });

  it('valida que los campos sean requeridos', async () => {
    render(<RegisterPage />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    await waitFor(() => {
      expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
  });

  it('muestra el enlace para iniciar sesión', () => {
    render(<RegisterPage />);
    const loginLink = screen.getByRole('link', { name: 'Inicia sesión' });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });
});