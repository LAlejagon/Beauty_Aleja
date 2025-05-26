import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '@/components/molecules/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    render(<Footer />);
  });

  test('renderiza correctamente el logo y descripción', () => {
    expect(screen.getByText('Aleja Beauty')).toBeInTheDocument();
    expect(screen.getByText(/Inspirando confianza y amor propio/i)).toBeInTheDocument();
  });

  test('muestra los iconos de redes sociales', () => {
    expect(screen.getByTestId('instagram-icon')).toBeInTheDocument();
    expect(screen.getByTestId('facebook-icon')).toBeInTheDocument();
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  test('los enlaces de navegación funcionan correctamente', () => {
    const exploreLinks = [
      { text: 'Tienda', href: '/tienda' },
      { text: 'Favoritos', href: '/favoritos' },
      { text: 'Mi cuenta', href: '/perfil' },
      { text: 'Iniciar sesión', href: '/login' }
    ];

    exploreLinks.forEach(link => {
      const linkElement = screen.getByText(link.text);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
    });
  });

  test('los enlaces de soporte son correctos', () => {
    const supportLinks = [
      { text: 'Preguntas frecuentes', href: '/faq' },
      { text: 'Envíos & Devoluciones', href: '/envios' },
      { text: 'Contáctanos', href: '/contacto' },
      { text: 'Política de privacidad', href: '/politica' }
    ];

    supportLinks.forEach(link => {
      const linkElement = screen.getByText(link.text);
      expect(linkElement).toBeInTheDocument();
      expect(linkElement.closest('a')).toHaveAttribute('href', link.href);
    });
  });

  test('el formulario de newsletter funciona', async () => {
    const emailInput = screen.getByTestId('newsletter-input');
    const submitButton = screen.getByTestId('subscribe-button');

    await userEvent.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
    expect(submitButton).toBeEnabled();
  });

  test('muestra el copyright correctamente', () => {
    const currentYear = new Date().getFullYear();
    expect(screen.getByTestId('copyright-text')).toHaveTextContent(
      `© ${currentYear} Aleja Beauty. Diseñado con`
    );
    expect(screen.getByTestId('heart-icon')).toBeInTheDocument();
  });

  test('los enlaces externos tienen target _blank y noopener', () => {
    const socialLinks = [
      { testId: 'instagram-link', url: 'https://instagram.com' },
      { testId: 'facebook-link', url: 'https://facebook.com' }
    ];

    socialLinks.forEach(link => {
      const anchor = screen.getByTestId(link.testId);
      expect(anchor).toHaveAttribute('href', link.url);
      expect(anchor).toHaveAttribute('target', '_blank');
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    });

    // Verificar que el mail no tiene target _blank
    const mailLink = screen.getByTestId('mail-link');
    expect(mailLink).not.toHaveAttribute('target', '_blank');
  });
});