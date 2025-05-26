import React from 'react';
import { render, screen } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import TutorialesPage from '@/app/tutoriales/page';
import '@testing-library/jest-dom';
import 'jest-axe/extend-expect';

expect.extend(toHaveNoViolations);

// Mock de componentes
jest.mock('../components/molecules/Header', () => () => <header data-testid="header">Header</header>);
jest.mock('../components/molecules/Footer', () => () => <footer data-testid="footer">Footer</footer>);

// Mock de next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

// Mock de react-icons
jest.mock('react-icons/fi', () => ({
  FiPlay: () => <span data-testid="fi-play">FiPlay</span>,
  FiShoppingBag: () => <span data-testid="fi-shopping-bag">FiShoppingBag</span>,
  FiYoutube: () => <span data-testid="fi-youtube">FiYoutube</span>,
  FiClock: () => <span data-testid="fi-clock">FiClock</span>,
  FiEye: () => <span data-testid="fi-eye">FiEye</span>,
}));

describe('TutorialesPage Component', () => {
  const mockVideos = [
    {
      id: 1,
      title: 'Rutina de Maquillaje Natural',
      thumbnail: '/video4.jpg',
      youtube: 'https://www.youtube.com/watch?v=sEFQsZsUkoc',
      duration: '12:45',
      views: '1.2M',
      category: 'Maquillaje'
    },
    {
      id: 2,
      title: 'Aplicación Perfecta de Base',
      thumbnail: '/video3.jpg',
      youtube: 'https://www.youtube.com/watch?v=tcFfyH0TugQ',
      duration: '8:32',
      views: '856K',
      category: 'Base'
    }
  ];

  // Pruebas de renderizado básico
  describe('Renderizado', () => {
    beforeEach(() => {
      render(<TutorialesPage />);
    });

    it('renderiza el componente correctamente con Header y Footer', () => {
      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

  it('muestra el título principal y el subtítulo', () => {
  expect(screen.getByText((content, element) => {
    return content.includes('Tutoriales') && content.includes('Aleja Beauty');
  })).toBeInTheDocument();
  
  expect(screen.getByText(/Domina las técnicas de belleza/i)).toBeInTheDocument();
});

  it('muestra la sección de tutoriales con el encabezado correcto', () => {
  expect(screen.getByText(/Explora nuestros/i, { exact: false })).toBeInTheDocument();
  expect(screen.getByText(/APRENDE CON NOSOTROS/i)).toBeInTheDocument();
});

    it('renderiza todos los videos con su información', () => {
      mockVideos.forEach(video => {
        expect(screen.getByText(video.title)).toBeInTheDocument();
        expect(screen.getByText(video.category)).toBeInTheDocument();
        expect(screen.getByText(video.duration)).toBeInTheDocument();
        expect(screen.getByText(video.views)).toBeInTheDocument();
      });
    });

    it('muestra la sección CTA con el texto correcto', () => {
      expect(screen.getByText(/¿Lista para transformar tu rutina?/i)).toBeInTheDocument();
      expect(screen.getByText(/Explorar productos/i)).toBeInTheDocument();
    });
  });

  // Pruebas de funcionalidad
  describe('Funcionalidad', () => {
    it('los enlaces de YouTube se abren en nueva pestaña', () => {
      render(<TutorialesPage />);
      const youtubeLinks = screen.getAllByText('YouTube');
      
      youtubeLinks.forEach(link => {
        const anchor = link.closest('a');
        expect(anchor).toHaveAttribute('target', '_blank');
        expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    test('el botón de productos redirige a /tienda', () => {
      render(<TutorialesPage />);
      const productsButton = screen.getByText(/Explorar productos/i);
      expect(productsButton.closest('a')).toHaveAttribute('href', '/tienda');
    });
  });

  // Pruebas de accesibilidad
  describe('Accesibilidad', () => {
    it('todas las imágenes tienen texto alternativo', () => {
      render(<TutorialesPage />);
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('alt');
        expect(img.getAttribute('alt')).not.toBe('');
      });
    });
  });

  // Pruebas de regresión
  describe('Regresión', () => {
    it('siempre muestra el botón de acción principal', () => {
      render(<TutorialesPage />);
      expect(screen.getByText(/Ver tutoriales/i)).toBeInTheDocument();
    });
  });
});