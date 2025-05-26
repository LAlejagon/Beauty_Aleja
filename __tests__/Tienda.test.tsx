import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import TiendaPage from '@/app/tienda/page';
import '@testing-library/jest-dom';

// Mock completo de Supabase
const mockUpsert = jest.fn().mockResolvedValue({ error: null });

jest.mock('../utils/supabaseClient', () => ({
  supabase: {
    from: jest.fn((table: string) => {
      if (table === 'products') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({ 
            data: [{
              id: '1',
              name: 'Labial Matte',
              price: 25000,
              image_url: '/labial.jpg',
              stock: 10,
              categories: [{ name: 'Maquillaje' }]
            }],
            error: null
          })
        };
      }
      if (table === 'cart_items') {
        return { upsert: mockUpsert };
      }
      if (table === 'profiles') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          single: jest.fn().mockResolvedValue({
            data: { role: 'customer' },
            error: null
          })
        };
      }
      return {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis()
      };
    }),
    auth: {
      getUser: jest.fn().mockResolvedValue({ 
        data: { user: { id: 'user123' } }, 
        error: null 
      })
    }
  }
}));

jest.mock('../context/CartContext', () => ({
  useCartContext: () => ({
    refreshCart: jest.fn()
  })
}));

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  usePathname: () => '/tienda'
}));

describe('TiendaPage', () => {
  beforeEach(() => {
    mockUpsert.mockClear();
  });

  it('carga y muestra productos correctamente', async () => {
    render(<TiendaPage />);
    expect(await screen.findByText('Labial Matte')).toBeInTheDocument();
  });

  it('maneja agregar al carrito correctamente', async () => {
    render(<TiendaPage />);
    
    // Esperamos a que cargue el producto
    await screen.findByText('Labial Matte');
    
    // Encontramos el botón específico para este producto
    const addButton = screen.getAllByRole('button', { 
      name: /añadir/i 
    })[0];
    
    fireEvent.click(addButton);
    
    // Verificamos la llamada a Supabase
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalledWith(
        {
          user_id: 'user123',
          product_id: '1',
          quantity: 1
        },
        { onConflict: 'user_id,product_id' }
      );
    });
  });
});