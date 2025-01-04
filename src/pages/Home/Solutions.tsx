import React from 'react';

interface SolutionsProps {
  title: string;
  subtitle: string;
  description: string;
  linkText: string;
  solutionsImageSrc: string;
  solutionsImageAlt?: string;
}

const Solutions: React.FC<SolutionsProps> = ({
  title,
  subtitle,
  description,
  linkText,
  solutionsImageSrc,
  solutionsImageAlt = "Equipe trabalhando",
}) => {
  return (
    <div className="w-full min-h-screen bg-white relative">
      <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative">
        {/* Imagem */}
        <div className="relative h-screen">
          <div className="absolute inset-0">
            <img 
              src={solutionsImageSrc} 
              alt={solutionsImageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Conteúdo */}
        <div className="flex flex-col max-w-2xl py-24 px-4">
          <h2 className="text-gray-900 text-5xl font-bold mb-8">
            {title}
            <br />
            <span className="block mt-2">{subtitle}</span>
          </h2>
          
          <p className="text-gray-600 text-xl mb-8">
            {description}
          </p>

          <a 
            href="/solucoes" 
            className="text-orange-500 text-xl font-semibold flex items-center hover:text-orange-600 transition-colors"
          >
            {linkText}
            <svg 
              className="ml-2 w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Solutions;