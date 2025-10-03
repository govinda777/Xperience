#!/bin/bash

# Script para corrigir propriedades SVG não-camelCase para camelCase
# Especificamente: fill-rule -> fillRule e clip-rule -> clipRule

echo "🔍 Procurando por arquivos SVG com propriedades não-camelCase..."

# Encontra arquivos com fill-rule ou clip-rule
FILES=$(grep -l 'fill-rule\|clip-rule' $(find src -name "*.tsx" -o -name "*.jsx" -o -name "*.js" -o -name "*.ts"))

# Se não encontrar nenhum arquivo, informa e sai
if [ -z "$FILES" ]; then
  echo "✅ Nenhum arquivo encontrado com propriedades SVG não-camelCase."
  exit 0
fi

echo "🔧 Corrigindo propriedades SVG em arquivos:"

# Contador de arquivos corrigidos
FIXED_COUNT=0

# Substitui as propriedades em cada arquivo
for file in $FILES; do
  echo "   📄 $file"
  
  # Faz backup do arquivo original
  cp "$file" "$file.bak"
  
  # Substitui as propriedades
  sed -i '' 's/fill-rule=/fillRule=/g' "$file"
  sed -i '' 's/clip-rule=/clipRule=/g' "$file"
  sed -i '' 's/"fill-rule"/"fillRule"/g' "$file"
  sed -i '' 's/"clip-rule"/"clipRule"/g' "$file"
  sed -i '' "s/'fill-rule'/'fillRule'/g" "$file"
  sed -i '' "s/'clip-rule'/'clipRule'/g" "$file"
  
  # Verifica se o arquivo foi modificado
  if ! diff -q "$file" "$file.bak" > /dev/null; then
    ((FIXED_COUNT++))
    echo "   ✅ Corrigido!"
  else
    echo "   ⚠️ Nenhuma alteração necessária."
  fi
  
  # Remove o arquivo de backup
  rm "$file.bak"
done

echo "🎉 Processo concluído! $FIXED_COUNT arquivos foram corrigidos."
