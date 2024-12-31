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
  padding: 6rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 3rem 0;
  }
`;

export const HeroContent = styled.div`
  h1 {
    font-size: 4rem;
    color: #000;
    margin-bottom: 2rem;
    line-height: 0.95;
    font-weight: 800;
    letter-spacing: -0.03em;

    br {
      display: block;
      margin-bottom: 0.75rem;
      content: "";
    }

    .highlight {
      display: inline-block;
      font-family: 'Times New Roman', serif;
      font-style: italic;
      font-weight: 500;
      font-size: 3.5rem;
      margin: 0.5rem 0;
      letter-spacing: -0.01em;
      line-height: 1.1;
    }
  }

  p {
    font-size: 1.35rem;
    color: #000;
    margin-bottom: 3.5rem;
    max-width: 580px;
    line-height: 1.5;
    letter-spacing: -0.01em;

    strong {
      font-weight: 800;
      letter-spacing: 0;
    }
  }

  @media (max-width: 768px) {
    h1 {
      font-size: 3.5rem;

      .highlight {
        font-size: 3rem;
      }
    }

    p {
      margin: 0 auto 2.5rem auto;
      font-size: 1.2rem;
    }
  }
`;

export const HeroImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;

  img {
    width: 100%;
    height: auto;
    max-width: 450px;
    object-fit: contain;
    position: relative;
    z-index: 2;
    margin-bottom: -2rem;
    margin-right: -2rem;
  }

  @media (max-width: 768px) {
    margin-top: 2rem;
    justify-content: center;
    align-items: center;
    
    img {
      max-width: 80%;
      margin: 0;
    }
  }
`;

export const DiscoverButton = styled.button`
  background: #000;
  color: white;
  border: none;
  border-radius: 35px;
  padding: 1.25rem 3rem;
  font-size: 1.25rem;
  font-weight: 600;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease-in-out;
  letter-spacing: -0.01em;
  
  span {
    font-size: 1.4rem;
    margin-top: -2px;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    margin: 0 auto;
    padding: 1rem 2.5rem;
    font-size: 1.15rem;
  }
`;