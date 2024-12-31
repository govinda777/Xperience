import React from 'react';
import {
  StyledApp,
  Container,
  HeroSection,
  HeroContent,
  DiscoverButton,
  HeroImageWrapper,
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
              <span className="highlight">"IA do empreendedor"</span>
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
          <HeroImageWrapper>
            <img src="/home/hero.png" alt="Empreendedor" />
          </HeroImageWrapper>
        </HeroSection>

      </Container>
    </StyledApp>
  );
};

export default Home;