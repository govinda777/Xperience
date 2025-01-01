
// components/Hero/index.tsx
import React from 'react';

interface HeroProps {
  title: string;
  highlightedText: string;
  subtitle: string;
  description: string;
  emphasizedText: string;
  buttonText: string;
  buttonIcon?: React.ReactNode;
  imageSrc: string;
  imageAlt: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  highlightedText,
  subtitle,
  description,
  emphasizedText,
  buttonText,
  buttonIcon = "✨",
  imageSrc,
  imageAlt
}) => {
  return (
    <div className="w-full">
      <div className="max-w-none px-4 md:pr-0 md:pl-[calc((100%-74rem)/2)] grid grid-cols-1 md:grid-cols-2 gap-8 py-24 md:py-16 items-center relative overflow-hidden">
        <div className="flex flex-col max-w-2xl ml-auto">
          <h1 className="text-white text-6xl font-normal leading-tight mb-4">
            {title}
            <br />
            <span className="text-white text-[50px] font-bold block my-2">
              {highlightedText}
            </span>
            <span className="text-white text-7xl">
              {subtitle}
            </span>
          </h1>
          
          <p className="text-white text-2xl mb-12 max-w-2xl">
            {description}
            <span className="font-bold">{emphasizedText}</span>
          </p>

          <button className="bg-black text-white text-2xl font-medium rounded-full px-12 py-4 w-fit flex items-center gap-2 hover:shadow-lg transition-all">
            {buttonText}
            <span className="inline-block ml-1">{buttonIcon}</span>
          </button>
        </div>

        <div className="absolute right-0 bottom-0 hidden md:block">
          <img 
            src={imageSrc}
            alt={imageAlt} 
            className="w-[500px] h-auto"
          />
        </div>
        <div className="block md:hidden relative flex justify-end items-end">
          <img 
            src={imageSrc}
            alt={imageAlt}
            className="w-full max-w-[500px] h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;