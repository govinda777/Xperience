import React from 'react';
import { Header, Logo, Nav, ButtonsContainer, LoginButton, SignUpButton } from './styles';

const Navbar: React.FC = () => {
  return (
    <Header>
      <Logo>
      <img src="assets/logo.svg" alt="Xperience" />
      </Logo>
      <Nav>
        <a href="#">Soluções</a>
        <a href="#">Quem somos</a>
        <a href="#">Contato</a>
        <a href="#">Comunidade</a>
        <a href="#">Blog</a>
        <a href="#">Planos</a>
      </Nav>
      <ButtonsContainer>
        <LoginButton href="#">Login</LoginButton>
        <SignUpButton href="#">Primeiro acesso</SignUpButton>
      </ButtonsContainer>
    </Header>
  );
};

export default Navbar;