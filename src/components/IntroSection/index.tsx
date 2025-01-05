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
    <section className={`w-full bg-gradient-to-b to-white ${className}`}>
      {/* Banner/Hero Image Container */}
      <div className="w-full h-[250px] mt-20">
        <img 
          src={imageSrc}
          alt={imageAlt}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Content Container */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl">
            {/* Main Title */}
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {title}
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-700 mb-6">
              {description}
            </p>

            {objectiveText && (
              <p className="text-lg font-medium text-gray-800 mb-3">
                {objectiveText}
              </p>
            )}

            {/* Highlighted Text */}
            <p className="text-2xl sm:text-3xl font-bold text-[#EA580C]">
              {highlightedText}
            </p>
          </div>

          {/* Decorative Circle */}
          <div 
            className="absolute bottom-0 right-0 w-64 h-64 bg-yellow-300 rounded-full opacity-50 translate-x-1/3 translate-y-1/3" 
            aria-hidden="true" 
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;