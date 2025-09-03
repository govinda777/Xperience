# 🚀 Deploy no GitHub Pages - Xperience SEO

## 📋 Configuração Completa para GitHub Pages

Este guia mostra como fazer deploy do projeto Xperience com todas as funcionalidades SEO no GitHub Pages.

## ✅ Configurações Implementadas

### 🔧 **Ajustes para GitHub Pages**

- [x] **Base Path**: Configurado para `/Xperience/`
- [x] **SPA Routing**: Script para resolver rotas do React Router
- [x] **404.html**: Fallback para Single Page Application
- [x] **GitHub Actions**: Deploy automático configurado
- [x] **URLs Atualizadas**: Sitemap e robots.txt com URLs corretas

## 🚀 Como Fazer Deploy

### **1. Configurar Repository**

1. **Acesse seu repositório no GitHub**
2. **Vá em Settings > Pages**
3. **Configure Source**: GitHub Actions
4. **Branch**: main

### **2. Configurar Secrets (Opcional)**

No GitHub, vá em **Settings > Secrets and variables > Actions** e adicione:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
VITE_SITE_URL=https://gosouza.github.io/Xperience
```

### **3. Deploy Automático**

O deploy acontece automaticamente quando você fizer push para a branch `main`:

```bash
git add .
git commit -m "Deploy SEO implementation"
git push origin main
```

### **4. Verificar Deploy**

1. **Acesse**: https://gosouza.github.io/Xperience
2. **Verifique**: Se todas as páginas carregam corretamente
3. **Teste**: Navegação entre páginas
4. **Confirme**: Meta tags estão funcionando

## 🔧 Configurações Específicas

### **URLs do Projeto**

- **Site**: https://gosouza.github.io/Xperience
- **Sitemap**: https://gosouza.github.io/Xperience/sitemap.xml
- **Robots**: https://gosouza.github.io/Xperience/robots.txt

### **Base Path Configuration**

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/Xperience/" : "/",
  // ... resto da configuração
});
```

### **SPA Routing Solution**

O projeto usa uma solução elegante para resolver o problema de SPA routing no GitHub Pages:

1. **404.html**: Redireciona URLs para o formato correto
2. **Script no index.html**: Processa URLs redirecionadas
3. **React Router**: Funciona normalmente

## 📊 Verificação Pós-Deploy

### **Checklist de Validação**

- [ ] **Homepage** carrega: https://gosouza.github.io/Xperience
- [ ] **Navegação** funciona entre páginas
- [ ] **URLs diretas** funcionam (ex: /solutions, /plans)
- [ ] **Meta tags** aparecem no View Source
- [ ] **Sitemap** é acessível
- [ ] **Robots.txt** é acessível
- [ ] **PWA** funciona (manifest, service worker)
- [ ] **Analytics** está trackando (se configurado)

### **Testes de SEO**

```bash
# Verificar meta tags
curl -s https://gosouza.github.io/Xperience | grep -i "<meta"

# Verificar sitemap
curl -s https://gosouza.github.io/Xperience/sitemap.xml

# Verificar robots.txt
curl -s https://gosouza.github.io/Xperience/robots.txt
```

### **Ferramentas de Teste**

1. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Teste: `https://gosouza.github.io/Xperience`

2. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Teste structured data

3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Teste Open Graph tags

## 🎯 Configuração do Google Analytics

### **1. Criar Propriedade GA4**

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie nova propriedade
3. Configure para `https://gosouza.github.io/Xperience`
4. Copie o Measurement ID (G-XXXXXXXXXX)

### **2. Configurar no GitHub**

Adicione o ID como secret no repositório:

- Nome: `VITE_GA_MEASUREMENT_ID`
- Valor: `G-XXXXXXXXXX`

### **3. Testar Tracking**

1. Acesse o site
2. Abra Google Analytics Real-Time
3. Verifique se aparece sua visita

## 🔍 Google Search Console

### **1. Adicionar Propriedade**

1. Acesse [Search Console](https://search.google.com/search-console/)
2. Adicione: `https://gosouza.github.io/Xperience`
3. Verifique via meta tag ou DNS

### **2. Enviar Sitemap**

1. No Search Console, vá em **Sitemaps**
2. Adicione: `https://gosouza.github.io/Xperience/sitemap.xml`
3. Clique em **Enviar**

### **3. Monitorar Indexação**

- Verifique se páginas estão sendo indexadas
- Configure alertas para problemas
- Monitore performance de busca

## 🚨 Troubleshooting

### **Problema: Páginas não carregam**

```bash
# Verificar se base path está correto
# Deve ser /Xperience/ em produção
```

**Solução**: Confirme que `vite.config.ts` tem o base path correto.

### **Problema: 404 em rotas diretas**

**Causa**: GitHub Pages não suporta SPA routing nativamente.
**Solução**: O arquivo `404.html` resolve isso automaticamente.

### **Problema: Assets não carregam**

**Causa**: Caminhos relativos incorretos.
**Solução**: Use caminhos absolutos ou configure base path.

### **Problema: Analytics não funciona**

1. Verifique se o secret está configurado
2. Confirme que está em produção
3. Teste com console do navegador

## 🔄 CI/CD Pipeline

### **Workflow Atual**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/deploy-pages@v4
```

### **Customizações Possíveis**

1. **Adicionar testes**: Antes do build
2. **Lighthouse CI**: Para verificar performance
3. **Notificações**: Slack, Discord, etc.
4. **Cache**: Para builds mais rápidas

## 📈 Otimizações Específicas

### **Performance no GitHub Pages**

1. **Assets estáticos** são servidos via CDN
2. **Compressão gzip** é automática
3. **Cache headers** são otimizados
4. **HTTPS** é obrigatório e gratuito

### **SEO Otimizado**

- URLs limpas (sem hash)
- Meta tags dinâmicas
- Sitemap atualizado
- Robots.txt configurado
- Structured data implementado

## 🎉 Resultado Final

Após o deploy, você terá:

- ✅ **Site funcionando**: https://gosouza.github.io/Xperience
- ✅ **SEO completo**: Meta tags, sitemap, robots.txt
- ✅ **Performance otimizada**: PWA, lazy loading, chunks
- ✅ **Analytics configurado**: GA4 + GTM (se configurado)
- ✅ **Deploy automático**: Push para main = deploy

## 📞 Próximos Passos

1. **Configure Analytics**: Adicione os secrets no GitHub
2. **Teste tudo**: Use o checklist de validação
3. **Configure Search Console**: Para monitorar SEO
4. **Monitore performance**: Use as ferramentas sugeridas

---

**🎉 Seu projeto está pronto para produção no GitHub Pages com SEO completo!**

_Deploy configurado para máxima performance e SEO otimizado._
