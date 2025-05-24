import Link from 'next/link';
import { FiInstagram, FiFacebook, FiMail, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-purple-100 via-pink-100 to-white text-gray-700 border-t border-pink-200 pt-12 pb-8">
      <div className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-sm">
        {/* Marca */}
        <div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4">Aleja Beauty</h2>
          <p className="text-gray-600 mb-4">
            Inspirando confianza y amor propio con productos conscientes, éticos y sostenibles.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FiInstagram size={20} className="hover:scale-110 transition-transform text-[#E4405F]" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FiFacebook size={20} className="hover:scale-110 transition-transform text-[#1877F2]" />
            </a>
            <a href="mailto:contacto@alejabeauty.com">
              <FiMail size={20} className="hover:scale-110 transition-transform text-[#EA4335]" />
            </a>
          </div>
        </div>

        {/* Enlaces */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Explorar</h3>
          <ul className="space-y-2">
            <li><Link href="/tienda" className="hover:text-pink-500 transition">Tienda</Link></li>
            <li><Link href="/favoritos" className="hover:text-pink-500 transition">Favoritos</Link></li>
            <li><Link href="/perfil" className="hover:text-pink-500 transition">Mi cuenta</Link></li>
            <li><Link href="/login" className="hover:text-pink-500 transition">Iniciar sesión</Link></li>
          </ul>
        </div>

        {/* Ayuda */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Soporte</h3>
          <ul className="space-y-2">
            <li><Link href="/faq" className="hover:text-pink-500 transition">Preguntas frecuentes</Link></li>
            <li><Link href="/envios" className="hover:text-pink-500 transition">Envíos & Devoluciones</Link></li>
            <li><Link href="/contacto" className="hover:text-pink-500 transition">Contáctanos</Link></li>
            <li><Link href="/politica" className="hover:text-pink-500 transition">Política de privacidad</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-purple-700 mb-3">Newsletter</h3>
          <p className="text-gray-600 mb-4">Recibe ofertas y novedades exclusivas en tu correo.</p>
          <form className="flex flex-col sm:flex-row gap-3">
            <input 
              type="email" 
              placeholder="Tu correo" 
              className="w-full px-4 py-2 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
            <button
              type="submit"
              className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 rounded-full font-medium transition"
            >
              Suscribirse
            </button>
          </form>
        </div>
      </div>

      <div className="mt-10 border-t border-pink-200 pt-6 text-center text-xs text-gray-500">
        <p>
          © {new Date().getFullYear()} Aleja Beauty. Diseñado con <FiHeart className="inline text-red-500" /> por Alejandra Gonzalez
        </p>
      </div>
    </footer>
  );
}
