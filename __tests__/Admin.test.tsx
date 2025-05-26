import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ProductosPage from '@/app/admin/productos/page';
import { supabase } from '@/utils/supabaseClient';

// Mock Supabase client
jest.mock('../utils/supabaseClient', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    auth: {
      getUser: jest.fn().mockResolvedValue({
        data: { user: null },
        error: null
      })
    }
  }
}));

// Mock the Header component
jest.mock('../components/molecules/Header', () => () => (
  <header>Mock Header</header>
));

describe('ProductosPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar un loading inicial', () => {
    render(<ProductosPage />);
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
  });

  it('debe mostrar un mensaje cuando no hay productos', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockResolvedValue({
        data: [],
        error: null
      })
    });

    await act(async () => {
      render(<ProductosPage />);
    });
    
    expect(screen.getByText('No hay productos aún.')).toBeInTheDocument();
  });

  it('debe mostrar los productos correctamente', async () => {
  const mockProducts = [{
    id: 1,
    name: 'Producto 1',
    price: 19.99,
    stock: 10,
    image_url: 'image1.jpg',
    categories: { name: 'Categoría 1' }
  }];

  (supabase.from as jest.Mock).mockReturnValue({
    select: jest.fn().mockResolvedValue({
      data: mockProducts,
      error: null
    })
  });

  await act(async () => {
    render(<ProductosPage />);
  });
  
  expect(screen.getByText('Producto 1')).toBeInTheDocument();
  
  expect(screen.getByText(/\$19\.99/)).toBeInTheDocument();
  
  const stockElement = screen.getByText('Stock:');
  expect(stockElement).toBeInTheDocument();
  expect(stockElement.parentElement).toHaveTextContent('10');
  
  expect(screen.getByText(/Categoría:\s*Categoría 1/)).toBeInTheDocument();
});
});