import React from 'react';

interface IntroSectionProps {
  imageSrc: string;
  imageAlt?: string;
  title: string;
  description: string;
  objectiveText?: string;
  highlightedText: string;
  className?: string;
}

const IntroSection: React.FC<IntroSectionProps> = ({
  imageSrc,
  imageAlt = "",
  title,
  description,
  objectiveText = "Nosso objetivo é claro:",
  highlightedText,
  className = ""
}) => {
  return (
    <section className={`w-full h-screen overflow-hidden flex flex-col ${className}`}>
      {/* Top Section (Imagem) */}
      <div className="flex-1 bg-gradient-to-b from-[#F34A0D] to-[#FFF1E7] flex items-center justify-center">
        <div className="max-w-7xl w-full px-4">
          <div className="w-full h-[200px] md:h-[300px] rounded-3xl overflow-hidden">
            <img
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Bottom Section (Texto) */}
      <div className="flex-1 bg-[#FFF1E7] relative overflow-hidden flex items-center">
        <div className="max-w-7xl w-full px-4 py-6 md:py-8">
          <div className="max-w-4xl mx-auto relative z-10 text-left px-4 md:px-6 lg:px-8">
            <h1 className="text-4xl md:text-[3rem] font-extrabold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">
              {description}
            </p>

            {objectiveText && (
              <p className="text-lg md:text-xl text-gray-900 font-semibold mb-4">
                {objectiveText}
              </p>
            )}

            <p className="text-lg md:text-xl font-bold text-[#F34A0D]">
              {highlightedText}
            </p>
          </div>

          {/* Círculo decorativo */}
          <div
            className="absolute bottom-0 right-0 w-40 h-40 md:w-56 md:h-56 bg-yellow-400 rounded-full opacity-80 translate-x-12 translate-y-12"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
