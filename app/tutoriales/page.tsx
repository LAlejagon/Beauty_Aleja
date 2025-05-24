'use client';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/molecules/Header';
import Footer from '@/components/molecules/Footer';
import { FiPlay, FiShoppingBag, FiYoutube, FiClock, FiEye } from 'react-icons/fi';

const videos = [
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
  },
  {
    id: 3,
    title: 'Nighttime Skincare Routine',
    thumbnail: '/video2.jpg',
    youtube: 'https://www.youtube.com/watch?v=wS-XsF8FKCc',
    duration: '15:20',
    views: '2.3M',
    category: 'Skincare'
  },
  {
    id: 4,
    title: 'Maquillaje Completo Paso a Paso',
    thumbnail: '/video1.jpg',
    youtube: 'https://www.youtube.com/watch?v=wS-XsF8FKCc',
    duration: '22:10',
    views: '3.1M',
    category: 'Tutorial'
  },
];

export default function TutorialesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff5f6] to-[#ffebee]">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#ff6b8b]/90 to-[#d44d6e]/90 flex items-center justify-center">
          <div className="container mx-auto px-6 text-center text-white z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-light mb-6 animate-fade-in">
              Tutoriales <span className="text-[#ffd3d6]">Aleja Beauty</span> <span className="text-[#ffd3d6]"></span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl opacity-90 max-w-2xl mx-auto mb-8 animate-fade-in delay-100">
              Domina las técnicas de belleza con nuestras guías paso a paso
            </p>
            <div className="animate-fade-in delay-200">
              <a 
                href="#tutoriales" 
                className="inline-flex items-center bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 text-sm md:text-base"
              >
                <FiPlay className="mr-2" size={18} />
                Ver tutoriales
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Tutoriales Section */}
      <div id="tutoriales" className="container mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="text-center mb-12 md:mb-16">
          <span className="inline-block bg-[#ffd3d6] text-[#d44d6e] text-xs md:text-sm font-medium px-3 py-1 rounded-full mb-3 md:mb-4">
            APRENDE CON NOSOTROS
          </span>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-light text-[#5a2a3a] mb-4 md:mb-6">
            Explora nuestros <span className="text-[#d44d6e]">tutoriales</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#ff6b8b] to-[#d44d6e] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
          {videos.map((video) => (
            <div 
              key={video.id}
              className="group relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
            >
              {/* Contenedor de imagen con relación de aspecto 16:9 */}
              <div className="relative pt-[56.25%] w-full overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  priority={video.id <= 2} // Prioriza las primeras imágenes
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3 md:p-4">
                  <span className="bg-[#d44d6e] text-white text-xs font-medium px-2 py-1 rounded flex items-center">
                    <FiClock className="mr-1" size={12} />
                    {video.duration}
                  </span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20">
                  <div className="bg-white/90 text-[#d44d6e] p-3 md:p-4 rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                    <FiPlay size={20} />
                  </div>
                </div>
              </div>
              
              <div className="p-4 md:p-5">
                <span className="text-xs md:text-sm font-medium text-[#ff6b8b] uppercase tracking-wider">
                  {video.category}
                </span>
                <h3 className="text-base md:text-lg font-semibold text-[#5a2a3a] mt-1 mb-2 group-hover:text-[#d44d6e] transition-colors line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center justify-between text-xs md:text-sm text-gray-500">
                  <span className="flex items-center">
                    <FiEye className="mr-1" size={14} />
                    {video.views}
                  </span>
                  <a 
                    href={video.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-[#d44d6e] hover:text-[#ff6b8b] transition-colors"
                  >
                    <FiYoutube className="mr-1" size={14} />
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 md:mt-20 lg:mt-24 text-center bg-gradient-to-r from-[#fff5f6] to-[#ffebee] p-8 md:p-10 lg:p-12 rounded-2xl md:rounded-3xl border border-[#ffd3d6]">
          <h3 className="text-xl md:text-2xl lg:text-3xl font-serif font-light text-[#5a2a3a] mb-3 md:mb-4">
            ¿Lista para transformar tu rutina?
          </h3>
          <p className="text-sm md:text-base lg:text-lg text-[#7a4a56] mb-6 md:mb-8 max-w-2xl mx-auto">
            Descubre los productos profesionales que usamos en nuestros tutoriales
          </p>
          <Link
            href="/tienda"
            className="inline-flex items-center bg-gradient-to-r from-[#ff6b8b] to-[#d44d6e] hover:from-[#d44d6e] hover:to-[#ff6b8b] text-white text-sm md:text-base lg:text-lg font-medium px-6 py-3 md:px-8 md:py-4 rounded-full transition-all duration-300 hover:shadow-lg hover:scale-105"
          >
            <FiShoppingBag className="mr-2" size={18} />
            Explorar productos
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}