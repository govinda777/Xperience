
# Govinda Systems DAO - Ecomm Template

[![Cypress Tests](https://img.shields.io/endpoint?url=https://dashboard.cypress.io/badge/detailed/2ckppp/master&style=flat&logo=cypress)](https://dashboard.cypress.io/projects/2ckppp/runs)
[![Join our Slack!](https://img.shields.io/static/v1?message=join%20chat&color=9cf&logo=slack&label=slack)](https://join.slack.com/t/mermaid-talk/shared_invite/enQtNzc4NDIyNzk4OTAyLWVhYjQxOTI2OTg4YmE1ZmJkY2Y4MTU3ODliYmIwOTY3NDJlYjA0YjIyZTdkMDMyZTUwOGI0NjEzYmEwODcwOTE)
[![Netlify Status](https://api.netlify.com/api/v1/badges/27fa023d-7c73-4a3f-9791-b3b657a47100/deploy-status)](https://app.netlify.com/sites/mermaidjs/deploys)


> Um template inicial para criar uma TWA (Telegram Web App) que interage com a blockchain TON.

## Visão Geral

Este projeto é altamente opinativo, servindo como um ponto de partida para o desenvolvimento de aplicativos web no Telegram que interagem com a blockchain TON. Algumas características incluem:

- **Suporte a carteiras Ton Connect 2**
- **Utiliza Vite com React** (alternativa ao Create React App)
- **Usa o pacote `ton` do npm**

## Pré-requisitos

- **Node.js v16** (outras versões podem funcionar, mas precisam ser testadas)
- **Uma carteira compatível com Ton Connect** (por exemplo, [Tonkeeper](https://tonkeeper.com/))

## O que este repositório contém?

- Um aplicativo pronto para TWA baseado em React, interagindo com a TON
- Configurações do GitHub Actions para implantar o app no GitHub Pages
- Um script para conectar um bot do Telegram ao aplicativo implantado

## Como Usar

1. **Crie um repositório a partir deste template usando o botão "Use this template"**

   - Escolha um nome para o seu repositório
   - **IMPORTANTE:** Marque a opção "Include all branches" para que a implantação no GitHub Pages funcione corretamente.

     ![Incluir todas as branches](https://user-images.githubusercontent.com/5641469/191731317-14e742fd-accb-47d4-a794-fad01148a377.png)

2. **Clone o repositório e instale as dependências**

   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
   yarn
   # ou
   npm install
   ```

2.1 Para executar a pipeline na sua máquina local execute o comando abaixo:

    ```bash
    chmod +x pipeline.sh
    ```

3. **Crie um novo bot com o [BotFather](https://t.me/botfather)**

   - Digite `/newbot`
   - Escolha um nome para o seu bot (ex: `Meu Ecomm TWA`)
   - Escolha um nome de usuário para o seu bot (ex: `meu_ecomm_twa_bot`)
   - Anote o token de acesso fornecido (ex: `123456789:ABCdefGHIjklMNOpqrSTUvwxYZ`)
   - Execute `yarn configbot` ou `npm run configbot` para vincular seu bot ao aplicativo web

## Criando um novo Web App no Telegram

1. **Inicie uma conversa com o [BotFather](https://t.me/botfather)** e digite o comando `/newapp`.

   ```bash
   /newapp
   ```

2. **Selecione o bot que oferecerá o Web App**:
   - Escolha o bot que você criou anteriormente (por exemplo: `@govinda_systems_bot`).

3. **Digite um título para o Web App**:
   - Exemplo: `Govinda Systems E-comm`.

4. **Forneça uma breve descrição**:
   - Exemplo: `Template inicial de E-commerce utilizando TON blockchain e Telegram Web Apps (TWA)`.

5. **Envie uma imagem de visualização** (dimensões recomendadas: 640x360 pixels).

   - Depois de completar esses passos, o Web App estará pronto para ser vinculado ao bot e usado dentro do Telegram.

## Desenvolvimento

1. **Inicie o ambiente de desenvolvimento**

   ```bash
   npm run dev
   ```

2. **Edite o código conforme necessário**

   - O aplicativo recarregará automaticamente com as mudanças.

3. **Implantação automática**

   - Ao fazer push para a branch `main`, o aplicativo será implantado automaticamente via GitHub Actions.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests. Vamos construir juntos uma comunidade forte em torno deste projeto.

## Licença

Este projeto está licenciado sob a Licença MIT.
