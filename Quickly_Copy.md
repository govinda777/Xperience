# Guia Rápido: Criando sua própria DAO de Experiências

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Template](https://img.shields.io/badge/Template-Use%20Now-success)](https://github.com/xperience-dao/platform/generate)

> Este guia irá ajudá-lo a criar sua própria DAO de experiências utilizando o template Xperience. Em menos de 1 hora, você terá sua plataforma funcionando!

## 🚀 Início Rápido

### 1. Clone o Template

1. Acesse o [repositório Xperience](https://github.com/xperience-dao/platform)
2. Clique no botão verde "Use this template"
3. Escolha um nome para seu projeto
4. **IMPORTANTE:** Marque a opção "Include all branches"
5. Clique em "Create repository from template"

### 2. Configuração Inicial

```bash
# Clone seu novo repositório
git clone https://github.com/seu-usuario/seu-projeto.git

# Entre no diretório
cd seu-projeto

# Instale as dependências
npm install
```

### 3. Personalize sua DAO

1. **Edite o arquivo `config.js`**
   ```javascript
   // config/app.js
   export default {
     daoName: "Sua DAO",
     description: "Sua descrição",
     tokenSymbol: "TOKEN",
     // ... outras configurações
   }
   ```

2. **Atualize as imagens**
   - Substitua `/public/logo.png` com seu logo
   - Atualize `/public/images/` com suas próprias imagens

3. **Personalize os Smart Contracts**
   ```bash
   # Entre no diretório de contratos
   cd contracts
   
   # Edite os parâmetros do token
   nano TokenConfig.sol
   ```

### 4. Configure seu Bot do Telegram

1. **Crie um novo bot**
   - Abra o [@BotFather](https://t.me/botfather) no Telegram
   - Digite `/newbot`
   - Siga as instruções para nomear seu bot
   - Guarde o token fornecido

2. **Configure o Web App**
   ```bash
   # Execute o script de configuração
   npm run configbot
   
   # Siga as instruções do prompt
   ```

### 5. Implante sua DAO

```bash
# Configure suas variáveis de ambiente
cp .env.example .env

# Edite suas configurações
nano .env

# Implante os contratos
npm run deploy

# Inicie sua aplicação
npm run start
```

## 🎨 Personalizando sua Experiência

### Temas e Estilos
- Edite `/src/styles/theme.js` para suas cores
- Modifique `/src/styles/global.css` para estilos globais
- Atualize componentes em `/src/components/`

### Funcionalidades Principais

1. **Sistema de Tokens**
   - Configure emissão inicial
   - Defina mecanismos de distribuição
   - Estabeleça utilidades do token

2. **Governança**
   - Ajuste parâmetros de votação
   - Defina tipos de propostas
   - Configure quóruns

3. **Experiências**
   - Adicione categorias
   - Configure sistemas de avaliação
   - Defina regras de qualidade

## 📱 Aplicativo Telegram

### Personalize seu TWA (Telegram Web App)

1. **Atualize Metadados**
   ```bash
   # Configure seu app
   npm run config-twa
   ```

2. **Design do Bot**
   - Adicione comandos personalizados
   - Configure mensagens automáticas
   - Defina fluxos de interação

## 🔄 Próximos Passos

1. **Teste sua Plataforma**
   ```bash
   # Execute testes
   npm run test
   
   # Inicie ambiente de desenvolvimento
   npm run dev
   ```

2. **Prepare o Lançamento**
   - Configure domínio personalizado
   - Prepare materiais de marketing
   - Planeje estratégia de comunidade

## 🆘 Suporte

- Documentação completa: `/docs`
- Comunidade Discord: [Link]
- Issues no GitHub: [Link]

## 📝 Notas Importantes

- Mantenha backups de suas chaves privadas
- Teste em rede de testes antes do mainnet
- Considere uma auditoria de segurança
- Construa sua comunidade gradualmente

## 🔐 Segurança

- Implemente autenticação de dois fatores
- Use wallets seguras para tokens da DAO
- Mantenha timelock em ações críticas
- Faça backup regular dos dados

## 📜 Licença

Este template está sob a Licença MIT. Você pode usá-lo livremente em projetos comerciais e pessoais.

---

Desenvolvido com 💙 pela comunidade Xperience DAO