# 🚀 Guia de Deploy - Xperience SEO

## 📋 Checklist Pré-Deploy

### ✅ **Configurações Obrigatórias**

- [ ] **Google Analytics ID** configurado no `.env`
- [ ] **Google Tag Manager ID** configurado no `.env`
- [ ] **URLs de produção** configuradas no `.env`
- [ ] **Sitemap.xml** atualizado com URLs corretas
- [ ] **Robots.txt** configurado para produção
- [ ] **Meta tags** testadas em todas as páginas
- [ ] **Performance** > 90 no Lighthouse
- [ ] **Build de produção** testada localmente

## 🌐 Opções de Deploy

### 1. **Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar domínio personalizado
vercel --prod
```

**Configurações no Vercel:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**Variáveis de Ambiente no Vercel:**
- `VITE_GA_MEASUREMENT_ID`
- `VITE_GTM_ID`
- `VITE_SITE_URL`
- `VITE_ENABLE_ANALYTICS=true`

### 2. **Netlify**

```bash
# Build settings
Build command: npm run build
Publish directory: dist
```

**netlify.toml:**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "max-age=31536000"
```

### 3. **AWS S3 + CloudFront**

```bash
# Build
npm run build

# Sync para S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidar CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### 4. **VPS/Servidor Próprio**

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name xperience.com.br www.xperience.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name xperience.com.br www.xperience.com.br;
    
    # SSL Configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    
    root /var/www/xperience/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary "Accept-Encoding";
    }
    
    # Cache HTML with shorter expiry
    location ~* \.html$ {
        expires 1h;
        add_header Cache-Control "public, must-revalidate";
    }
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    
    # SEO files
    location = /robots.txt {
        expires 1d;
        add_header Cache-Control "public";
    }
    
    location = /sitemap.xml {
        expires 1d;
        add_header Cache-Control "public";
    }
}
```

## 🔧 Configurações Pós-Deploy

### 1. **Google Analytics**

1. Acesse [Google Analytics](https://analytics.google.com/)
2. Verifique se o tracking está funcionando
3. Configure Goals/Conversions:
   - Contact form submission
   - Plan selection
   - Newsletter signup
4. Configure Audiences para remarketing

### 2. **Google Search Console**

1. Adicione a propriedade no [Search Console](https://search.google.com/search-console/)
2. Verifique via DNS ou meta tag
3. Envie o sitemap: `https://xperience.com.br/sitemap.xml`
4. Configure alertas para:
   - Erros de crawl
   - Problemas de indexação
   - Queda no tráfego

### 3. **Google Tag Manager**

1. Publique o container no [GTM](https://tagmanager.google.com/)
2. Configure tags para:
   - Google Analytics 4
   - Google Ads (se aplicável)
   - Facebook Pixel (se aplicável)
3. Teste no Preview Mode

### 4. **Performance Monitoring**

Configure monitoramento contínuo:

```bash
# Lighthouse CI
npm install -g @lhci/cli

# lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      url: ['https://xperience.com.br'],
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.9}]
      }
    }
  }
};
```

## 📊 Validação Pós-Deploy

### **Testes Essenciais**

1. **SEO Validation**
   ```bash
   # Verificar meta tags
   curl -s https://xperience.com.br | grep -i "<meta"
   
   # Verificar sitemap
   curl -s https://xperience.com.br/sitemap.xml
   
   # Verificar robots.txt
   curl -s https://xperience.com.br/robots.txt
   ```

2. **Performance Testing**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - [GTmetrix](https://gtmetrix.com/)
   - [WebPageTest](https://www.webpagetest.org/)

3. **SEO Testing**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

### **Checklist de Validação**

- [ ] **Homepage** carrega em < 3 segundos
- [ ] **Meta tags** aparecem corretamente no View Source
- [ ] **Analytics** está trackando pageviews
- [ ] **Sitemap** é acessível e válido
- [ ] **Robots.txt** está configurado corretamente
- [ ] **HTTPS** está funcionando
- [ ] **Redirects** HTTP → HTTPS funcionam
- [ ] **404 pages** redirecionam para home
- [ ] **Mobile responsiveness** está ok
- [ ] **Core Web Vitals** estão verdes

## 🚨 Monitoramento Contínuo

### **Alertas Recomendados**

1. **Uptime Monitoring**
   - Pingdom, UptimeRobot, ou similar
   - Alerta se site ficar offline > 5 minutos

2. **Performance Monitoring**
   - Google Analytics Real-Time
   - Core Web Vitals no Search Console
   - Lighthouse CI em CI/CD

3. **SEO Monitoring**
   - Search Console alerts
   - Ranking tracking (SEMrush, Ahrefs)
   - Backlink monitoring

### **Scripts de Monitoramento**

```bash
#!/bin/bash
# monitor.sh - Script de monitoramento básico

URL="https://xperience.com.br"

# Check if site is up
if curl -f -s $URL > /dev/null; then
    echo "✅ Site is up"
else
    echo "❌ Site is down"
    # Send alert (Slack, email, etc.)
fi

# Check performance
LIGHTHOUSE_SCORE=$(lighthouse $URL --only-categories=performance --output=json --quiet | jq '.categories.performance.score * 100')

if (( $(echo "$LIGHTHOUSE_SCORE > 90" | bc -l) )); then
    echo "✅ Performance score: $LIGHTHOUSE_SCORE"
else
    echo "⚠️ Performance degraded: $LIGHTHOUSE_SCORE"
fi
```

## 🔄 CI/CD Pipeline

### **GitHub Actions Example**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
        VITE_GTM_ID: ${{ secrets.GTM_ID }}
        VITE_SITE_URL: https://xperience.com.br
    
    - name: Run Lighthouse CI
      run: |
        npm install -g @lhci/cli
        lhci autorun
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 📈 Otimizações Avançadas

### **CDN Configuration**

```javascript
// vite.config.ts - CDN optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          analytics: ['react-ga4', 'react-helmet-async']
        }
      }
    }
  }
});
```

### **Service Worker**

```javascript
// public/sw.js - Custom service worker
self.addEventListener('fetch', event => {
  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open('images').then(cache => {
        return cache.match(event.request).then(response => {
          return response || fetch(event.request).then(fetchResponse => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
```

## 🎯 Métricas de Sucesso

### **KPIs Principais**

1. **Performance**
   - Lighthouse Score > 90
   - Core Web Vitals verdes
   - Time to First Byte < 600ms

2. **SEO**
   - Organic traffic growth
   - Search Console impressions
   - Average position improvement

3. **User Experience**
   - Bounce rate < 50%
   - Session duration > 2 minutes
   - Pages per session > 2

---

*Guia completo para deploy em produção com todas as configurações SEO necessárias.*
