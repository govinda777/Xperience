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
    <section className={`w-full h-auto ${className}`}>
      {/* Image Container */}
      <div className="w-full bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="w-full h-[250px] rounded-3xl overflow-hidden">
            <img 
              src={imageSrc}
              alt={imageAlt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="w-full bg-[#FFF1E7] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <div className="max-w-4xl relative z-10">
            <h1 className="text-3xl md:text-[2.5rem] font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            <p className="text-base md:text-lg text-gray-700 mb-4">
              {description}
            </p>

            {objectiveText && (
              <p className="text-base md:text-lg text-gray-800 mb-3">
                {objectiveText}
              </p>
            )}

            <p className="text-xl md:text-2xl font-bold text-[#F34A0D]">
              {highlightedText}
            </p>
          </div>

          {/* Decorative Circle */}
          <div 
            className="absolute bottom-0 right-0 w-48 h-48 md:w-72 md:h-72 bg-yellow-200 rounded-full opacity-50 translate-x-1/3 translate-y-1/3" 
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;