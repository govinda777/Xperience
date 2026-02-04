# Xperience

## Configuração das Variáveis de Ambiente

### Pré-requisitos

Antes de iniciar, você precisará configurar as variáveis de ambiente do projeto. O arquivo `.env.example` contém todas as variáveis necessárias.

### Passo a Passo

1. **Copie o arquivo de exemplo:**

```bash
cp .env.example .env
```

2. **Configure as variáveis de acordo com seu ambiente:**

#### Configuração Ethereum/Blockchain

- `VITE_RPC_URL`: URL do provedor RPC da rede Ethereum (ex: Alchemy, Infura)
  - Para Sepolia testnet: `https://eth-sepolia.g.alchemy.com/v2/SEU-API-KEY`
  - Obtenha sua chave API em: [Alchemy](https://www.alchemy.com/)

- `VITE_CHAIN_ID`: ID da rede blockchain
  - Sepolia: `11155111`
  - Mainnet: `1`

#### Configuração ERC-4337 (Account Abstraction)

- `VITE_ENTRYPOINT_ADDRESS`: Endereço do contrato EntryPoint
  - Padrão: `0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789`

- `VITE_BUNDLER_URL`: URL do serviço bundler para transações
  - Exemplo: `https://api.stackup.sh/v1/bundler/SEU-API-KEY`
  - Obtenha em: [Stackup](https://www.stackup.sh/)

- `VITE_PAYMASTER_URL`: URL do serviço paymaster (paga gas fees)
  - Exemplo: `https://api.stackup.sh/v1/paymaster/SEU-API-KEY`

- `VITE_FACTORY_ADDRESS`: Endereço do contrato factory de Account Abstraction
  - Padrão: `0x9406Cc6185a346906296840746125a0E44976454`

#### Configuração Auth0 (Autenticação - Opcional)

- `VITE_AUTH0_DOMAIN`: Domínio da sua aplicação Auth0
  - Exemplo: `dev-example.us.auth0.com`
  - Configure em: [Auth0 Dashboard](https://manage.auth0.com/)

- `VITE_AUTH0_CLIENT_ID`: ID do cliente Auth0
  - Obtenha no dashboard do Auth0

- `VITE_AUTH0_REDIRECT_URI`: URL de redirecionamento após autenticação
  - Desenvolvimento: `http://localhost:5173`
  - Produção: `https://seu-dominio.com`

#### Configuração Privy (Autenticação Web3)

- `VITE_PRIVY_APP_ID`: ID da aplicação Privy
  - Obtenha em: [Privy Dashboard](https://dashboard.privy.io/)
  - Exemplo: `cmdwdbrix009rky0ch4w7hgvm`

#### Configuração da Aplicação

- `VITE_APP_NAME`: Nome da aplicação
  - Padrão: `Xperience`

- `VITE_API_BASE_URL`: URL base da API backend
  - Desenvolvimento: `http://localhost:3000/api`
  - Produção: `https://api.seu-dominio.com`

### Exemplo de Arquivo .env Completo

```bash
# Ethereum Network Configuration
VITE_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/sua-chave-aqui
VITE_CHAIN_ID=11155111

# ERC-4337 Configuration
VITE_ENTRYPOINT_ADDRESS=0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789
VITE_BUNDLER_URL=https://api.stackup.sh/v1/bundler/sua-chave-aqui
VITE_PAYMASTER_URL=https://api.stackup.sh/v1/paymaster/sua-chave-aqui
VITE_FACTORY_ADDRESS=0x9406Cc6185a346906296840746125a0E44976454

# Auth0 Configuration (Opcional)
VITE_AUTH0_DOMAIN=dev-seu-dominio.us.auth0.com
VITE_AUTH0_CLIENT_ID=seu-client-id-aqui
VITE_AUTH0_REDIRECT_URI=http://localhost:5173

# Privy Configuration
VITE_PRIVY_APP_ID=seu-app-id-aqui

# Application Configuration
VITE_APP_NAME=Xperience
VITE_API_BASE_URL=http://localhost:3000/api
```

### Segurança

⚠️ **IMPORTANTE:**

- **NUNCA** commite o arquivo `.env` no repositório
- O arquivo `.env` está incluído no `.gitignore`
- Use o `.env.example` como referência
- Mantenha suas chaves API seguras e privadas
- Para produção, use variáveis de ambiente do sistema ou serviços como AWS Secrets Manager, Vercel Environment Variables, etc.

### Verificação

Após configurar, você pode verificar se as variáveis estão carregadas corretamente:

```bash
# Inicie o servidor de desenvolvimento
yarn dev

# Ou use o comando de instalação rápida
yarn fast-install
```

---

## Configuração SSH (Não versionado)

Para evitar digitar a senha SSH repetidamente, crie um script local:

```bash
# Crie um script local não versionado
mkdir -p scripts
touch scripts/local-ssh-setup.sh
chmod +x scripts/local-ssh-setup.sh
```

Adicione o seguinte conteúdo ao arquivo `scripts/local-ssh-setup.sh`:

```bash
#!/bin/bash

# Script para configurar o SSH Agent e adicionar chaves automaticamente

# Iniciar o SSH Agent se ainda não estiver rodando
if [ -z "$SSH_AUTH_SOCK" ]; then
  echo "🔑 Iniciando SSH Agent..."
  eval "$(ssh-agent -s)"
fi

# Verificar se a chave já está adicionada
ssh-add -l | grep -q "SUA_CHAVE_SSH"
if [ $? -ne 0 ]; then
  echo "🔐 Adicionando chave SSH ao agent..."
  ssh-add ~/.ssh/SUA_CHAVE_SSH
else
  echo "✅ Chave SSH já está adicionada ao agent."
fi

echo "🚀 Configuração SSH concluída!"
```

Substitua `SUA_CHAVE_SSH` pelo nome do seu arquivo de chave SSH.

## Configuração permanente (opcional)

Para configurar o SSH Agent permanentemente, adicione ao seu arquivo de perfil (~/.bashrc, ~/.zshrc, etc.):

```bash
# Configuração do SSH Agent
if [ -z "$SSH_AUTH_SOCK" ]; then
  eval "$(ssh-agent -s)" > /dev/null
  ssh-add -q ~/.ssh/SUA_CHAVE_SSH 2>/dev/null
fi
```

## Instalação rápida

Para instalar as dependências rapidamente:

```bash
yarn fast-install
```

Este comando usa configurações otimizadas para acelerar o processo de instalação.