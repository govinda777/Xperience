import React from 'react';

const Hero: React.FC = () => {
  const heroImage = new URL('/public/solutions/hero.png', import.meta.url).href;
  
  return (
    <div className="w-full min-h-screen relative flex items-center overflow-hidden">
      {/* Background Image Container */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-1/2 right-0 -translate-y-1/2 
                      w-[600px] h-[600px] rounded-full 
                      opacity-30 blur-3xl" />
        <img
          src={heroImage}
          alt=""
          className="absolute top-1/2 right-0 -translate-y-1/2 
                     h-[80%] w-auto object-contain"
          aria-hidden="true"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 md:px-8">
        {/* Text Content */}
        <div className="max-w-4xl space-y-8">
          <div className="space-y-6">
            <h1 className="text-white leading-tight">
              <span className="block text-5xl md:text-6xl">
                Soluções Inovadoras para o
              </span>
              <span className="block text-5xl md:text-6xl mt-2">
                Crescimento do Seu Negócio
              </span>
            </h1>
            
            <p className="text-xl text-white/90 leading-relaxed">
              Na Xperience, utilizamos nossa expertise e a inovação da{' '}
              <span className="font-semibold">IA do Empreendedor</span>
              {' '}para identificar e aplicar as melhores estratégias para pequenos empreendedores.
            </p>
          </div>
          
          <button className="bg-black text-white text-lg px-8 py-4 rounded-full 
                           hover:bg-gray-900 transition-colors duration-300 
                           hover:shadow-lg">
            Agendar mentoria
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;