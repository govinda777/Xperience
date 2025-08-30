# language: pt
Funcionalidade: Verificação de Pagamentos
  Como um usuário da plataforma Xperience
  Eu quero verificar o status dos meus pagamentos
  Para que eu possa acompanhar o progresso e confirmação

  Contexto:
    Dado que o sistema de pagamentos está configurado
    E que existe um pagamento em andamento

  Cenário: Verificar pagamento PIX pendente
    Dado que existe um pagamento PIX com ID "pix-tx-123"
    E que o pagamento está com status "pending"
    Quando eu verificar o status do pagamento
    Então o status deve permanecer "pending"
    E deve ser exibido o QR Code para pagamento
    E deve ser mostrado o tempo restante para expiração

  Cenário: Verificar pagamento PIX aprovado
    Dado que existe um pagamento PIX com ID "pix-tx-123"
    E que o pagamento foi aprovado no Mercado Pago
    Quando eu verificar o status do pagamento
    Então o status deve ser atualizado para "completed"
    E deve ser exibida uma mensagem de sucesso
    E deve ser oferecida a opção de continuar

  Cenário: Verificar pagamento Bitcoin com confirmações insuficientes
    Dado que existe um pagamento Bitcoin com ID "btc-tx-456"
    E que a transação foi enviada mas tem 0 confirmações
    Quando eu verificar o status do pagamento
    Então o status deve ser "processing"
    E deve ser exibido o número de confirmações (0/1)
    E deve ser mostrada uma mensagem explicativa sobre confirmações

  Cenário: Verificar pagamento Bitcoin confirmado
    Dado que existe um pagamento Bitcoin com ID "btc-tx-456"
    E que a transação tem pelo menos 1 confirmação
    Quando eu verificar o status do pagamento
    Então o status deve ser atualizado para "completed"
    E deve ser exibida uma mensagem de sucesso
    E deve ser mostrado o hash da transação

  Cenário: Verificar pagamento USDT com confirmações insuficientes
    Dado que existe um pagamento USDT com ID "usdt-tx-789"
    E que a transação tem 5 confirmações na rede Ethereum
    Quando eu verificar o status do pagamento
    Então o status deve ser "processing"
    E deve ser exibido o número de confirmações (5/12)
    E deve ser mostrada uma estimativa de tempo para confirmação final

  Cenário: Verificar pagamento USDT confirmado
    Dado que existe um pagamento USDT com ID "usdt-tx-789"
    E que a transação tem 12 ou mais confirmações
    Quando eu verificar o status do pagamento
    Então o status deve ser atualizado para "completed"
    E deve ser exibida uma mensagem de sucesso
    E deve ser mostrado o hash da transação na Etherscan

  Cenário: Verificar pagamento expirado
    Dado que existe um pagamento PIX com ID "pix-tx-123"
    E que o tempo de expiração foi ultrapassado
    Quando eu verificar o status do pagamento
    Então o status deve ser "expired"
    E deve ser exibida uma mensagem de expiração
    E deve ser oferecida a opção de criar um novo pagamento

  Cenário: Verificar pagamento com erro de API
    Dado que existe um pagamento PIX com ID "pix-tx-123"
    E que a API do Mercado Pago está indisponível
    Quando eu verificar o status do pagamento
    Então o status deve ser "failed"
    E deve ser exibida uma mensagem de erro temporário
    E deve ser oferecida a opção de tentar verificar novamente

  Cenário: Verificar pagamento inexistente
    Dado que não existe um pagamento com ID "invalid-tx-999"
    Quando eu verificar o status do pagamento
    Então deve ser exibida uma mensagem de pagamento não encontrado
    E deve ser oferecida a opção de voltar à tela inicial
