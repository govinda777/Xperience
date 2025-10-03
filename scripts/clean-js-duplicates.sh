#!/bin/bash

# Script para remover arquivos JavaScript duplicados quando existe uma versão TypeScript
echo "🧹 Iniciando limpeza de arquivos JavaScript duplicados..."

# Contador de arquivos removidos
removed_count=0

# Função para verificar se um arquivo .ts ou .tsx correspondente existe
has_ts_version() {
  local js_file="$1"
  local base_path="${js_file%.js}"
  
  if [ -f "${base_path}.ts" ] || [ -f "${base_path}.tsx" ]; then
    return 0  # Verdadeiro, existe versão TS
  else
    return 1  # Falso, não existe versão TS
  fi
}

# Encontrar todos os arquivos .js no diretório src
find src -name "*.js" | while read js_file; do
  if has_ts_version "$js_file"; then
    echo "🗑️  Removendo $js_file (tem versão TypeScript)"
    rm "$js_file"
    ((removed_count++))
  else
    echo "✅ Mantendo $js_file (não tem versão TypeScript)"
  fi
done

echo "🏁 Limpeza concluída! $removed_count arquivos JavaScript duplicados foram removidos."

# Atualizar .gitignore para evitar que arquivos .js gerados sejam versionados no futuro
if ! grep -q "# Arquivos JavaScript gerados a partir de TypeScript" .gitignore; then
  echo "" >> .gitignore
  echo "# Arquivos JavaScript gerados a partir de TypeScript" >> .gitignore
  echo "src/**/*.js" >> .gitignore
  echo "Atualizado .gitignore para ignorar arquivos JavaScript gerados"
fi

echo "✨ Processo finalizado!"
