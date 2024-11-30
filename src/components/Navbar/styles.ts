import styled from "styled-components";

export const Header = styled.header`
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  width: 100%;
  flex-wrap: wrap;
  gap: 1rem;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
  }
`;

export const Logo = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: black;
  
  img {
    height: 40px;
    max-width: 100%;
  }
`;

export const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column;
  }
`;