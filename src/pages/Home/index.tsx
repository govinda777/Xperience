// pages/Home/index.tsx
import React from "react";
import Hero from "./Hero";
import Solutions from "./Solutions";
import WhyXperience from "./WhyXperience";
import CommunitySection from "./CommunitySection";
import PageTitle from "../../components/PageTitle";
import TestimonialSection from "./TestimonialSection";
import ContactForm from "../../components/ContactForm";
import SEOHead from "../../components/SEOHead";

const Home: React.FC = () => {
  const heroImage = new URL("/public/home/hero.png", import.meta.url).href;
  const solutionsImage = new URL("/public/home/solutions.png", import.meta.url)
    .href;

  return (
    <>
      <SEOHead
        title="Xperience - Mentoria de Excelência para Empreendedores"
        description="Transforme sua ideia em um negócio de sucesso com nossa mentoria especializada. Impulsione seu negócio com soluções estratégicas de alto impacto."
        keywords="mentoria empresarial, consultoria para empreendedores, estratégias de negócios, startup, empreendedorismo, consultoria empresarial"
        ogImage="/home/hero.png"
        canonical="https://xperience.com.br/"
      />
      <Hero
        title="Acelere sua jornada com"
        highlightedText="Mentoria Xperience"
        subtitle="e impulsione seu negócio"
        description="Descubra as melhores estratégias para valorizar sua empresa e encantar seus clientes de forma prática e"
        emphasizedText=" EFICAZ"
        buttonText="Começar agora"
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
      <WhyXperience />
      <CommunitySection />
      <PageTitle
        title="Venha construir experiências inesquecíveis para os seus clientes"
        highlightedWord="clientes"
      />
      <ContactForm isPageContact={false} />
      <TestimonialSection />
    </>
  );
};

export default Home;
