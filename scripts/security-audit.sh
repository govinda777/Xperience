#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔍 Iniciando auditoria de segurança...${NC}"

# Criar diretório para relatórios se não existir
mkdir -p reports/security

# Executar npm audit e salvar resultado
echo -e "${BLUE}📊 Executando npm audit...${NC}"
npm audit --json > reports/security/npm-audit.json

# Verificar se há vulnerabilidades críticas ou altas
HIGH_VULNS=$(cat reports/security/npm-audit.json | grep -c '"severity":"high"' || true)
CRITICAL_VULNS=$(cat reports/security/npm-audit.json | grep -c '"severity":"critical"' || true)

if [ $HIGH_VULNS -gt 0 ] || [ $CRITICAL_VULNS -gt 0 ]; then
  echo -e "${RED}⚠️  Detectadas vulnerabilidades críticas ou altas!${NC}"
  echo -e "${RED}🔴 Vulnerabilidades críticas: $CRITICAL_VULNS${NC}"
  echo -e "${RED}🔴 Vulnerabilidades altas: $HIGH_VULNS${NC}"
  echo -e "${YELLOW}Por favor, execute 'npm audit fix' para tentar corrigir automaticamente as vulnerabilidades.${NC}"
  exit 1
fi

# Executar verificação de dependências desatualizadas
echo -e "${BLUE}📦 Verificando dependências desatualizadas...${NC}"
npm outdated --json > reports/security/npm-outdated.json

# Executar snyk test se disponível
if command -v snyk &> /dev/null; then
  echo -e "${BLUE}🛡️  Executando Snyk security test...${NC}"
  snyk test --json > reports/security/snyk-test.json || true
fi

echo -e "${GREEN}✅ Auditoria de segurança concluída!${NC}"
echo -e "${BLUE}📝 Relatórios disponíveis em reports/security/${NC}"
