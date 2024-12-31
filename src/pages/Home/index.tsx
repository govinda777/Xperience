import React from 'react';
import Navbar from '../../components/Navbar';

const Home = () => {
  return (
    <div className="min-h-screen w-full bg-[#FD9526]">
      <div className="max-w-7xl mx-auto px-4 w-full">
        <Navbar />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-24 md:py-16 items-center relative overflow-hidden">
          {/* Hero Content */}
          <div>
            <h1 className="text-6xl md:text-5xl text-black mb-8 font-extrabold leading-tight tracking-tight">
              Explore nossa
              <br />
              <span className="block font-serif italic font-medium text-5xl md:text-[3.5rem] my-2 tracking-tight leading-tight">
                "IA do empreendedor"
              </span>
              <br />
              e avalie o seu negócio
            </h1>
            
            <p className="text-xl md:text-lg text-black mb-14 max-w-xl leading-relaxed tracking-tight">
              Descubra como valorizar sua empresa e encantar seus clientes de forma rápida e
              <strong className="font-extrabold tracking-normal"> GRATUITA</strong>.
            </p>

            <button className="bg-black text-white rounded-full px-12 py-5 text-xl font-semibold inline-flex items-center gap-3 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg md:text-lg md:px-10 md:py-4">
              Descubra 
              <span className="text-2xl mt-[-2px]">✨</span>
            </button>
          </div>

          {/* Hero Image */}
          <div className="relative w-full h-full flex justify-end items-end">
            <img 
              src="/home/hero.png" 
              alt="Empreendedor" 
              className="w-full h-auto max-w-[450px] object-contain relative z-10 -mb-8 -mr-8 md:max-w-[80%] md:m-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;