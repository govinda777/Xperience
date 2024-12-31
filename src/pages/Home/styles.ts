import styled from "styled-components";

export const StyledApp = styled.div`
  background: #FD9526;
  min-height: 100vh;
  width: 100%;
`;

export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  width: 100%;
`;

export const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  align-items: center;
  padding: 1rem 0;
  
  a {
    color: #000;
    text-decoration: none;
    font-weight: 500;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

export const JoinButton = styled.button`
  background: transparent;
  border: 2px solid #000;
  border-radius: 25px;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

export const HeroSection = styled.div`
  padding: 4rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 2rem 0;
  }
`;

export const HeroContent = styled.div`
  h1 {
    font-size: 3.5rem;
    color: #000;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    font-weight: bold;
  }

  p {
    font-size: 1.25rem;
    color: #000;
    margin-bottom: 2rem;
    max-width: 600px;
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 2.5rem;
    }

    p {
      margin: 0 auto 2rem auto;
    }
  }
`;

export const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: auto;
    max-width: 500px;
    object-fit: contain;
    position: relative;
    z-index: 2;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
    
    img {
      max-width: 80%;
    }
  }
`;


export const ServicesSection = styled.section`
  padding: 4rem 0;
  background: #fff;
  border-radius: 2rem 2rem 0 0;
  margin-top: 4rem;
  
  h2 {
    font-size: 2.5rem;
    color: #000;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  p {
    text-align: center;
    font-size: 1.25rem;
    color: #666;
    margin-bottom: 3rem;
  }
`;

export const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem 0;
`;

export const ServiceCard = styled.div`
  background: #f8f8f8;
  padding: 2rem;
  border-radius: 1rem;
  
  h3 {
    font-size: 1.5rem;
    color: #000;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1rem;
    color: #666;
    text-align: left;
    margin-bottom: 0;
  }
`;

export const DiscoverButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    transform: translateY(-2px);
    transition: transform 0.2s;
  }

  @media (max-width: 768px) {
    margin: 0 auto;
  }
`;