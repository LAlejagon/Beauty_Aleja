'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const slides = [
  {
    image: '/banner2.jpg',
    title: 'Descubre tu belleza natural',
    desc: 'Productos orgánicos y sostenibles para una rutina de cuidado consciente',
  },
  {
    image: '/banner1.jpg',
    title: 'Brilla con confianza',
    desc: 'Cosméticos premium para cada tipo de piel',
  },
  {
    image: '/banner3.jpg',
    title: 'Inspiración desde la naturaleza',
    desc: 'Fórmulas limpias, resultados increíbles',
  },
];

export default function HeroCarrusel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[70vh] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-center"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/70 to-blue-800/70 flex items-center">
            <div className="container mx-auto px-8 text-white max-w-5xl">
              <h2 className="text-5xl md:text-6xl font-serif font-light mb-6 drop-shadow-lg">
                {slide.title}
              </h2>
              <p className="text-xl md:text-2xl mb-8 opacity-90 font-light max-w-2xl">
                {slide.desc}
              </p>
              <div className="flex gap-4">
                <Link href="/tienda">
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 text-white px-10 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
                    Explorar colección
                  </button>
                </Link>
                <Link href="/tutoriales">
                  <button className="bg-transparent hover:bg-white/10 backdrop-blur-md border border-white/30 text-white px-10 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105">
                    Ver tutoriales
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controles de navegación manual */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3.5 h-3.5 rounded-full transition-colors duration-300 ${
              current === i ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
