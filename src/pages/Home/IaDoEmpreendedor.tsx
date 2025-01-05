// Home/IaDoEmpreendedor.tsx
import React from 'react';

interface IaDoEmpreendedorProps {
  title: string;
  subtitle: string;
  description: string;
  highlightPart1: string;
  highlightPart2: string;
  buttonText: string;
  logoAlt?: string;
}

const IaDoEmpreendedor: React.FC<IaDoEmpreendedorProps> = ({
  title,
  subtitle,
  description,
  highlightPart1,
  highlightPart2,
  buttonText,
  logoAlt = "IA do Empreendedor Logo",
}) => {

  const logoSrc = new URL('/public/logo-ia-do-empreendedor.png', import.meta.url).href;

  return (
    <div className="w-full bg-black min-h-screen relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-[#3D2A20] -translate-x-1/4 -translate-y-1/4" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-[#2A2F1E] translate-x-1/4 translate-y-1/4" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#3D2A20] translate-x-1/4 translate-y-1/4" />

      <div className="relative max-w-6xl mx-auto px-4 py-24 flex flex-col items-center text-center">
        <div className="flex items-center justify-center gap-6 mb-4">
          <img 
            src={logoSrc} 
            alt={logoAlt}
            className="w-20 h-20 object-contain"
          />
          <h2 className="text-white text-6xl font-normal">
            {title}
          </h2>
        </div>

        <p className="text-white text-3xl font-light italic mb-16">
          {subtitle}
        </p>

        <p className="text-white text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
          {description}
        </p>

        <p className="text-white text-3xl font-normal mb-12">
          {highlightPart1} <span className="font-bold">{highlightPart2}</span>
        </p>

        <button className="bg-[#E85D04] text-white text-xl font-normal px-12 py-4 rounded-full hover:bg-opacity-90 transition-colors">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default IaDoEmpreendedor;