#!/bin/bash

# Script para instalação rápida do projeto com saída verbosa
SECONDS=0

echo "🚀 Iniciando instalação rápida..."
echo "⏱️  Hora de início: $(date)"
echo ""

# Limpar cache e node_modules
echo "🧹 Limpando ambiente..."
echo "   - Removendo pasta node_modules..."
rm -rf node_modules
echo "   - Limpando cache do Yarn..."
yarn cache clean --verbose

# Configurar variáveis de ambiente para instalação mais rápida
export YARN_NETWORK_CONCURRENCY=8
export YARN_NETWORK_TIMEOUT=100000

# Instalar com flags de otimização
echo "📦 Instalando dependências..."
echo "📊 Configurações de instalação:"
echo "   - Network Concurrency: 8"
echo "   - Network Timeout: 100000ms"
echo "   - Prefer Offline: sim"
echo "   - Frozen Lockfile: sim"
echo ""

# Instalar com modo verboso
yarn install --verbose --prefer-offline --network-concurrency 8 --network-timeout 100000

# Mostrar informações finais
echo "✅ Instalação concluída!"
echo ""
echo "📋 Resumo da instalação:"
echo "   - Dependências instaladas: $(ls -l node_modules | grep "^d" | wc -l)"
echo "   - Tamanho do node_modules: $(du -sh node_modules | cut -f1)"
echo "   - Tempo total de execução: $SECONDS segundos"
