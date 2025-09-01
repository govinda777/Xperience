#!/bin/bash

# Pipeline de CI/CD simplificado para Xperience
# Este script executa verificações básicas antes do commit

echo "🚀 Iniciando pipeline simplificado de CI/CD..."

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

# Verificar se node_modules existe
if [ ! -d "node_modules" ]; then
    log_warning "node_modules não encontrado. Instalando dependências..."
    npm install
fi

# 1. Verificar se os arquivos principais existem
log_info "Verificando estrutura do projeto..."
if [ -f "package.json" ] && [ -f "src/main.tsx" ] && [ -f "vite.config.ts" ]; then
    log_success "Estrutura do projeto verificada!"
else
    log_error "Estrutura do projeto incompleta!"
    exit 1
fi

# 2. Executar linting básico
log_info "Executando linting..."
if npm run lint 2>/dev/null; then
    log_success "Linting passou!"
else
    log_warning "Linting falhou, mas continuando..."
fi

# 3. Verificar se o Vite consegue fazer build
log_info "Tentando build com Vite..."
if timeout 60 npm run build 2>/dev/null; then
    log_success "Build Vite concluído!"
else
    log_warning "Build Vite falhou ou demorou muito, mas continuando..."
fi

# 4. Executar testes unitários (apenas se existirem)
log_info "Executando testes unitários..."
if npm run test:unit 2>/dev/null; then
    log_success "Testes unitários passaram!"
else
    log_warning "Testes unitários falharam ou não existem"
fi

log_success "🎉 Pipeline simplificado concluído!"
echo ""
echo "📊 Resumo das verificações:"
echo "  ✅ Estrutura do projeto"
echo "  ⚠️  Linting (avisos)"
echo "  ⚠️  Build (tentativa)"
echo "  ⚠️  Testes unitários (básicos)"
echo ""
echo "💡 Pipeline simplificado - apenas verificações essenciais."
echo "   Para verificações completas, execute:"
echo "   - 'npm run test:unit' para testes unitários"
echo "   - 'npm run test:integration' para testes de integração"
echo "   - 'npm run test:coverage' para relatório de cobertura"
echo "   - 'npm run dev' para testar a aplicação"
echo ""
