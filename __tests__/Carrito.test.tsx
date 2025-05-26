import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CarritoPage from '@/app/carrito/page';
import { useRouter } from 'next/navigation';

// Mocks completos
jest.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn()
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis()
  }
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn()
  }))
}));

const mockItems = [
  {
    id: '1',
    quantity: 2,
    product: {
      name: 'Base Líquida',
      price: 25000,
      image_url: '/base.jpg'
    }
  }
];

describe('CarritoPage', () => {
  const mockSupabase = require('../utils/supabaseClient').supabase;
  const mockRouter = useRouter();

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({
      data: { user: { id: 'user123' } },
      error: null
    });
    mockSupabase.from.mockImplementation(() => mockSupabase);
    mockSupabase.select.mockImplementation(() => mockSupabase);
    mockSupabase.eq.mockImplementation(() => ({
      data: mockItems,
      error: null
    }));
    
  });
  it('muestra mensaje de carga inicialmente', () => {
    render(<CarritoPage />);
    expect(screen.getByText('Cargando...')).toBeInTheDocument();
  });

  it('muestra mensaje cuando el carrito está vacío', async () => {
    mockSupabase.eq.mockImplementationOnce(() => ({
      data: [],
      error: null
    }));

    render(<CarritoPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    });
  });

  it('muestra los items del carrito correctamente', async () => {
    render(<CarritoPage />);
    
    await waitFor(() => {
      expect(screen.getByText('Base Líquida')).toBeInTheDocument();
      expect(screen.getByText('$25,000')).toBeInTheDocument();
      expect(screen.getByText('Total: $50,000')).toBeInTheDocument();
    });
  });

  it('maneja errores al cargar el carrito', async () => {
    mockSupabase.eq.mockImplementationOnce(() => ({
      data: null,
      error: new Error('Error de base de datos')
    }));

    console.error = jest.fn();

    render(<CarritoPage />);
    
    await waitFor(() => {
      expect(console.error).toHaveBeenCalled();
      expect(screen.getByText('Tu carrito está vacío.')).toBeInTheDocument();
    });
  });

  it('muestra imagen placeholder cuando no hay imagen', async () => {
    mockSupabase.eq.mockImplementationOnce(() => ({
      data: [{
        ...mockItems[0],
        product: {
          ...mockItems[0].product,
          image_url: null
        }
      }],
      error: null
    }));

    render(<CarritoPage />);
    
    await waitFor(() => {
      const img = screen.getByAltText('Base Líquida');
      expect(img).toHaveAttribute('src', '/placeholder.jpg');
    });
  });
});