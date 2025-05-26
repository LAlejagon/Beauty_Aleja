import React from 'react';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import HomePage from '@/modules/homepage/generalPage';
import { supabase } from '@/utils/supabaseClient';

// Configuración completa de mocks
jest.mock('../utils/supabaseClient', () => ({
    __esModule: true,
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({ 
        data: { session: { user: { id: '123' } } } 
      }),
    },
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  }
}));
  

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('react-icons/fi', () => ({
  FiHeart: () => <div data-testid="heart-icon">HeartIcon</div>,
  FiShoppingCart: () => <div data-testid="cart-icon">CartIcon</div>,
  FiUser: () => <div data-testid="user-icon">UserIcon</div>,
  FiStar: () => <div data-testid="star-icon">StarIcon</div>,
}));

jest.mock('next/image', () => ({ src, alt }: { src: string; alt: string }) => (
  <img src={src} alt={alt} data-testid="product-image" />
));

// Mock de componentes de layout
jest.mock('../components/molecules/Header', () => () => (
  <header data-testid="header">Mock Header</header>
));

jest.mock('../components/organisms/HeroCarrusel', () => () => (
  <div data-testid="hero-carrusel">Mock Hero Carrusel</div>
));

jest.mock('../components/molecules/Footer', () => () => (
  <footer data-testid="footer">Mock Footer</footer>
));

// Mock de componentes de productos
jest.mock('../modules/auth/ProductCard', () => ({ product }: any) => (
<div data-testid={`product-card-${product.id}`}>
    <h3>{product.name}</h3>
    {product.stock === 0 && (
      <>
        <span data-testid="sold-out-badge">AGOTADO</span>
        <button 
          data-testid={`add-button-${product.id}`}
          disabled
          aria-label="Agotado"
        >
          Agotado
        </button>
      </>
    )}
    {product.stock > 0 && (
      <button 
        data-testid={`add-button-${product.id}`}
        aria-label="Añadir al carrito"
      >
        Añadir
      </button>
    )}
    <div data-testid="heart-icon" className="hidden group-hover:block">
      HeartIcon
    </div>
  </div>
));
jest.mock('react-icons/fi', () => ({
  FiHeart: () => <div data-testid="heart-icon">HeartIcon</div>,
  FiShoppingCart: () => <div data-testid="cart-icon">CartIcon</div>,
  FiUser: () => <div data-testid="user-icon">UserIcon</div>,
  FiStar: () => <div data-testid="star-icon">StarIcon</div>,
}));

// Datos de prueba
const mockProducts = [
  {
    id: '1',
    name: 'Crema Hidratante Premium',
    price: 29.99,
    stock: 10,
    image_url: '/crema-premium.jpg',
    category: 'Cuidado Facial',
    rating: 4.8,
  },
  {
    id: '2',
    name: 'Labial Mate Natural',
    price: 14.99,
    stock: 0,
    image_url: '/labial-mate.jpg',
    category: 'Maquillaje',
  },
  {
    id: '3',
    name: 'Serum Antioxidante',
    price: 39.99,
    stock: 5,
    image_url: '/serum.jpg',
    category: 'Tratamientos',
  },

];

describe('HomePage', () => {
  beforeEach(() => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    (supabase.from('products').select as jest.Mock).mockResolvedValue({
      data: mockProducts,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debe mostrar el estado de carga inicialmente', () => {
    render(<HomePage />);
    expect(screen.getByText('Cargando productos...')).toBeInTheDocument();
  });

  it('debe renderizar componentes principales', () => {
    render(<HomePage />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-carrusel')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });


  // 5. Pruebas de carga de productos
  describe('Carga de productos', () => {
    it('debe mostrar los productos después de cargar', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText('Nuestra Colección')).toBeInTheDocument();
        mockProducts.forEach(product => {
          expect(screen.getByText(product.name)).toBeInTheDocument();
        });
      });
    });
it('debe mostrar los precios formateados correctamente', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      mockProducts.forEach(product => {
        expect(screen.getByText(`$${product.price.toFixed(2)}`)).toBeInTheDocument();
      });
    });
  });

  it('debe mostrar las categorías de los productos', async () => {
    render(<HomePage />);
    
    await waitFor(() => {
      mockProducts.forEach(product => {
        expect(screen.getByText(product.category)).toBeInTheDocument();
      });
    });
  });


    it('debe manejar el estado cuando no hay productos', async () => {
      (supabase.from('products').select as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.queryByText('Crema Hidratante Premium')).not.toBeInTheDocument();
        expect(screen.getByText('Nuestra Colección')).toBeInTheDocument();
      });
    });
  });

  // 6. Pruebas de interacción
  describe('Interacciones del usuario', () => {
    it('debe mostrar el botón de admin cuando hay sesión', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: { id: '123' } } },
      });

      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText('Panel Admin')).toBeInTheDocument();
      });
    });

  // 7. Pruebas de estado
  describe('Manejo de estados', () => {
    it('debe mostrar el rating cuando está disponible', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByTestId('star-icon')).toBeInTheDocument();
        expect(screen.getByText('4.8')).toBeInTheDocument();
      });
    });

    it('debe manejar errores al cargar productos', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      (supabase.from('products').select as jest.Mock).mockRejectedValue(new Error('Error de conexión'));

      render(<HomePage />);
      
      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error al cargar productos:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  // 8. Pruebas de formulario
  describe('Formulario de newsletter', () => {
    it('debe renderizar el formulario correctamente', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        expect(screen.getByText('Únete a nuestra comunidad')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Tu correo electrónico')).toBeInTheDocument();
        expect(screen.getByText('Suscribirse')).toBeInTheDocument();
      });
    });

    it('debe permitir ingresar un email', async () => {
      render(<HomePage />);
      
      await waitFor(() => {
        const emailInput = screen.getByPlaceholderText('Tu correo electrónico');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput).toHaveValue('test@example.com');
      });
    });
   });
  });
});