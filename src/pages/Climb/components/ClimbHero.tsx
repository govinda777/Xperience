import React from "react";

const ClimbHero: React.FC = () => {
  return (
    <div className="relative w-full bg-[#F34A0D] py-20 px-4 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <h1 className="text-4xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Xperience Climb <br />
          <span className="text-black">Pedra Bela</span>
        </h1>
        <p className="text-xl md:text-2xl text-white max-w-3xl mb-10 leading-relaxed">
          Hospitalidade, segurança e exclusividade em experiências guiadas na maior rocha da região.
          Transformamos o seu desafio em superação.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href="https://wa.me/5511999999999?text=Olá! Gostaria de reservar um Batismo de Escalada em Pedra Bela."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-900 transition-all transform hover:scale-105"
          >
            Reservar Batismo de Escalada
          </a>
          <a
            href="https://wa.me/5511999999999?text=Olá! Gostaria de solicitar uma proposta corporativa para o Xperience Climb."
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105"
          >
            Solicitar Proposta Corporativa
          </a>
        </div>
      </div>
    </div>
  );
};

export default ClimbHero;
