# Xperience

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