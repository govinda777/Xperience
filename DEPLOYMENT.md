# 🚀 Guia Completo de Deploy - Xperience Platform

Este guia consolidado apresenta todas as opções de deploy para a plataforma Xperience, desde GitHub Pages até servidores dedicados.

## 📋 Índice

- [Pré-requisitos](#-pré-requisitos)
- [GitHub Pages (Recomendado)](#-github-pages-recomendado)
- [Vercel](#-vercel)
- [Netlify](#-netlify)
- [AWS S3 + CloudFront](#-aws-s3--cloudfront)
- [VPS/Servidor Próprio](#-vpsservidor-próprio)
- [Docker](#-docker)
- [Configurações Pós-Deploy](#-configurações-pós-deploy)
- [Monitoramento](#-monitoramento)
- [Troubleshooting](#-troubleshooting)

## ✅ Pré-requisitos

### Checklist Obrigatório

- [ ] **Node.js 18+** instalado
- [ ] **Build de produção** testada localmente
- [ ] **Testes** passando (`npm run test:all`)
- [ ] **Lint** sem erros (`npm run lint`)
- [ ] **Variáveis de ambiente** configuradas
- [ ] **Performance** > 90 no Lighthouse

### Variáveis de Ambiente

```bash
# Essenciais
VITE_SITE_URL=https://your-domain.com
VITE_NODE_ENV=production

# Analytics (Opcional)
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_GTM_ID=GTM-XXXXXXX

# Pagamentos (Produção)
VITE_MERCADOPAGO_PUBLIC_KEY=your-public-key
VITE_AUTH0_DOMAIN=your-domain.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id

# Blockchain
VITE_TON_NETWORK=mainnet
VITE_PRIVY_APP_ID=your-privy-app-id
```

## 🌟 GitHub Pages (Recomendado)

### Vantagens

- ✅ **Gratuito** para repositórios públicos
- ✅ **HTTPS automático** com certificado SSL
- ✅ **CDN global** do GitHub
- ✅ **Deploy automático** via GitHub Actions
- ✅ **Domínio personalizado** suportado

### Configuração Rápida

1. **Configure o Repositório**

   ```bash
   # Certifique-se que está na branch main
   git checkout main
   git push origin main
   ```

2. **Ative GitHub Pages**
   - Vá em **Settings > Pages**
   - Source: **GitHub Actions**
   - Branch: **main**

3. **Deploy Automático**

   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

4. **Acesse seu Site**
   ```
   https://SEU_USERNAME.github.io/Xperience
   ```

### Configuração Avançada

#### Domínio Personalizado

1. **Configure DNS**

   ```
   # CNAME record
   www.xperience.com.br -> SEU_USERNAME.github.io

   # A records (apex domain)
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

2. **Adicione arquivo CNAME**
   ```bash
   echo "xperience.com.br" > public/CNAME
   git add public/CNAME
   git commit -m "Add custom domain"
   git push origin main
   ```

#### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:unit

      - name: Build
        run: npm run build
        env:
          VITE_GA_MEASUREMENT_ID: ${{ secrets.GA_MEASUREMENT_ID }}
          VITE_GTM_ID: ${{ secrets.GTM_ID }}
          VITE_SITE_URL: https://gosouza.github.io/Xperience

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest

    permissions:
      pages: write
      id-token: write

    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## ⚡ Vercel

### Vantagens

- ✅ **Performance excepcional** com Edge Network
- ✅ **Deploy automático** via Git
- ✅ **Preview deployments** para PRs
- ✅ **Analytics integrado**
- ✅ **Domínio personalizado** gratuito

### Deploy via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Deploy via Git

1. **Conecte no Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Conecte seu repositório GitHub

2. **Configurações de Build**

   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install",
     "framework": "vite"
   }
   ```

3. **Variáveis de Ambiente**
   - Configure no dashboard do Vercel
   - Ou via `vercel.json`:

```json
{
  "build": {
    "env": {
      "VITE_GA_MEASUREMENT_ID": "@ga-measurement-id",
      "VITE_SITE_URL": "https://xperience.vercel.app"
    }
  },
  "functions": {
    "app/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

## 🌐 Netlify

### Vantagens

- ✅ **CDN global** com cache inteligente
- ✅ **Forms handling** sem backend
- ✅ **Split testing** A/B nativo
- ✅ **Edge functions** para lógica customizada

### Deploy via Drag & Drop

```bash
# Build local
npm run build

# Arraste a pasta dist para netlify.com/drop
```

### Deploy via Git

1. **Conecte Repositório**
   - Acesse [netlify.com](https://netlify.com)
   - New site from Git

2. **Configurações de Build**

   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **netlify.toml**

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
     VITE_SITE_URL = "https://xperience.netlify.app"

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

## ☁️ AWS S3 + CloudFront

### Vantagens

- ✅ **Escalabilidade ilimitada**
- ✅ **CDN global** com CloudFront
- ✅ **Controle total** sobre configurações
- ✅ **Integração** com outros serviços AWS

### Configuração

1. **Criar Bucket S3**

   ```bash
   aws s3 mb s3://xperience-website
   aws s3 website s3://xperience-website --index-document index.html --error-document 404.html
   ```

2. **Build e Upload**

   ```bash
   npm run build
   aws s3 sync dist/ s3://xperience-website --delete
   ```

3. **CloudFront Distribution**

   ```json
   {
     "Origins": [
       {
         "DomainName": "xperience-website.s3-website-us-east-1.amazonaws.com",
         "Id": "S3-xperience-website",
         "CustomOriginConfig": {
           "HTTPPort": 80,
           "OriginProtocolPolicy": "http-only"
         }
       }
     ],
     "DefaultCacheBehavior": {
       "TargetOriginId": "S3-xperience-website",
       "ViewerProtocolPolicy": "redirect-to-https",
       "Compress": true
     }
   }
   ```

4. **Script de Deploy**

   ```bash
   #!/bin/bash
   # deploy-aws.sh

   echo "Building project..."
   npm run build

   echo "Uploading to S3..."
   aws s3 sync dist/ s3://xperience-website --delete

   echo "Invalidating CloudFront..."
   aws cloudfront create-invalidation --distribution-id E1234567890 --paths "/*"

   echo "Deploy complete!"
   ```

## 🖥️ VPS/Servidor Próprio

### Vantagens

- ✅ **Controle total** sobre ambiente
- ✅ **Customização** ilimitada
- ✅ **Backend integrado** possível
- ✅ **Dados privados** no seu servidor

### Configuração Nginx

```nginx
# /etc/nginx/sites-available/xperience
server {
    listen 80;
    server_name xperience.com.br www.xperience.com.br;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name xperience.com.br www.xperience.com.br;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/xperience.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/xperience.com.br/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;

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
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: *.google-analytics.com;" always;

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

### Script de Deploy

```bash
#!/bin/bash
# deploy-vps.sh

SERVER_USER="deploy"
SERVER_HOST="xperience.com.br"
DEPLOY_PATH="/var/www/xperience"

echo "Building project..."
npm run build

echo "Uploading files..."
rsync -avz --delete dist/ $SERVER_USER@$SERVER_HOST:$DEPLOY_PATH/

echo "Restarting nginx..."
ssh $SERVER_USER@$SERVER_HOST "sudo systemctl reload nginx"

echo "Deploy complete!"
```

## 🐳 Docker

### Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### nginx.conf para Docker

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Docker Compose

```yaml
# docker-compose.yml
version: "3.8"

services:
  xperience:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add SSL with Let's Encrypt
  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email admin@xperience.com.br --agree-tos --no-eff-email -d xperience.com.br
```

### Deploy com Docker

```bash
# Build e deploy
docker build -t xperience .
docker run -d -p 80:80 --name xperience-app xperience

# Com Docker Compose
docker-compose up -d

# Update
docker-compose pull
docker-compose up -d
```

## 🔧 Configurações Pós-Deploy

### Google Analytics

1. **Criar Propriedade GA4**
   - Acesse [analytics.google.com](https://analytics.google.com)
   - Configure para seu domínio
   - Copie o Measurement ID

2. **Configurar no Deploy**

   ```bash
   # GitHub Secrets
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX

   # Vercel Environment Variables
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

### Google Search Console

1. **Adicionar Propriedade**
   - Acesse [search.google.com/search-console](https://search.google.com/search-console)
   - Adicione seu domínio
   - Verifique via DNS ou meta tag

2. **Enviar Sitemap**
   ```
   https://seu-dominio.com/sitemap.xml
   ```

### SSL/HTTPS

#### Let's Encrypt (VPS)

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx

# Obter certificado
sudo certbot --nginx -d xperience.com.br -d www.xperience.com.br

# Auto-renovação
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### CloudFlare (Qualquer plataforma)

1. Adicione seu domínio no CloudFlare
2. Configure DNS records
3. Ative SSL/TLS Full (strict)
4. Configure Page Rules para cache

## 📊 Monitoramento

### Uptime Monitoring

```bash
# Script simples de monitoramento
#!/bin/bash
# monitor.sh

URL="https://xperience.com.br"
EMAIL="admin@xperience.com.br"

if ! curl -f -s $URL > /dev/null; then
    echo "Site down: $URL" | mail -s "Site Alert" $EMAIL
fi
```

### Performance Monitoring

```javascript
// lighthouse-ci.js
module.exports = {
  ci: {
    collect: {
      url: ["https://xperience.com.br"],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        "categories:performance": ["error", { minScore: 0.9 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["error", { minScore: 0.9 }],
        "categories:seo": ["error", { minScore: 0.9 }],
      },
    },
  },
};
```

### Analytics Dashboard

```typescript
// src/utils/analytics.ts
export const trackDeployment = () => {
  if (typeof gtag !== "undefined") {
    gtag("event", "deployment", {
      event_category: "system",
      event_label: process.env.NODE_ENV,
      value: 1,
    });
  }
};
```

## 🚨 Troubleshooting

### Problemas Comuns

#### 1. **404 em Rotas Diretas**

**Causa**: SPA routing não configurado
**Solução**: Configure fallback para index.html

#### 2. **Assets não Carregam**

**Causa**: Base path incorreto
**Solução**: Verifique `vite.config.ts` base path

#### 3. **CORS Errors**

**Causa**: Configuração de domínio
**Solução**: Configure headers CORS no servidor

#### 4. **Performance Baixa**

**Causa**: Assets não otimizados
**Solução**: Verifique build e compressão

### Debug de Deploy

```bash
# Verificar build local
npm run build
npm run preview

# Testar produção localmente
npx serve dist

# Verificar headers HTTP
curl -I https://seu-dominio.com

# Testar performance
lighthouse https://seu-dominio.com --view
```

### Logs de Deploy

```bash
# GitHub Actions
# Vá em Actions tab no GitHub

# Vercel
vercel logs

# Netlify
netlify logs

# VPS
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 📈 Otimizações Avançadas

### CDN Configuration

```javascript
// vite.config.ts - CDN optimization
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          analytics: ["react-ga4", "react-helmet-async"],
          payments: ["@tonconnect/ui-react", "ethers"],
        },
      },
    },
  },
});
```

### Service Worker Customizado

```javascript
// public/sw.js
const CACHE_NAME = "xperience-v1";
const urlsToCache = ["/", "/static/css/main.css", "/static/js/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
```

## 🎯 Métricas de Sucesso

### KPIs Principais

1. **Performance**
   - Lighthouse Score > 90
   - Core Web Vitals verdes
   - Time to First Byte < 600ms

2. **Disponibilidade**
   - Uptime > 99.9%
   - Response time < 2s
   - Error rate < 0.1%

3. **SEO**
   - Organic traffic growth
   - Search Console impressions
   - Average position improvement

### Dashboard de Monitoramento

```typescript
// src/components/AdminDashboard.tsx
const DeploymentMetrics = () => {
  const [metrics, setMetrics] = useState({
    uptime: 0,
    performance: 0,
    errors: 0,
    traffic: 0
  });

  useEffect(() => {
    // Fetch metrics from analytics
    fetchMetrics().then(setMetrics);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard title="Uptime" value={`${metrics.uptime}%`} />
      <MetricCard title="Performance" value={metrics.performance} />
      <MetricCard title="Errors" value={metrics.errors} />
      <MetricCard title="Traffic" value={metrics.traffic} />
    </div>
  );
};
```

---

## 📞 Suporte

Para dúvidas sobre deploy:

1. **Consulte logs** da plataforma escolhida
2. **Verifique configurações** de DNS e SSL
3. **Teste localmente** antes do deploy
4. **Monitore métricas** pós-deploy

**Plataformas recomendadas por caso de uso:**

- 🏠 **Projeto pessoal**: GitHub Pages
- 🚀 **Startup**: Vercel ou Netlify
- 🏢 **Empresa**: AWS ou VPS próprio
- 🔧 **Controle total**: Docker + VPS

---

_Guia completo para deploy em produção com todas as configurações necessárias para máxima performance e SEO._
