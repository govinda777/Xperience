// pages/Home/index.tsx
import React from 'react';
import Hero from '../../components/Hero';
import Solutions from './Solutions';

const Home: React.FC = () => {
  const heroImage = new URL('/public/home/hero.png', import.meta.url).href;
  const solutionsImage = new URL('/public/home/solutions.png', import.meta.url).href;

  return (
    <>
      <Hero 
        title="Explore nossa"
        highlightedText='"IA do empreendedor"'
        subtitle="e avalie o seu negócio"
        description="Descubra como valorizar sua empresa e encantar seus clientes de forma rápida e"
        emphasizedText=" GRATUITA"
        buttonText="Descubra"
        imageSrc={heroImage}
        imageAlt="Empreendedor"
      />
      <Solutions
        title="Impulsione seu"
        subtitle="negócio com soluções práticas e inovadoras"
        description="Na Xperience Consultoria Empresarial, oferecemos soluções práticas e imediatas para pequenos e empreendedores, combinando a experiência humana com a inovação da Inteligência Artificial. Somos especialistas em ajudar pequenos empreendedores a otimizar seus negócios de forma simples, eficiente e de impacto imediato."
        linkText="Conheça todas as soluções"
        solutionsImageSrc={solutionsImage}
      />
    </>
  );
};

export default Home;