import React from 'react';

interface IaDoEmpreendedorBannerProps {
  title: string;        // Exemplo: "IA do Empreendedor"
  subtitle: string;     // Exemplo: "chatbot Xperience"
  description: string;  // Exemplo: "Utilizamos nossa expertise..."
  highlightText: string; // Exemplo: "TUDO DE FORMA GRATUITA!"
  buttonText: string;   // Exemplo: "Explore a IA"
}

const IaDoEmpreendedorBanner: React.FC<IaDoEmpreendedorBannerProps> = ({
  title,
  subtitle,
  description,
  highlightText,
  buttonText
}) => {
  // Ajuste o path conforme sua estrutura de arquivos
  const logoSrc = new URL('/public/logo-ia-do-empreendedor.png', import.meta.url).href;

  return (
    <div className="relative bg-[#F8B195] w-full min-h-screen flex items-center justify-center p-4 md:p-8 overflow-hidden">

      {/* Bolinhas de fundo */}
      <div
        className="absolute w-24 h-24 rounded-full bg-[#F9CDBA] opacity-60 top-10 left-10
                   hidden md:block"
      />
      <div
        className="absolute w-40 h-40 rounded-full bg-[#F9CDBA] opacity-70 -bottom-20 -right-10
                   hidden md:block"
      />
      <div
        className="absolute w-32 h-32 rounded-full bg-[#F9CDBA] opacity-50 top-[40%] left-[80%]
                   hidden md:block"
      />

      {/* Grid principal (2 colunas no desktop, 1 no mobile) */}
      <div className="relative max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center">

        {/* Coluna Esquerda: Logo, Título, Subtítulo */}
        <div className="flex flex-col justify-center items-center text-center">
          <img
            src={logoSrc}
            alt="Ícone IA do Empreendedor"
            className="w-64 md:w-72 h-auto object-contain mb-4"
          />
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            {title}
          </h2>
          <p className="text-xl md:text-2xl text-gray-700 mt-2">
            {subtitle}
          </p>
        </div>

        {/* Coluna Direita: Descrição, Destaque e Botão (alinhados à esquerda) */}
        <div className="flex flex-col text-left mx-auto md:mx-0">
          <p className="text-base md:text-lg text-gray-800 mb-4 max-w-xl leading-relaxed">
            {description}
          </p>

          <p className="text-xl md:text-2xl font-semibold text-gray-900 mb-6">
            {highlightText}
          </p>

          <button
            className="bg-black text-white px-8 py-3 rounded-full text-lg hover:bg-opacity-90
                       transition-colors"
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default IaDoEmpreendedorBanner;
