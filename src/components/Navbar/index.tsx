// src/components/Navbar/index.tsx
import React from 'react';
import { Header, Logo, Nav } from './styles';

const Navbar: React.FC = () => {
  return (
    <Header>
      <Logo>
        <img src="/xperience-logo.png" alt="Xperience" />
      </Logo>
      <Nav>
        <a href="#">Soluções</a>
        <a href="#">Quem somos</a>
        <a href="#">Contato</a>
        <a href="#">Comunidade</a>
      </Nav>
    </Header>
  );
};

export default Navbar;