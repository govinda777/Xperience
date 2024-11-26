// src/pages/Home/index.tsx
import React from 'react';
import {
  StyledApp,
  Container,
  HeroSection,
  HeroContent,
  ServicesSection,
  ServiceGrid,
  ServiceCard,
  DiscoverButton,
} from './styles';
import Navbar from '../../components/Navbar';

const Home: React.FC = () => {
  return (
    <StyledApp>
      <Container>
        <Navbar />
        <HeroSection>
          <HeroContent>
            <h1>
              Explore nossa
              <br />
              "IA do empreendedor"
              <br />
              e avalie o seu negócio
            </h1>
            <p>
              Descubra como valorizar sua empresa e encantar seus clientes de forma rápida e
              <strong> GRATUITA</strong>.
            </p>
            <DiscoverButton>
              Descubra <span>✨</span>
            </DiscoverButton>
          </HeroContent>
          <div>
            <img src="/empreendedora.png" alt="Empreendedor" style={{ maxWidth: '100%' }} />
          </div>
        </HeroSection>

        <ServicesSection>
          <h2>Nossos Serviços</h2>
          <p>Oferecemos soluções completas para impulsionar seu negócio</p>
          
          <ServiceGrid>
            <ServiceCard>
              <h3>Consultoria de Inovação</h3>
              <p>Auxílio na criação e implementação de estratégias que evitam a competição direta.</p>
            </ServiceCard>
            
            <ServiceCard>
              <h3>Desenvolvimento de Experiências</h3>
              <p>Apoio na concepção e desenvolvimento de experiências únicas para os clientes.</p>
            </ServiceCard>
            
            <ServiceCard>
              <h3>Análise de Viabilidade</h3>
              <p>Avaliações detalhadas sobre a viabilidade econômica de novos projetos.</p>
            </ServiceCard>
          </ServiceGrid>
        </ServicesSection>
      </Container>
    </StyledApp>
  );
};

export default Home;