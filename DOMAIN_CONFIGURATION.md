# 🌐 Configuração de Domínio Personalizado - Xperience

## 📋 Configuração Atual

O projeto está configurado para ser hospedado diretamente na raiz do domínio personalizado `xperiencehubs.com`.

### ✅ Configurações Implementadas

- **Base Path**: Configurado como `/` em `vite.config.ts`
- **Manifesto PWA**: Configurado com caminhos relativos à raiz do domínio
- **Dados Estruturados**: URLs atualizados para apontar para `https://xperiencehubs.com/`
- **Arquivo CNAME**: Configurado com o domínio `xperiencehubs.com`
- **Script SPA**: Atualizado para não adicionar prefixo `/Xperience/` às URLs

## 🚀 Como Fazer Deploy

### **Opção 1: Deploy Automático via GitHub Actions**

O deploy acontece automaticamente quando você faz push para a branch `main`:

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

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:

1. Se o site carrega em https://xperiencehubs.com/
2. Se todos os recursos (JS, CSS, imagens) carregam sem erros 404
3. Se a navegação entre páginas funciona corretamente
4. Se o manifesto PWA está sendo carregado

## 🚨 Troubleshooting

### **Problema: Página em branco ou apenas título**

**Causa Provável**: Recursos não estão sendo carregados corretamente.

**Solução**:
1. Verifique o console do navegador para identificar erros 404
2. Confirme que o `base` em `vite.config.ts` está configurado como `/`
3. Verifique se o CNAME está configurado corretamente
4. Limpe o cache do navegador ou teste em uma janela anônima

### **Problema: Rotas não funcionam**

**Causa**: Configuração incorreta do roteamento SPA.

**Solução**:
1. Verifique se o script SPA no `index.html` está configurado corretamente
2. Confirme que o arquivo `404.html` está sendo copiado para a pasta de build

## 🔄 Alternar entre Domínio Personalizado e GitHub Pages Padrão

Se precisar alternar entre o domínio personalizado e o GitHub Pages padrão (ex: `username.github.io/Xperience`), você precisará:

### **Para GitHub Pages Padrão**:

1. Altere `base: "/"` para `base: "/Xperience/"` em `vite.config.ts`
2. Atualize `scope` e `start_url` no manifesto PWA
3. Restaure o script SPA para adicionar o prefixo `/Xperience/`
4. Atualize os caminhos nos dados estruturados

### **Para Domínio Personalizado**:

1. Altere `base: "/Xperience/"` para `base: "/"` em `vite.config.ts`
2. Atualize `scope` e `start_url` no manifesto PWA para usar `/`
3. Remova a adição do prefixo `/Xperience/` no script SPA
4. Atualize os caminhos nos dados estruturados

## 📊 Próximos Passos

1. Verifique o deploy no domínio personalizado
2. Teste a navegação em todas as páginas
3. Confirme que o PWA está funcionando (instalação, cache, etc.)
4. Configure o Google Analytics e Search Console para o domínio personalizado

---

**🎉 Seu site agora está configurado para funcionar corretamente com o domínio personalizado!**
