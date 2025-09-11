# 🚀 Deploy no GitHub Pages - Xperience

## 📋 Configuração para Deploy com Domínio Customizado

Este guia mostra como fazer deploy do projeto Xperience no GitHub Pages utilizando um domínio customizado (ex: `xperiencehubs.com`).

## ✅ Configurações Atuais

### 🔧 **Ajustes para Domínio Customizado**

- [x] **Base Path**: Configurado para `/` em `vite.config.ts`.
- [x] **SPA Routing**: Script para resolver rotas do React Router.
- [x] **404.html**: Fallback para Single Page Application.
- [x] **GitHub Actions**: Deploy automático configurado.
- [x] **URLs Atualizadas**: Sitemap e robots.txt com URLs do domínio customizado.

## 🚀 Como Fazer Deploy

### **1. Configurar Domínio no GitHub**

1. **Acesse seu repositório no GitHub**
2. **Vá em Settings > Pages**
3. Em **Custom domain**, adicione `xperiencehubs.com` e salve.
4. **Configure Source**: Continue usando **GitHub Actions**.

### **2. Configurar Secrets (Opcional)**

No GitHub, vá em **Settings > Secrets and variables > Actions** e adicione/verifique:

```
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX
VITE_SITE_URL=https://xperiencehubs.com
```

### **3. Deploy Automático**

O deploy acontece automaticamente quando você fizer push para a branch `main`:

```bash
git add .
git commit -m "Deploy de nova feature"
git push origin main
```

### **4. Verificar Deploy**

1. **Acesse**: https://xperiencehubs.com
2. **Verifique**: Se todas as páginas carregam corretamente.
3. **Teste**: Navegação entre páginas.
4. **Confirme**: Meta tags estão funcionando.

## 🔧 Configurações Específicas

### **URLs do Projeto**

- **Site**: https://xperiencehubs.com
- **Sitemap**: https://xperiencehubs.com/sitemap.xml
- **Robots**: https://xperiencehubs.com/robots.txt

### **Base Path Configuration**

Para um domínio customizado, o `base` path no `vite.config.ts` deve ser `/`.

```typescript
// vite.config.ts
export default defineConfig({
  base: "/", // Correto para domínios customizados
  // ... resto da configuração
});
```
**Nota:** A configuração `base: '/Xperience/'` só é necessária ao fazer deploy para um subdiretório do GitHub Pages (ex: `usuario.github.io/Xperience`).

### **SPA Routing Solution**

O projeto usa uma solução elegante para resolver o problema de SPA routing no GitHub Pages, que funciona tanto para subdiretórios quanto para domínios customizados.

## 📊 Verificação Pós-Deploy

### **Checklist de Validação**

- [ ] **Homepage** carrega: https://xperiencehubs.com
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
curl -s https://xperiencehubs.com | grep -i "<meta"

# Verificar sitemap
curl -s https://xperiencehubs.com/sitemap.xml

# Verificar robots.txt
curl -s https://xperiencehubs.com/robots.txt
```

### **Ferramentas de Teste**

1. **PageSpeed Insights**: https://pagespeed.web.dev/
   - Teste: `https://xperiencehubs.com`

2. **Google Rich Results Test**: https://search.google.com/test/rich-results
   - Teste structured data

3. **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
   - Teste Open Graph tags

## 🎯 Configuração do Google Analytics

### **1. Criar Propriedade GA4**

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Crie ou configure uma propriedade para `https://xperiencehubs.com`
3. Copie o Measurement ID (G-XXXXXXXXXX)

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
2. Adicione a propriedade para `https://xperiencehubs.com`
3. Verifique a propriedade via meta tag ou DNS.

### **2. Enviar Sitemap**

1. No Search Console, vá em **Sitemaps**
2. Adicione: `https://xperiencehubs.com/sitemap.xml`
3. Clique em **Enviar**

### **3. Monitorar Indexação**

- Verifique se páginas estão sendo indexadas
- Configure alertas para problemas
- Monitore performance de busca

## 🚨 Troubleshooting

### **Problema: Páginas não carregam / Assets com 404**

**Causa Provável**: O `base` path em `vite.config.ts` está incorreto.
**Solução**: Para um domínio customizado, certifique-se que `base` está configurado como `/`. Se o `build` antigo ainda estiver em cache, um novo deploy (push para a `main`) resolverá o problema.

### **Problema: 404 em rotas diretas**

**Causa**: GitHub Pages não suporta SPA routing nativamente.
**Solução**: O arquivo `404.html` do projeto já resolve isso automaticamente.

## 🔄 CI/CD Pipeline

O workflow de CI/CD em `.github/workflows/main.yml` está configurado para build e deploy automáticos no push para a branch `main`.

## 🎉 Resultado Final

Após o deploy, você terá:

- ✅ **Site funcionando**: https://xperiencehubs.com
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

**🎉 Seu projeto está pronto para produção no GitHub Pages!**

_Deploy configurado para máxima performance e SEO otimizado._
