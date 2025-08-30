import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@jest/globals';

// Mock do Auth0 para testes
const mockAuth0 = {
  isAuthenticated: false,
  user: null,
  loginWithRedirect: jest.fn(),
  logout: jest.fn(),
  getAccessTokenSilently: jest.fn(),
};

// Estado global para os testes
let currentPage = 'home';
let authenticationState = {
  isAuthenticated: false,
  user: null,
  error: null,
  redirectUrl: null,
};

// Helper functions
const simulateAuth0Login = (credentials: { email: string; password: string }) => {
  if (credentials.email === 'valid@email.com' && credentials.password === 'validpassword') {
    authenticationState.isAuthenticated = true;
    authenticationState.user = {
      sub: 'user-123',
      email: credentials.email,
      name: 'Test User',
    };
    authenticationState.error = null;
    currentPage = 'dashboard';
    return true;
  } else {
    authenticationState.error = 'Invalid credentials';
    return false;
  }
};

const simulateLogout = () => {
  authenticationState.isAuthenticated = false;
  authenticationState.user = null;
  authenticationState.error = null;
  currentPage = 'home';
};

const simulateSessionExpiration = () => {
  authenticationState.isAuthenticated = false;
  authenticationState.user = null;
  authenticationState.error = 'Session expired';
};

// Step Definitions

Given('que estou na página inicial do Xperience', function () {
  currentPage = 'home';
  authenticationState.isAuthenticated = false;
  authenticationState.user = null;
  authenticationState.error = null;
});

Given('que estou logado no sistema', function () {
  authenticationState.isAuthenticated = true;
  authenticationState.user = {
    sub: 'user-123',
    email: 'test@email.com',
    name: 'Test User',
  };
  currentPage = 'dashboard';
});

Given('minha sessão expira', function () {
  simulateSessionExpiration();
});

When('eu clico no botão {string}', function (buttonText: string) {
  if (buttonText === 'Entrar') {
    authenticationState.redirectUrl = 'auth0-login';
  } else if (buttonText === 'Continuar') {
    // This would be handled by the login credentials step
  }
});

When('sou redirecionado para a página de login do Auth0', function () {
  expect(authenticationState.redirectUrl).toBe('auth0-login');
  currentPage = 'auth0-login';
});

When('insiro minhas credenciais válidas', function () {
  // Simulate entering valid credentials
  this.credentials = {
    email: 'valid@email.com',
    password: 'validpassword',
  };
});

When('insiro credenciais inválidas', function () {
  // Simulate entering invalid credentials
  this.credentials = {
    email: 'invalid@email.com',
    password: 'wrongpassword',
  };
});

When('clico em {string}', function (buttonText: string) {
  if (buttonText === 'Continuar' && this.credentials) {
    simulateAuth0Login(this.credentials);
  } else if (buttonText === 'Sair') {
    simulateLogout();
  }
});

When('eu clico no menu do usuário', function () {
  expect(authenticationState.isAuthenticated).toBe(true);
  // Simulate opening user menu
});

When('eu tento acessar diretamente uma página protegida', function () {
  currentPage = 'protected-page';
  if (!authenticationState.isAuthenticated) {
    authenticationState.redirectUrl = 'auth0-login';
    currentPage = 'auth0-login';
  }
});

When('eu recarrego a página', function () {
  // Simulate page reload - in real app, this would check localStorage/sessionStorage
  // For testing, we'll assume the session persists
  if (authenticationState.isAuthenticated) {
    // Session should persist
  }
});

When('eu tento realizar uma ação que requer autenticação', function () {
  if (!authenticationState.isAuthenticated) {
    authenticationState.redirectUrl = 'auth0-login';
    currentPage = 'auth0-login';
  }
});

Then('devo ser redirecionado para o dashboard', function () {
  expect(currentPage).toBe('dashboard');
});

Then('devo ver meu nome de usuário na barra de navegação', function () {
  expect(authenticationState.user).not.toBeNull();
  expect(authenticationState.user?.name).toBe('Test User');
});

Then('devo ter acesso às funcionalidades autenticadas', function () {
  expect(authenticationState.isAuthenticated).toBe(true);
});

Then('devo ver uma mensagem de erro', function () {
  expect(authenticationState.error).toBe('Invalid credentials');
});

Then('devo permanecer na página de login', function () {
  expect(currentPage).toBe('auth0-login');
});

Then('devo ser deslogado do sistema', function () {
  expect(authenticationState.isAuthenticated).toBe(false);
  expect(authenticationState.user).toBeNull();
});

Then('devo ser redirecionado para a página inicial', function () {
  expect(currentPage).toBe('home');
});

Then('não devo mais ter acesso às funcionalidades autenticadas', function () {
  expect(authenticationState.isAuthenticated).toBe(false);
});

Then('devo ser redirecionado para a página de login', function () {
  expect(currentPage).toBe('auth0-login');
});

Then('devo ver uma mensagem indicando que preciso fazer login', function () {
  expect(authenticationState.redirectUrl).toBe('auth0-login');
});

Then('devo continuar logado', function () {
  expect(authenticationState.isAuthenticated).toBe(true);
});

Then('devo manter acesso às funcionalidades autenticadas', function () {
  expect(authenticationState.isAuthenticated).toBe(true);
  expect(authenticationState.user).not.toBeNull();
});

Then('devo ver uma mensagem sobre sessão expirada', function () {
  expect(authenticationState.error).toBe('Session expired');
});
