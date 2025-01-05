// /pages/Solutions/IAReport.tsx

import React from 'react';

interface IAReportProps {
  imageLeft?: boolean;
  title?: string;          // Agora são opcionais
  description?: string;    // e substituídos por "..." se estiverem vazios
  bullets?: string[];
  buttonText?: string;
  imageSrc?: string;       // Agora é opcional, caso não seja enviado, usa placeholder
  imageAlt?: string;
}

const IAReport: React.FC<IAReportProps> = ({
  imageLeft = false,
  title = '...',
  description = '...',
  bullets = [],
  buttonText = '...',
  imageSrc = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0iI2Q4ZDhkOCIvPgo8L3N2Zz4=',
  imageAlt = 'Imagem do relatório'
}) => {

  // Define a ordem dos elementos com base em imageLeft
  const imageOrder = imageLeft ? 'order-1' : 'order-2';
  const textOrder = imageLeft ? 'order-2' : 'order-1';

  return (
    <section className="w-full bg-white h-[90vh] flex items-center">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 items-center">

        {/* Seção textual - ordem definida pela prop */}
        <div className={`${textOrder} md:${textOrder} flex flex-col justify-center`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title || '...'}
          </h2>

          <p className="text-lg text-gray-700 mb-6">
            {description || '...'}
          </p>

          <ul className="list-none space-y-3 mb-8">
            {bullets && bullets.length > 0 ? (
              bullets.map((item, index) => (
                <li className="flex items-start" key={index}>
                  <span className="text-orange-500 mr-2">»</span>
                  <span>{item}</span>
                </li>
              ))
            ) : (
              <li className="flex items-start">
                <span className="text-orange-500 mr-2">»</span>
                <span>...</span>
              </li>
            )}
          </ul>

          <button
            type="button"
            className="w-fit bg-orange-500 text-white text-lg font-semibold px-4 py-2
                       rounded-full hover:bg-orange-600 transition-colors"
          >
            {buttonText || '...'}
          </button>
        </div>

        {/* Imagem - ordem definida pela prop */}
        <div className={`${imageOrder} md:${imageOrder} flex justify-center md:justify-end`}>
          <img 
            src={imageSrc}
            alt={imageAlt}
            width="500"
            height="500"
            className="rounded"
          />
        </div>
      </div>
    </section>
  );
};

export default IAReport;
