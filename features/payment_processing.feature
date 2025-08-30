# language: pt
Funcionalidade: Processamento de Pagamentos
  Como um usuário da plataforma Xperience
  Eu quero processar pagamentos usando diferentes métodos
  Para que eu possa adquirir planos e acessar os serviços

  Contexto:
    Dado que o sistema de pagamentos está configurado
    E que existem planos disponíveis

  Cenário: Processar pagamento PIX com sucesso
    Dado que eu selecionei o plano "Básico" por R$ 100,00
    E que eu escolhi o método de pagamento "PIX"
    Quando eu iniciar o processo de pagamento
    Então deve ser gerado um QR Code PIX
    E deve ser exibida a URL de pagamento
    E o status do pagamento deve ser "pending"
    E deve haver um prazo de expiração de 30 minutos

  Cenário: Processar pagamento Bitcoin com sucesso
    Dado que eu selecionei o plano "Premium" por R$ 300,00
    E que eu escolhi o método de pagamento "Bitcoin"
    E que a cotação do Bitcoin está em R$ 300.000,00
    Quando eu iniciar o processo de pagamento
    Então deve ser gerado um endereço Bitcoin único
    E deve ser calculado o valor em BTC (0.001 BTC)
    E deve ser gerado um QR Code Bitcoin
    E o status do pagamento deve ser "pending"
    E deve haver um prazo de expiração de 1 hora

  Cenário: Processar pagamento USDT com sucesso
    Dado que eu selecionei o plano "Premium" por R$ 550,00
    E que eu escolhi o método de pagamento "USDT"
    E que a cotação do USDT está em R$ 5,50
    Quando eu iniciar o processo de pagamento
    Então deve ser gerado um endereço Ethereum único
    E deve ser calculado o valor em USDT (100 USDT)
    E deve ser gerado um QR Code USDT
    E o status do pagamento deve ser "pending"
    E deve haver um prazo de expiração de 1 hora

  Cenário: Falha no processamento por provedor indisponível
    Dado que eu selecionei o plano "Básico" por R$ 100,00
    E que eu escolhi o método de pagamento "PIX"
    E que o provedor PIX está indisponível
    Quando eu iniciar o processo de pagamento
    Então deve ser exibida uma mensagem de erro
    E o erro deve conter o código "PROVIDER_NOT_FOUND"
    E deve ser oferecida a opção de tentar novamente

  Cenário: Falha na conversão de moeda
    Dado que eu selecionei o plano "Premium" por R$ 300,00
    E que eu escolhi o método de pagamento "Bitcoin"
    E que a API de cotação está indisponível
    Quando eu iniciar o processo de pagamento
    Então deve ser exibida uma mensagem de erro
    E o erro deve conter "Falha na conversão de moeda"
    E deve ser oferecida a opção de tentar novamente

  Cenário: Timeout no processamento
    Dado que eu selecionei o plano "Básico" por R$ 100,00
    E que eu escolhi o método de pagamento "PIX"
    E que o provedor PIX demora mais de 30 segundos para responder
    Quando eu iniciar o processo de pagamento
    Então deve ser exibida uma mensagem de timeout
    E deve ser oferecida a opção de tentar novamente
