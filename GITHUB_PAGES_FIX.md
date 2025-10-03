# 🛠️ Correções para o GitHub Pages - Xperience

## 📋 Problemas Identificados e Soluções

### 🔍 **Problema Principal:**
Recursos não estavam sendo carregados corretamente no domínio customizado, resultando em erros 404.

```
(index):81  GET https://xperiencehubs.com/Xperience/assets/index-D61l5aF6.js net::ERR_ABORTED 404 (Not Found)
(index):84  GET https://xperiencehubs.com/Xperience/assets/analytics-BuXrMuvv.js net::ERR_ABORTED 404 (Not Found)
...
```

### ✅ **Correções Implementadas:**

#### 1. **Configuração do Base Path**
- Alterado `base: "/"` para `base: "/Xperience/"` no `vite.config.ts`
- Atualizado `scope` e `start_url` no manifesto PWA para `/Xperience/`
- Atualizado caminhos dos ícones no manifesto

#### 2. **Arquivos Estáticos**
- Corrigido caminhos relativos no `index.html` (de `/src/main.tsx` para `./src/main.tsx`)
- Corrigido caminho do favicon (de `/logo.svg` para `./logo.svg`)

#### 3. **Roteamento SPA**
- Melhorado script de roteamento SPA para suportar o prefixo `/Xperience/`
- Atualizado arquivo `404.html` para redirecionar para `/Xperience/`

#### 4. **Manifesto PWA**
- Criado arquivo `manifest.webmanifest` na pasta `public/`
- Configurado com caminhos corretos para o subdiretório `/Xperience/`

#### 5. **Dados Estruturados**
- Atualizado URLs nos dados estruturados para apontar para `https://xperiencehubs.com/Xperience/`

#### 6. **Domínio Customizado**
- Criado arquivo `CNAME` com o domínio `xperiencehubs.com`
- Atualizado workflow do GitHub Actions para copiar o arquivo CNAME para a pasta de build

#### 7. **Scripts de Deploy**
- Criado script `deploy-gh-pages.sh` para facilitar o deploy manual
- Adicionado comando `deploy` ao `package.json`

## 🚀 **Como Fazer Deploy**

### **Opção 1: Deploy Automático via GitHub Actions**
O deploy acontece automaticamente quando você faz push para a branch `main`.

```bash
git add .
git commit -m "Suas alterações"
git push origin main
```

### **Opção 2: Deploy Manual**
Execute o comando:

```bash
yarn deploy
```

Este script:
1. Verifica se você está no branch `main`
2. Limpa a pasta `dist`
3. Executa o build
4. Copia os arquivos necessários (404.html, CNAME)
5. Faz deploy para o branch `gh-pages`

## 🔍 **Verificação Pós-Deploy**

Após o deploy, verifique:

1. Se o site carrega em https://xperiencehubs.com/Xperience/
2. Se todos os recursos (JS, CSS, imagens) carregam sem erros 404
3. Se a navegação entre páginas funciona corretamente
4. Se o manifesto PWA está sendo carregado

## 🔄 **Estrutura de Arquivos Atualizada**

- `vite.config.ts` - Configuração do base path e manifesto PWA
- `index.html` - Caminhos relativos e script SPA
- `404.html` - Redirecionamento para o caminho correto
- `public/manifest.webmanifest` - Configuração do PWA
- `public/CNAME` - Configuração do domínio customizado
- `scripts/deploy-gh-pages.sh` - Script de deploy manual
- `.github/workflows/main.yml` - Workflow de CI/CD atualizado

## 📊 **Próximos Passos**

1. Verificar o deploy no GitHub Pages
2. Testar a navegação em todas as páginas
3. Confirmar que o domínio customizado está funcionando corretamente
4. Verificar se o PWA está funcionando (instalação, cache, etc.)

---

**🎉 Seu site agora deve estar funcionando corretamente no GitHub Pages com domínio customizado!**

