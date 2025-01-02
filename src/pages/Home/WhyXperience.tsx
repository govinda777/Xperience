// Home/WhyXperience.tsx
import React from 'react';

interface FeatureProps {
  iconSrc: string;
  title: string;
  description: string;
}

interface Icons {
  simplicidade: string;
  facilidade: string;
  baixoCusto: string;
  resultados: string;
  comunidade: string;
}

interface Feature {
  iconSrc: string;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ iconSrc, title, description }) => (
  <div className="flex flex-col items-center text-center">
    <div className="mb-4 relative w-[70px] h-[70px] flex items-center justify-center">
      <img 
        src={iconSrc} 
        alt={title}
        className="w-full h-full object-contain"
      />
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-300 rounded-full" />
    </div>
    <h3 className="text-2xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600 max-w-[300px] text-base">
      {description}
    </p>
  </div>
);

const WhyXperience: React.FC = () => {
  const icons: Icons = {
    simplicidade: new URL('/public/home/por-que-xperience--simplicidade.png', import.meta.url).href,
    facilidade: new URL('/public/home/por-que-xperience--facilidade.png', import.meta.url).href,
    baixoCusto: new URL('/public/home/por-que-xperience--baixo-custo.png', import.meta.url).href,
    resultados: new URL('/public/home/por-que-xperience--resultados.png', import.meta.url).href,
    comunidade: new URL('/public/home/por-que-xperience--comunidade.png', import.meta.url).href
  };

  const topFeatures: Feature[] = [
    {
      iconSrc: icons.simplicidade,
      title: "Simplicidade",
      description: "Metodologia simplificada de coleta de dados."
    },
    {
      iconSrc: icons.facilidade,
      title: "Facilidade",
      description: "Acesso fácil e rápido ao que sua empresa precisa."
    },
    {
      iconSrc: icons.baixoCusto,
      title: "Baixo custo",
      description: "Preço acessível para você investir no melhor."
    }
  ];

  const bottomFeatures: Feature[] = [
    {
      iconSrc: icons.resultados,
      title: "Resultados",
      description: "Ferramentas para melhorar seus resultados de forma eficiente."
    },
    {
      iconSrc: icons.comunidade,
      title: "Comunidade",
      description: "Acesso a uma rede de empreendedores como você"
    }
  ];

  return (
    <section className="bg-white h-screen flex items-center">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-[40px] font-bold mb-4">
            Por que a Xperience
          </h2>
          <p className="text-gray-600 text-lg max-w-[1000px] mx-auto">
            Você contará com várias ferramentas para proporcionar experiências inesquecíveis 
            aos seus clientes e ao seu time. Pensamos na vivência de empreender como um todo.
          </p>
        </div>

        <div className="space-y-16">
          {/* Top row - 3 items */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {topFeatures.map((feature, index) => (
              <Feature
                key={index}
                iconSrc={feature.iconSrc}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>

          {/* Bottom row - 2 items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[800px] mx-auto">
            {bottomFeatures.map((feature, index) => (
              <Feature
                key={index}
                iconSrc={feature.iconSrc}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyXperience;