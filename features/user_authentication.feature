# language: pt
Funcionalidade: Autenticação de Usuário
  Como um usuário do sistema Xperience
  Eu quero me autenticar na plataforma
  Para acessar o programa de mentoria

  Contexto:
    Dado que estou na página inicial do Xperience

  Cenário: Login bem-sucedido com Auth0
    Quando eu clico no botão "Entrar"
    E sou redirecionado para a página de login do Auth0
    E insiro minhas credenciais válidas
    E clico em "Continuar"
    Então devo ser redirecionado para o dashboard
    E devo ver meu nome de usuário na barra de navegação
    E devo ter acesso às funcionalidades autenticadas

  Cenário: Tentativa de login com credenciais inválidas
    Quando eu clico no botão "Entrar"
    E sou redirecionado para a página de login do Auth0
    E insiro credenciais inválidas
    E clico em "Continuar"
    Então devo ver uma mensagem de erro
    E devo permanecer na página de login

  Cenário: Logout do sistema
    Dado que estou logado no sistema
    Quando eu clico no menu do usuário
    E clico em "Sair"
    Então devo ser deslogado do sistema
    E devo ser redirecionado para a página inicial
    E não devo mais ter acesso às funcionalidades autenticadas

  Cenário: Acesso a página protegida sem autenticação
    Quando eu tento acessar diretamente uma página protegida
    Então devo ser redirecionado para a página de login
    E devo ver uma mensagem indicando que preciso fazer login

  Cenário: Persistência de sessão após recarregar página
    Dado que estou logado no sistema
    Quando eu recarrego a página
    Então devo continuar logado
    E devo manter acesso às funcionalidades autenticadas

  Cenário: Expiração de sessão
    Dado que estou logado no sistema
    E minha sessão expira
    Quando eu tento realizar uma ação que requer autenticação
    Então devo ser redirecionado para a página de login
    E devo ver uma mensagem sobre sessão expirada
