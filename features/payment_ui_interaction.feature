# language: pt
Funcionalidade: Interação com Interface de Pagamentos
  Como um usuário da plataforma Xperience
  Eu quero interagir com a interface de pagamentos de forma intuitiva
  Para que eu possa completar meus pagamentos facilmente

  Contexto:
    Dado que estou na página de seleção de pagamento
    E que existem métodos de pagamento disponíveis

  Cenário: Selecionar método de pagamento PIX
    Quando eu clicar no método de pagamento "PIX"
    Então o método PIX deve ficar selecionado
    E deve ser exibido o preço em reais
    E devem ser mostradas as características do PIX
    E deve ser exibido o ícone do PIX

  Cenário: Selecionar método de pagamento Bitcoin com desconto
    Quando eu clicar no método de pagamento "Bitcoin"
    Então o método Bitcoin deve ficar selecionado
    E deve ser exibido o preço com desconto de 5%
    E deve ser mostrada a badge "5% OFF"
    E devem ser mostradas as características do Bitcoin
    E deve ser exibido o ícone do Bitcoin

  Cenário: Selecionar método de pagamento USDT com desconto
    Quando eu clicar no método de pagamento "USDT"
    Então o método USDT deve ficar selecionado
    E deve ser exibido o preço com desconto de 2%
    E deve ser mostrada a badge "2% OFF"
    E devem ser mostradas as características do USDT
    E deve ser exibido o ícone do USDT

  Cenário: Navegar entre métodos de pagamento com teclado
    Dado que o método PIX está selecionado
    Quando eu pressionar a tecla Tab
    Então o foco deve mover para o método Bitcoin
    Quando eu pressionar a tecla Enter
    Então o método Bitcoin deve ficar selecionado

  Cenário: Exibir modal de status de pagamento pendente
    Dado que iniciei um pagamento PIX
    Quando o modal de status for exibido
    Então deve mostrar o título "Aguardando Pagamento"
    E deve exibir o QR Code para pagamento
    E deve mostrar o valor a ser pago
    E deve exibir o ID da transação
    E deve mostrar o tempo restante para expiração
    E deve ter um botão "Pagar com PIX"
    E deve ter um botão "Copiar Código"

  Cenário: Copiar código PIX para área de transferência
    Dado que o modal de pagamento PIX está aberto
    Quando eu clicar no botão "Copiar Código"
    Então o código PIX deve ser copiado para a área de transferência
    E deve ser exibida a mensagem "Copiado!"
    E a mensagem deve desaparecer após 2 segundos

  Cenário: Abrir URL de pagamento PIX
    Dado que o modal de pagamento PIX está aberto
    Quando eu clicar no botão "Pagar com PIX"
    Então deve ser aberta uma nova aba com a URL do Mercado Pago
    E a URL deve conter o ID da preferência

  Cenário: Fechar modal com tecla Escape
    Dado que o modal de pagamento está aberto
    Quando eu pressionar a tecla Escape
    Então o modal deve ser fechado
    E deve ser chamada a função onClose

  Cenário: Fechar modal clicando no backdrop
    Dado que o modal de pagamento está aberto
    Quando eu clicar fora da área do modal
    Então o modal deve ser fechado
    E deve ser chamada a função onClose

  Cenário: Não fechar modal clicando no conteúdo
    Dado que o modal de pagamento está aberto
    Quando eu clicar dentro da área do modal
    Então o modal deve permanecer aberto
    E a função onClose não deve ser chamada

  Cenário: Exibir countdown de expiração em vermelho quando próximo do fim
    Dado que o modal de pagamento está aberto
    E que restam menos de 5 minutos para expiração
    Quando o countdown for atualizado
    Então o texto do countdown deve ficar vermelho
    E deve ser exibido um ícone de alerta

  Cenário: Tentar novamente após falha no pagamento
    Dado que o pagamento falhou
    E que o modal de erro está exibido
    Quando eu clicar no botão "Tentar Novamente"
    Então deve ser chamada a função onRetry
    E o modal deve ser fechado

  Cenário: Continuar após pagamento bem-sucedido
    Dado que o pagamento foi confirmado
    E que o modal de sucesso está exibido
    Quando eu clicar no botão "Continuar"
    Então deve ser chamada a função onClose
    E o modal deve ser fechado

  Cenário: Métodos de pagamento desabilitados
    Dado que os métodos de pagamento estão desabilitados
    Quando eu tentar clicar em qualquer método
    Então nenhum método deve ser selecionado
    E os métodos devem aparecer com opacidade reduzida
    E o cursor deve mostrar "não permitido"
