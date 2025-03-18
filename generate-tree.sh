#!/bin/bash

# chmod +x generate-tree.sh

# Verifica se um diretório foi passado como argumento
if [ -z "$1" ]; then
  echo "Uso: $0 <diretório>"
  exit 1
fi

# Diretório alvo
TARGET_DIR="$1"

# Verifica se o diretório existe
if [ ! -d "$TARGET_DIR" ]; then
  echo "Erro: O diretório '$TARGET_DIR' não existe."
  exit 1
fi

# Usa find para listar arquivos e diretórios, excluindo 'node_modules' e '.git'
find "$TARGET_DIR" \( -type d -name "node_modules" -o -name ".git" \) -prune -o -print | sed 's|[^/]*/|- |g' | awk '{
  gsub(/- /, "|   ")
  print
}'
