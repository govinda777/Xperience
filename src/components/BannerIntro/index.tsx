import React from 'react';

interface BannerIntroProps {
  imageSrc: string;
  title: string;
  highlightedText: string;
  backgroundColor?: string;
  textColor?: string;
}

const BannerIntro: React.FC<BannerIntroProps> = ({
  imageSrc,
  title,
  highlightedText,
  backgroundColor = '',
  textColor = '#FFFFFF',
}) => {
  return (
    <div
      style={{ backgroundColor }}
      className="py-10 relative w-full h-96 overflow-hidden"
    >
      {/* Círculos decorativos (maiores para se aproximar ao design Figma) */}
      <div className="absolute w-[600px] h-[600px] bg-orange-300/20 rounded-full -left-64 -top-64"></div>
      <div className="absolute w-[500px] h-[500px] bg-orange-300/20 rounded-full -right-64 -bottom-64"></div>

      {/* Container principal em linha (mascote e texto) */}
      <div className="relative z-10 flex md:flex-row flex-col md:items-center md:w-full md:h-full">
        {/* Div para a imagem (metade da tela) */}
        <div className="md:w-1/2 flex justify-center">
          <img
            src={imageSrc}
            alt="Mascote"
            className='md:w-[300px] md:h-[300px] w-[200px] h-[200px]'
          />
        </div>

        {/* Div para o texto (metade da tela) */}
        <div className="w-1/2 mx-auto flex flex-col md:items-start items-center justify-center">
          <h2
            className="text-4xl md:text-5xl font-bold md:mb-4"
            style={{ color: textColor }}
          >
            {title}{' '}
            <span
              className="relative"
              style={{ color: textColor }}
            >
              {highlightedText}
              <div className="absolute bottom-0 left-0 w-full h-2 bg-yellow-300"></div>
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BannerIntro;
