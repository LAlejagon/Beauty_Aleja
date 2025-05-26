import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import PedidosPage from '@/app/admin/pedidos/page';
import { supabase } from '@/utils/supabaseClient';

// Mock de Supabase
jest.mock('../utils/supabaseClient');

describe('PedidosPage', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configuración base del mock
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        data: [{ role: 'admin' }], // Datos simulados del perfil
        error: null
      })
    });
  });

  it('debe mostrar "Cargando pedidos..." inicialmente', () => {
    render(<PedidosPage />);
    expect(screen.getByText(/Cargando pedidos.../i)).toBeInTheDocument();
  });

  it('debe mostrar "No hay pedidos aún." si no hay pedidos', async () => {
    // Mock específico para este test
    (supabase.from as jest.Mock).mockImplementationOnce((tableName: string) => {
      if (tableName === 'pedidos') {
        return {
          select: jest.fn().mockReturnValue({
            data: [], // Array vacío para simular no hay pedidos
            error: null
          })
        };
      }
      return {
        select: jest.fn().mockReturnValue({
          data: [{ role: 'admin' }],
          error: null
        })
      };
    });
    
    render(<PedidosPage />);
    await waitFor(() => {
      expect(screen.getByText(/No hay pedidos aún./i)).toBeInTheDocument();
    });
  });
});