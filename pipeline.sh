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

# 3. Validar arquivos de workflow do GitHub Actions
log_info "Validando arquivos de workflow do GitHub Actions..."
if command -v yamllint &> /dev/null; then
    yamllint .github/workflows/*.yml .github/workflows/*.yaml 2>&1
    check_result "Validação YAML falhou" "Validação YAML passou"
else
    log_warning "yamllint não encontrado. Verificando chaves duplicadas manualmente..."
    for file in .github/workflows/*.yml .github/workflows/*.yaml; do
        if [ -f "$file" ]; then
            # Check for duplicate keys in each step
            python3 -c "
import sys
import yaml
import re

try:
    with open('$file', 'r') as f:
        content = f.read()
    
    # Simple check for duplicate continue-on-error keys in the same step
    lines = content.split('\n')
    step_indent = None
    continue_on_error_count = 0
    
    for i, line in enumerate(lines, 1):
        stripped = line.lstrip()
        if stripped.startswith('- name:') or stripped.startswith('name:'):
            # New step, reset counter
            step_indent = len(line) - len(stripped)
            continue_on_error_count = 0
        elif 'continue-on-error:' in stripped:
            current_indent = len(line) - len(stripped)
            if current_indent == step_indent + 2:  # Same level as step keys
                continue_on_error_count += 1
                if continue_on_error_count > 1:
                    print(f'ERROR: Duplicate continue-on-error in $file at line {i}')
                    sys.exit(1)
    
    print('OK: No duplicate keys found')
except Exception as e:
    print(f'ERROR: {e}')
    sys.exit(1)
"
            check_result "Validação de workflow falhou em $file" "Validação de workflow passou para $file"
        fi
    done
fi

# 4. Executar linting básico
log_info "Executando linting básico..."
npm run lint
check_result "Linting falhou" "Linting passou"

# 5. Executar testes unitários rápidos (sem coverage)
log_info "Executando testes unitários rápidos..."
# Utilizando vitest no modo normal para rodar os testes apenas (sem coverage/watch)
npm run test -- --run
check_result "Testes unitários falharam" "Testes unitários passaram"

log_success "🎉 Pipeline local concluído com sucesso!"
echo ""
echo "📊 Resumo das verificações (Local):"
echo "  ✅ Estrutura do projeto"
echo "  ✅ Verificação de tipos TypeScript"
echo "  ✅ Validação de workflows do GitHub Actions"
echo "  ✅ Linting Básico"
echo "  ✅ Testes unitários (Rápidos)"
echo ""
echo "💡 Verificações pesadas (E2E, Knip, Jscpd, Cobertura e Build) foram delegadas para o CI/CD (GitHub Actions)."
echo ""