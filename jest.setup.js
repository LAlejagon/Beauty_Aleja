// jest.setup.js - Versión actualizada y verificada
import '@testing-library/jest-dom'; // Importación principal sin extend-expect

// Polyfills para Node.js (compatible con todas versiones)
if (typeof TextEncoder === 'undefined') {
  const { TextEncoder, TextDecoder } = require('util');
  global.TextEncoder = TextEncoder;
  global.TextDecoder = TextDecoder;
  
  
// Mock para next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => <img {...props} />,
}));
}

// Mock global de fetch simplificado
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: () => Promise.resolve({ data: [] }),
});

// Mock mínimo para matchMedia
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};

// Variables de entorno para pruebas
process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://mock-supabase.com';
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'mock-key';

// Limpieza automática
afterEach(() => {
  jest.restoreAllMocks();
});         