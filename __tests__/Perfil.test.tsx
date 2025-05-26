import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PerfilPage from '@/app/perfil/page';
import '@testing-library/jest-dom';

// Mock completo de Supabase
jest.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

// Mock de componentes
jest.mock('../components/molecules/Header', () => () => <header>Header Mock</header>);
jest.mock('../components/molecules/Footer', () => () => <footer>Footer Mock</footer>);
jest.mock('react-icons/fi', () => ({
  FiUser: () => <span>FiUser Mock</span>
}));

const mockUser = {
  id: 'user123',
  email: 'test@example.com'
};

const mockProfile = {
  id: 'user123',
  first_name: 'Ana',
  last_name: 'Gómez',
  email: 'test@example.com',
  phone: '3001234567',
  address: 'Calle 123',
  city: 'Bogotá',
  role: 'user'
};

describe('PerfilPage', () => {
  const mockSupabase = require('../utils/supabaseClient').supabase;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Configuración base de los mocks
    mockSupabase.from.mockImplementation(() => mockSupabase);
    mockSupabase.select.mockImplementation(() => mockSupabase);
    mockSupabase.eq.mockImplementation(() => mockSupabase);
    mockSupabase.single.mockImplementation(() => ({
      data: mockProfile,
      error: null
    }));
  });

  it('muestra mensaje de carga inicialmente', () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    render(<PerfilPage />);
    expect(screen.getByText('Cargando perfil...')).toBeInTheDocument();
  });

  it('muestra el perfil correctamente cuando hay datos', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });

    render(<PerfilPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Mi Perfil')).toBeInTheDocument();
      expect(screen.getByText(/Ana Gómez/)).toBeInTheDocument();
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    });
  });

  it('maneja el caso cuando no hay datos de perfil', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: mockUser },
      error: null
    });
    
    mockSupabase.single.mockImplementationOnce(() => ({
      data: null,
      error: new Error('Perfil no encontrado')
    }));

    render(<PerfilPage />);
    
    await waitFor(() => {
      expect(screen.queryByText('Mi Perfil')).not.toBeInTheDocument();
      expect(screen.getByText('Cargando perfil...')).toBeInTheDocument();
    });
  });

  it('maneja el caso cuando no hay usuario autenticado', async () => {
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null
    });

    render(<PerfilPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Cargando perfil...')).toBeInTheDocument();
    });
  });

  it('muestra "No registrado/a" para campos vacíos', async () => {
  const incompleteProfile = {
    ...mockProfile,
    phone: null,
    address: null,
    city: null
  };

  mockSupabase.auth.getUser.mockResolvedValue({
    data: { user: mockUser },
    error: null
  });
  
  mockSupabase.single.mockImplementationOnce(() => ({
    data: incompleteProfile,
    error: null
  }));

  render(<PerfilPage />);
  
  await waitFor(() => {
    // Buscamos ambos textos ya que el componente usa masculino y femenino
    const noRegistradoElements = [
      ...screen.getAllByText('No registrado'),
      ...screen.getAllByText('No registrada')
    ];
    expect(noRegistradoElements).toHaveLength(3);
  });
});
});