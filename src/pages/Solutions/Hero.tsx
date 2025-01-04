import React from 'react';

const Hero: React.FC = () => {
  const heroImage = new URL('/public/solutions/hero.png', import.meta.url).href;
  
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center h-full">
        {/* Text Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white">
              Soluções que
              <span className="block mt-4 text-4xl md:text-5xl font-normal">
                transformam seu negócio
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-xl">
              Descubra como nossa expertise em inovação e tecnologia pode impulsionar o crescimento da sua empresa.
            </p>
          </div>
          
          <button className="bg-black text-white text-lg md:text-xl px-8 py-4 rounded-full hover:bg-gray-900 transition-colors duration-300 hover:shadow-lg">
            Conheça nossas soluções
          </button>
        </div>

        {/* Image */}
        <div className="relative h-full flex items-center justify-center">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F07D35] rounded-full opacity-30 blur-3xl" />
          <img
            src={heroImage}
            alt="Soluções Xperience"
            className="relative z-10 max-w-lg w-full h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;