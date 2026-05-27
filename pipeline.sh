#!/bin/bash

# Pipeline de CI/CD aprimorado para Xperience
# Este script executa verificações rigorosas antes do commit

echo "🚀 Iniciando pipeline de CI/CD..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para log colorido
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Função para verificar o último comando
check_result() {
    if [ $? -ne 0 ]; then
        log_error "$1"
        exit 1
    fi
    log_success "$2"
}

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    log_warning "node_modules não encontrado. Instalando dependências..."
    npm install
    check_result "Falha ao instalar dependências" "Dependências instaladas com sucesso"
fi

# 1. Verificar se os arquivos principais existem
log_info "Verificando estrutura do projeto..."
if [ -f "package.json" ] && [ -f "src/main.tsx" ] && [ -f "vite.config.ts" ]; then
    log_success "Estrutura do projeto verificada!"
else
    log_error "Estrutura do projeto incompleta!"
    exit 1
fi

# 2. Verificar tipos TypeScript
log_info "Verificando tipos TypeScript..."
npm run tsc --noEmit
check_result "Verificação de tipos TypeScript falhou" "Verificação de tipos TypeScript passou"

# 3. Executar linting básico
log_info "Executando linting básico..."
npm run lint
check_result "Linting falhou" "Linting passou"

# 4. Executar testes unitários rápidos (sem coverage)
log_info "Executando testes unitários rápidos..."
# Utilizando vitest no modo normal para rodar os testes apenas (sem coverage/watch)
npm run test -- --run
check_result "Testes unitários falharam" "Testes unitários passaram"

log_success "🎉 Pipeline local concluído com sucesso!"
echo ""
echo "📊 Resumo das verificações (Local):"
echo "  ✅ Estrutura do projeto"
echo "  ✅ Verificação de tipos TypeScript"
echo "  ✅ Linting Básico"
echo "  ✅ Testes unitários (Rápidos)"
echo ""
echo "💡 Verificações pesadas (E2E, Knip, Jscpd, Cobertura e Build) foram delegadas para o CI/CD (GitHub Actions)."
echo ""