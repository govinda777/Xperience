# language: pt
Funcionalidade: Gerenciamento de Carteira
  Como um usuário autenticado no sistema
  Eu quero gerenciar minha carteira digital
  Para realizar transações e acompanhar meu saldo

  Contexto:
    Dado que estou logado no sistema
    E tenho uma carteira digital configurada

  Cenário: Visualização de informações da carteira
    Quando eu acesso a página da carteira
    Então devo ver meu endereço da carteira
    E devo ver meu endereço da conta inteligente
    E devo ver meu saldo atual
    E devo ver o histórico de transações

  Cenário: Inicialização automática da carteira
    Dado que sou um novo usuário autenticado
    Quando eu acesso o sistema pela primeira vez
    Então uma carteira deve ser criada automaticamente
    E devo ver as informações da nova carteira
    E o saldo inicial deve ser zero

  Cenário: Envio de transação bem-sucedida
    Dado que tenho saldo suficiente na carteira
    Quando eu preencho o formulário de transação:
      | Campo     | Valor                                      |
      | Destinatário | 0x742d35Cc6634C0532925a3b8D4C9db4C0532925a |
      | Valor     | 0.5                                        |
    E clico em "Enviar"
    Então devo ver uma confirmação da transação
    E o hash da transação deve ser exibido
    E meu saldo deve ser atualizado
    E a transação deve aparecer no histórico

  Cenário: Tentativa de envio sem saldo suficiente
    Dado que não tenho saldo suficiente na carteira
    Quando eu tento enviar uma transação de valor maior que meu saldo
    Então devo ver uma mensagem de erro "Saldo insuficiente"
    E a transação não deve ser processada

  Cenário: Envio de transação com endereço inválido
    Quando eu preencho o formulário de transação com endereço inválido:
      | Campo     | Valor           |
      | Destinatário | endereço-inválido |
      | Valor     | 0.1             |
    E clico em "Enviar"
    Então devo ver uma mensagem de erro "Endereço inválido"
    E a transação não deve ser processada

  Cenário: Atualização de saldo
    Dado que estou na página da carteira
    Quando eu clico em "Atualizar Saldo"
    Então o saldo deve ser recarregado
    E devo ver o saldo mais recente
    E o indicador de carregamento deve ser exibido durante a atualização

  Cenário: Histórico de transações
    Dado que realizei várias transações
    Quando eu acesso o histórico de transações
    Então devo ver uma lista das transações ordenadas por data
    E cada transação deve mostrar:
      | Informação | Descrição                    |
      | Hash       | Hash da transação            |
      | Valor      | Valor enviado/recebido       |
      | Data       | Data e hora da transação     |
      | Status     | Status da transação          |
      | Destinatário | Endereço de destino        |

  Cenário: Falha na inicialização da carteira
    Dado que sou um usuário autenticado
    Quando ocorre um erro na criação da carteira
    Então devo ver uma mensagem de erro "Falha ao inicializar carteira"
    E devo ter a opção de tentar novamente
    Quando eu clico em "Tentar Novamente"
    Então o processo de inicialização deve ser repetido

  Cenário: Falha no envio de transação
    Dado que tenho uma carteira configurada
    Quando eu tento enviar uma transação
    E ocorre um erro no processamento
    Então devo ver uma mensagem de erro "Falha ao enviar transação"
    E a transação deve ser marcada como falhada
    E meu saldo não deve ser alterado

  Cenário: Estados de carregamento
    Quando eu realizo operações na carteira
    Então devo ver indicadores de carregamento apropriados:
      | Operação              | Indicador                    |
      | Inicialização         | "Inicializando carteira..."  |
      | Envio de transação    | "Enviando transação..."      |
      | Atualização de saldo  | "Atualizando saldo..."       |
      | Carregamento histórico| "Carregando histórico..."    |

  Cenário: Integração com Auth0
    Dado que estou usando Auth0 para autenticação
    Quando minha sessão expira
    Então as informações da carteira devem ser limpos
    E devo ser redirecionado para login
    Quando eu faço login novamente
    Então minha carteira deve ser recarregada automaticamente

  Cenário: Responsividade da interface
    Quando eu acesso a carteira em diferentes dispositivos
    Então a interface deve se adaptar ao tamanho da tela:
      | Dispositivo | Comportamento                           |
      | Desktop     | Layout completo com sidebar            |
      | Tablet      | Layout adaptado com navegação colapsada |
      | Mobile      | Layout mobile com navegação em menu    |

  Cenário: Segurança da carteira
    Dado que tenho uma carteira ativa
    Quando eu deixo a aplicação inativa por muito tempo
    Então devo ser deslogado automaticamente por segurança
    E as informações sensíveis devem ser limpas da memória
    Quando eu faço login novamente
    Então devo reinicializar minha carteira
