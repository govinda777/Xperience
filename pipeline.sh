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

# 3. Executar linting
log_info "Executando linting..."
npm run lint
check_result "Linting falhou" "Linting passou"

# 4. Executar testes unitários
log_info "Executando testes unitários..."
npm run test:unit
check_result "Testes unitários falharam" "Testes unitários passaram"

# 5. Verificar cobertura de testes
log_info "Verificando cobertura de testes..."
npm run test:coverage
check_result "Verificação de cobertura falhou" "Verificação de cobertura passou"

# 6. Executar testes E2E
log_info "Executando testes E2E..."
npm run test:cypress
check_result "Testes E2E falharam" "Testes E2E passaram"

# 7. Fazer build do projeto
log_info "Realizando build do projeto..."
npm run build
check_result "Build falhou" "Build concluído com sucesso"

# 8. Executar preview do build
log_info "Verificando build..."
timeout 30 npm run preview &
PREVIEW_PID=$!
sleep 5

if kill -0 $PREVIEW_PID 2>/dev/null; then
    kill $PREVIEW_PID
    log_success "Preview do build verificado com sucesso"
else
    log_error "Falha ao iniciar preview do build"
    exit 1
fi

log_success "🎉 Pipeline concluído com sucesso!"
echo ""
echo "📊 Resumo das verificações:"
echo "  ✅ Estrutura do projeto"
echo "  ✅ Verificação de tipos TypeScript"
echo "  ✅ Linting"
echo "  ✅ Testes unitários"
echo "  ✅ Cobertura de testes"
echo "  ✅ Testes E2E"
echo "  ✅ Build"
echo "  ✅ Preview do build"
echo ""
echo "💡 Todas as verificações são obrigatórias para o commit ser aceito."
echo "   Para mais detalhes, verifique os relatórios em:"
echo "   - coverage/ para relatório de cobertura"
echo "   - reports/ para relatórios de testes"
echo ""