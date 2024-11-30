import styled from "styled-components";

export const Header = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0.75rem 1.5rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 1024px) {
    padding: 0.75rem;
    flex-wrap: wrap;
    gap: 0.5rem;
    justify-content: center;
  }
`;

export const Logo = styled.div`
  flex-shrink: 0;
  
  img {
    height: 35px;
    width: auto;
  }

  @media (max-width: 1024px) {
    width: 100%;
    text-align: center;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: center;
  margin: 0 1rem;

  a {
    color: #1a1a1a;
    text-decoration: none;
    font-size: 0.95rem;
    font-weight: 500;
    transition: color 0.2s ease;
    white-space: nowrap;

    &:hover {
      color: #666;
    }
  }

  @media (max-width: 1024px) {
    width: 100%;
    margin: 0.5rem 0;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: 1024px) {
    width: 100%;
    justify-content: center;
  }
`;

export const LoginButton = styled.a`
  padding: 0.5rem 1.25rem;
  border: 1.5px solid #000;
  border-radius: 50px;
  color: #000;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #000;
    color: white;
  }
`;

export const SignUpButton = styled.a`
  padding: 0.5rem 1.25rem;
  background-color: #000;
  border: 1.5px solid #000;
  border-radius: 50px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background-color: #333;
    border-color: #333;
  }
`;