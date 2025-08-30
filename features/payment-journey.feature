Feature: Jornada de Pagamento
  Como um usuário interessado no programa de mentoria
  Eu quero realizar um pagamento de forma segura e eficiente
  Para ter acesso ao conteúdo do programa

  Background:
    Given que estou na página de pagamento
    And os métodos de pagamento estão disponíveis

  @pix @payment
  Scenario: Pagamento bem-sucedido via PIX
    Given que selecionei o plano "Básico" de R$ 100,00
    When eu escolho o método de pagamento "PIX"
    And clico em "Gerar QR Code PIX"
    Then devo ver o QR Code do PIX
    And devo ver as informações de pagamento
    And devo ver o tempo de expiração de 15 minutos
    When o pagamento PIX é confirmado
    Then devo ver a confirmação de pagamento
    And meu acesso deve ser liberado imediatamente

  @bitcoin @payment
  Scenario: Pagamento bem-sucedido via Bitcoin
    Given que selecionei o plano "Básico" de R$ 100,00
    When eu escolho o método de pagamento "Bitcoin"
    Then devo ver o desconto de 5% aplicado
    And o valor final deve ser R$ 95,00
    When clico em "Gerar Endereço Bitcoin"
    Then devo ver o endereço Bitcoin
    And devo ver o QR Code Bitcoin
    And devo ver o valor em BTC
    When a transação Bitcoin é confirmada
    Then devo ver a confirmação de pagamento
    And meu acesso deve ser liberado

  @usdt @payment
  Scenario: Pagamento bem-sucedido via USDT
    Given que selecionei o plano "Básico" de R$ 100,00
    When eu escolho o método de pagamento "USDT"
    Then devo ver o desconto de 3% aplicado
    And o valor final deve ser R$ 97,00
    When clico em "Gerar Endereço USDT"
    Then devo ver o endereço USDT
    And devo ver a rede selecionada "TRC20"
    And devo ver o valor em USDT
    When a transação USDT é confirmada
    Then devo ver a confirmação de pagamento
    And meu acesso deve ser liberado

  @payment @validation
  Scenario: Validação de dados de pagamento
    Given que estou preenchendo os dados de pagamento
    When eu deixo campos obrigatórios em branco
    Then devo ver mensagens de erro de validação
    And o botão de pagamento deve estar desabilitado
    When eu preencho todos os campos corretamente
    Then as mensagens de erro devem desaparecer
    And o botão de pagamento deve estar habilitado

  @payment @error
  Scenario: Erro na criação do pagamento PIX
    Given que selecionei o plano "Básico" de R$ 100,00
    And que escolhi o método de pagamento "PIX"
    When ocorre um erro no servidor ao gerar o PIX
    Then devo ver uma mensagem de erro
    And devo ter a opção de tentar novamente
    When clico em "Tentar novamente"
    Then o processo de pagamento deve ser reiniciado

  @payment @timeout
  Scenario: Timeout do pagamento PIX
    Given que gerei um QR Code PIX
    And que o pagamento não foi realizado
    When o tempo de expiração de 15 minutos é atingido
    Then devo ver uma mensagem de expiração
    And devo ter a opção de gerar um novo QR Code
    When clico em "Gerar novo QR Code"
    Then um novo QR Code deve ser gerado
    And o timer deve ser reiniciado

  @payment @status
  Scenario: Verificação de status do pagamento
    Given que gerei um pagamento PIX
    When o sistema verifica o status do pagamento
    Then devo ver o status "Aguardando pagamento"
    When o pagamento é confirmado pelo banco
    And o sistema verifica o status novamente
    Then devo ver o status "Pagamento confirmado"
    And devo ser redirecionado para a página de sucesso

  @payment @cancel
  Scenario: Cancelamento de pagamento
    Given que gerei um pagamento PIX
    And que o pagamento ainda não foi realizado
    When clico em "Cancelar pagamento"
    Then devo ver uma confirmação de cancelamento
    When confirmo o cancelamento
    Then o pagamento deve ser cancelado
    And devo retornar à seleção de métodos de pagamento

  @payment @multiple-methods
  Scenario: Comparação de métodos de pagamento
    Given que estou na seleção de métodos de pagamento
    Then devo ver todos os métodos disponíveis
    And devo ver os preços para cada método
    And devo ver os descontos aplicáveis
    When eu seleciono diferentes métodos
    Then devo ver as informações específicas de cada método
    And devo ver as vantagens de cada opção

  @payment @mobile
  Scenario: Pagamento via dispositivo móvel
    Given que estou usando um dispositivo móvel
    And que selecionei o pagamento PIX
    When clico no QR Code
    Then devo ter a opção de copiar o código PIX
    When copio o código PIX
    Then devo ver uma confirmação de cópia
    And devo poder colar no app do banco

  @payment @security
  Scenario: Verificação de segurança do pagamento
    Given que estou realizando um pagamento
    Then devo ver indicadores de segurança
    And devo ver informações sobre criptografia
    And devo ver certificados de segurança
    When o pagamento é processado
    Then todos os dados devem ser transmitidos de forma segura
    And nenhuma informação sensível deve ser armazenada localmente
