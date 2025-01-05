// pages/Home/index.tsx
import React from 'react';
import Hero from './Hero';
import Solutions from './Solutions';
import IaDoEmpreendedor from './IaDoEmpreendedor';
import WhyXperience from './WhyXperience';
import CommunitySection from './CommunitySection';
import PageTitle from '../../components/PageTitle';
import TestimonialSection from './TestimonialSection';
import ContactForm from '../../components/ContactForm';

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
      <IaDoEmpreendedor
        title="IA do Empreendedor"
        subtitle="chatbot Xperience"
        description="Nossa nova ferramenta, IA do Empreendedor, permite que você faça uma avaliação rápida e personalizada do seu comércio e descubra oportunidades de melhoria em minutos."
        highlightPart1="TUDO DE FORMA"
        highlightPart2="GRATUITA!"
        buttonText="Explore a IA"
      />
      <WhyXperience />
      <CommunitySection />
      <PageTitle
        title="Venha construir experiências inesquecíveis para os seus clientes"
        highlightedWord="clientes"
      />
      <ContactForm />
      <TestimonialSection />
    </>
  );
};

export default Home;