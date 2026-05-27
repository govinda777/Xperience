#!/bin/bash

# Script rápido para sincronizar o banco de dados (Prisma)
# Utilizado para ambiente de desenvolvimento local

echo "🔄 Iniciando sincronização do banco de dados..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 1. Gerar o Client Prisma
log_info "Gerando o Prisma Client (prisma generate)..."
npx prisma generate
if [ $? -ne 0 ]; then
    log_error "Falha ao gerar o Prisma Client."
    exit 1
fi
log_success "Prisma Client gerado com sucesso!"

# 2. Fazer Push do Schema para o Banco de Dados
log_info "Sincronizando schema com o banco de dados (prisma db push)..."
npx prisma db push
if [ $? -ne 0 ]; then
    log_error "Falha ao sincronizar com o banco de dados."
    exit 1
fi
log_success "Banco de dados sincronizado com sucesso!"

echo ""
echo -e "${GREEN}🎉 Sincronização concluída!${NC}"
