#!/bin/bash

# Script para build e deploy no GitHub Pages
# Autor: Xperience Team
# Data: 2 de outubro de 2025

echo "🚀 Iniciando deploy para GitHub Pages..."

# Verifica se está no branch main
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "main" ]; then
  echo "❌ Erro: Você precisa estar no branch 'main' para fazer deploy."
  echo "   Branch atual: $CURRENT_BRANCH"
  exit 1
fi

# Verifica se há alterações não commitadas
if ! git diff-index --quiet HEAD --; then
  echo "❌ Erro: Há alterações não commitadas no repositório."
  echo "   Por favor, faça commit de todas as alterações antes de continuar."
  git status
  exit 1
fi

# Limpa a pasta dist
echo "🧹 Limpando pasta de build anterior..."
rm -rf dist

# Executa o build
echo "🔨 Executando build do projeto..."
yarn build

if [ $? -ne 0 ]; then
  echo "❌ Erro durante o build. Abortando deploy."
  exit 1
fi

# Verifica se a pasta dist existe
if [ ! -d "dist" ]; then
  echo "❌ Erro: Pasta 'dist' não encontrada após o build."
  exit 1
fi

# Copia o arquivo 404.html para a pasta dist
echo "📄 Copiando arquivo 404.html para a pasta dist..."
cp 404.html dist/

# Cria o arquivo CNAME se não existir
if [ ! -f "dist/CNAME" ]; then
  echo "📝 Criando arquivo CNAME..."
  echo "xperiencehubs.com" > dist/CNAME
fi

# Deploy para o GitHub Pages
echo "🚀 Fazendo deploy para GitHub Pages..."
git add dist -f
git commit -m "Deploy para GitHub Pages: $(date)"

# Push para o branch gh-pages
git subtree push --prefix dist origin gh-pages

if [ $? -ne 0 ]; then
  echo "⚠️ Erro ao fazer push para o branch gh-pages. Tentando forçar..."
  git push origin `git subtree split --prefix dist main`:gh-pages --force
fi

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: https://xperiencehubs.com/"
echo "⏱️ O site estará disponível em alguns minutos."

