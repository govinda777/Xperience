import styled from "styled-components";

const BREAKPOINT = "1024px";
const TRANSITION = "all 0.2s ease";
const BORDER_RADIUS = "100px";

// Common button styles
const ButtonBase = styled.a`
  padding: 0.6875rem 1.625rem;
  border: 1.5px solid #000;
  border-radius: ${BORDER_RADIUS};
  font-weight: 500;
  font-size: 0.9375rem;
  transition: ${TRANSITION};
  white-space: nowrap;
  letter-spacing: 0.2px;
  text-decoration: none;

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${BREAKPOINT}) {
    width: 100%;
    text-align: center;
  }
`;

export const Header = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 1.25rem 4.5rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
  transition: ${TRANSITION};

  &:hover {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  }

  @media (max-width: ${BREAKPOINT}) {
    padding: 1rem;
    flex-wrap: wrap;
    gap: 0.75rem;
    justify-content: center;
  }
`;

export const Logo = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  
  img {
    height: 32px;
    width: auto;
    transition: ${TRANSITION};
    
    &:hover {
      transform: scale(1.02);
    }
  }

  @media (max-width: ${BREAKPOINT}) {
    width: 100%;
    justify-content: center;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 2.75rem;
  align-items: center;
  justify-content: center;
  margin: 0 3rem;

  a {
    color: #1E1E1E;
    text-decoration: none;
    font-size: 0.9375rem;
    font-weight: 400;
    transition: ${TRANSITION};
    white-space: nowrap;
    position: relative;
    letter-spacing: 0.2px;

    &:after {
      content: '';
      position: absolute;
      width: 0;
      height: 2px;
      bottom: -4px;
      left: 0;
      background-color: #000;
      transition: width 0.2s ease;
      border-radius: 2px;
    }

    &:hover {
      color: #000;
      &:after { width: 100%; }
    }
  }

  @media (max-width: ${BREAKPOINT}) {
    width: 100%;
    margin: 0.75rem 0;
    flex-wrap: wrap;
    gap: 1.5rem;
  }
`;

export const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-shrink: 0;

  @media (max-width: ${BREAKPOINT}) {
    width: 100%;
    justify-content: center;
  }
`;

export const LoginButton = styled(ButtonBase)`
  color: #000;
  background-color: transparent;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

export const SignUpButton = styled(ButtonBase)`
  background-color: #000;
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #1a1a1a;
    border-color: #1a1a1a;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;