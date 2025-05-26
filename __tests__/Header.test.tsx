import { render, screen } from '@testing-library/react';
import Header from '../components/molecules/Header';

// Mock completo de Supabase
jest.mock('../utils/supabaseClient', () => ({
  supabase: {
    auth: {
      getUser: jest.fn(() => Promise.resolve({
        data: { user: null },
        error: null
      })),
      signOut: jest.fn()
    },
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: null,
            error: null
          }))
        }))
      }))
    }))
  }
}));

// Mock del contexto del carrito
jest.mock('../context/CartContext', () => ({
  useCartContext: () => ({
    cartCount: 2
  })
}));

// Mock de next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

describe('Header Component', () => {
  test('renderiza el logo (versión desktop)', () => {
    render(<Header />);
    const desktopLogo = screen.getByText('ALEJA BEAUTY', { selector: 'a.text-3xl' });
    expect(desktopLogo).toBeInTheDocument();
  });

  test('muestra el contador del carrito (versión desktop)', () => {
    render(<Header />);
    const desktopCartCount = screen.getByText('2', { selector: 'span.absolute.-top-2' });
    expect(desktopCartCount).toBeInTheDocument();
  });   

  test('muestra el contador del carrito (versión mobile)', () => {
    render(<Header />);
    const mobileCartCount = screen.getByText('2', { selector: 'span.absolute.-top-1' });
    expect(mobileCartCount).toBeInTheDocument();
  });

  test('muestra los enlaces principales', () => {
    render(<Header />);
    expect(screen.getByText('Tienda')).toBeInTheDocument();
    expect(screen.getByText('Favoritos')).toBeInTheDocument();
  });

  test('muestra opciones de login cuando no hay usuario', () => {
    render(<Header />);
    expect(screen.getByText('Iniciar sesión')).toBeInTheDocument();
    expect(screen.getByText('Registrarse')).toBeInTheDocument();
  });
});