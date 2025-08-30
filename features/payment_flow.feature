# language: pt
Funcionalidade: Fluxo de Pagamento
  Como um usuário interessado no programa de mentoria
  Eu quero realizar o pagamento de um plano
  Para ter acesso ao conteúdo do programa

  Contexto:
    Dado que estou logado no sistema
    E estou na página de seleção de planos

  Cenário: Seleção de método de pagamento PIX
    Quando eu seleciono o plano "Essencial"
    E clico em "Assinar Agora"
    E seleciono "PIX" como método de pagamento
    Então devo ver o preço "R$ 297,00"
    E devo ver as informações sobre pagamento instantâneo
    E devo ver o botão "Continuar com PIX"

  Cenário: Processamento de pagamento PIX bem-sucedido
    Dado que selecionei o plano "Essencial"
    E escolhi "PIX" como método de pagamento
    Quando eu clico em "Continuar com PIX"
    Então devo ver um QR Code para pagamento
    E devo ver a chave PIX para cópia
    E devo ver o valor "R$ 297,00"
    E devo ver o tempo de expiração do pagamento
    Quando eu realizo o pagamento via PIX
    Então o status deve mudar para "Pagamento Confirmado"
    E devo ter acesso ao conteúdo do programa

  Cenário: Seleção de método de pagamento Bitcoin
    Quando eu seleciono o plano "Expert"
    E clico em "Assinar Agora"
    E seleciono "Bitcoin" como método de pagamento
    Então devo ver o preço com desconto de 5%
    E devo ver as informações sobre pagamento descentralizado
    E devo ver o badge "5% OFF"

  Cenário: Processamento de pagamento Bitcoin
    Dado que selecionei o plano "Expert"
    E escolhi "Bitcoin" como método de pagamento
    Quando eu clico em "Continuar com Bitcoin"
    Então devo ver o endereço Bitcoin para pagamento
    E devo ver o QR Code do endereço
    E devo ver o valor em BTC
    E devo ver o tempo estimado de confirmação
    Quando eu envio o Bitcoin para o endereço
    Então o status deve mudar para "Processando Pagamento"
    E após a confirmação na blockchain o status deve mudar para "Pagamento Confirmado"

  Cenário: Seleção de método de pagamento USDT
    Quando eu seleciono o plano "Premium"
    E clico em "Assinar Agora"
    E seleciono "USDT" como método de pagamento
    Então devo ver o preço com desconto de 3%
    E devo ver as informações sobre stablecoin
    E devo ver o badge "3% OFF"

  Cenário: Processamento de pagamento USDT
    Dado que selecionei o plano "Premium"
    E escolhi "USDT" como método de pagamento
    Quando eu clico em "Continuar com USDT"
    Então devo ver o endereço USDT para pagamento
    E devo ver o QR Code do endereço
    E devo ver o valor em USDT
    Quando eu envio o USDT para o endereço
    Então o status deve mudar para "Processando Pagamento"
    E após a confirmação o status deve mudar para "Pagamento Confirmado"

  Cenário: Seleção de método de pagamento GitHub
    Quando eu seleciono o plano "Essencial"
    E clico em "Assinar Agora"
    E seleciono "GitHub Pay" como método de pagamento
    Então devo ver o preço em USD
    E devo ver as informações sobre patrocínio via GitHub
    E devo ver o badge "NOVO"

  Cenário: Cancelamento de pagamento
    Dado que iniciei um processo de pagamento
    E estou na tela de pagamento pendente
    Quando eu clico em "Cancelar"
    Então devo ver uma confirmação de cancelamento
    Quando eu confirmo o cancelamento
    Então o pagamento deve ser cancelado
    E devo retornar à página de seleção de planos

  Cenário: Expiração de pagamento
    Dado que iniciei um pagamento via PIX
    E não realizei o pagamento dentro do prazo
    Quando o tempo de expiração é atingido
    Então o status deve mudar para "Pagamento Expirado"
    E devo ver a opção "Gerar Novo Pagamento"
    Quando eu clico em "Gerar Novo Pagamento"
    Então um novo QR Code deve ser gerado

  Cenário: Falha no processamento de pagamento
    Dado que iniciei um pagamento
    Quando ocorre um erro no processamento
    Então o status deve mudar para "Pagamento Falhou"
    E devo ver a mensagem de erro
    E devo ver a opção "Tentar Novamente"
    Quando eu clico em "Tentar Novamente"
    Então devo retornar ao processo de pagamento

  Cenário: Verificação de status de pagamento
    Dado que realizei um pagamento
    Quando eu acesso a página de histórico de pagamentos
    Então devo ver o status atual do pagamento
    E devo ver os detalhes da transação
    E devo poder verificar o status atualizado

  Cenário: Múltiplos métodos de pagamento disponíveis
    Quando eu estou na seleção de método de pagamento
    Então devo ver todos os métodos disponíveis:
      | Método  | Desconto | Tempo de Confirmação |
      | PIX     | 0%       | Instantâneo          |
      | Bitcoin | 5%       | 30 minutos           |
      | USDT    | 3%       | 10 minutos           |
      | GitHub  | 0%       | Manual               |
    E devo poder alternar entre os métodos
    E os preços devem ser atualizados automaticamente
