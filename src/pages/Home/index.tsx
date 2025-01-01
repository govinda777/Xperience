import React from 'react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-24 md:py-16 items-center relative overflow-hidden">
        {/* Hero Content */}
        <div className="flex flex-col">
          <h1 className="text-white text-6xl font-normal leading-tight mb-4">
            Explore nossa
            <br />
            <span className="text-white text-[50px] font-bold block my-2">
              "IA do empreendedor"
            </span>
            <span className="text-white text-7xl">
              e avalie o seu negócio
            </span>
          </h1>
          
          <p className="text-white text-2xl mb-12 max-w-2xl">
            Descubra como valorizar sua empresa e encantar seus clientes de forma rápida e
            <span className="font-bold"> GRATUITA</span>.
          </p>

          <button className="bg-black text-white text-2xl font-medium rounded-full px-12 py-4 w-fit flex items-center gap-2 hover:shadow-lg transition-all">
            Descubra
            <span className="inline-block ml-1">✨</span>
          </button>
        </div>

        {/* Hero Image */}
        <div className="relative flex justify-end">
          
          <img 
            src="/home/hero.png" 
            alt="Empreendedor" 
            className="relative z-10 w-full max-w-[500px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;