import React from 'react';

const Home = () => {
  const heroImage = new URL('/public/home/hero.png', import.meta.url).href;
  return (
    <div className="w-full">
      <div className="max-w-none px-4 md:pr-0 md:pl-[calc((100%-74rem)/2)] grid grid-cols-1 md:grid-cols-2 gap-8 py-24 md:py-16 items-center relative overflow-hidden">
        <div className="flex flex-col max-w-2xl ml-auto">
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

        <div className="absolute right-0 bottom-0 hidden md:block">
          <img 
            src={heroImage}
            alt="Empreendedor" 
            className="w-[500px] h-auto"
          />
        </div>
        <div className="block md:hidden relative flex justify-end items-end">
          <img 
            src={heroImage}
            alt="Empreendedor"
            className="w-full max-w-[500px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;