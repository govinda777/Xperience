# 📤 Instruções para Deploy Manual - Xperience

## 📋 Visão Geral

Este documento fornece instruções para fazer o deploy manual dos arquivos do site Xperience para um servidor web ou serviço de hospedagem.

## ✅ Arquivos Prontos para Deploy

Os arquivos prontos para deploy estão na pasta `dist/` do projeto. Estes arquivos foram gerados com as seguintes configurações:

- **Base Path**: Configurado como `/` (raiz do domínio)
- **Manifesto PWA**: Configurado com caminhos relativos à raiz do domínio
- **Dados Estruturados**: URLs atualizados para apontar para `https://xperiencehubs.com/`
- **Arquivo CNAME**: Configurado com o domínio `xperiencehubs.com`

## 🚀 Opções de Deploy Manual

### **Opção 1: Upload via FTP**

1. **Conecte-se ao servidor FTP**:
   - Use um cliente FTP como FileZilla, Cyberduck ou similar
   - Conecte-se usando as credenciais fornecidas pelo seu provedor de hospedagem

2. **Faça o upload dos arquivos**:
   - Navegue até a pasta `dist/` do projeto local
   - Selecione todos os arquivos e pastas
   - Faça o upload para a pasta raiz do seu servidor web (geralmente `/public_html/`, `/www/` ou `/htdocs/`)

3. **Verifique as permissões**:
   - Certifique-se de que todos os arquivos têm permissões de leitura (geralmente 644)
   - Certifique-se de que todas as pastas têm permissões de leitura e execução (geralmente 755)

### **Opção 2: Upload via Painel de Controle do Hosting**

1. **Acesse o painel de controle**:
   - Faça login no painel de controle do seu provedor de hospedagem
   - Navegue até o gerenciador de arquivos

2. **Faça o upload dos arquivos**:
   - Navegue até a pasta raiz do seu servidor web
   - Use a função de upload para enviar os arquivos da pasta `dist/`
   - Alguns painéis permitem o upload de arquivos .zip, o que pode ser mais rápido

### **Opção 3: Deploy via GitHub Pages (Interface Web)**

1. **Crie um novo repositório no GitHub**:
   - Acesse https://github.com/new
   - Nomeie o repositório (ex: `xperience-site`)
   - Torne o repositório público
   - Não adicione README, .gitignore ou licença

2. **Faça o upload dos arquivos**:
   - Após criar o repositório, você verá uma página com instruções
   - Clique em "uploading an existing file"
   - Arraste e solte todos os arquivos da pasta `dist/` ou use o seletor de arquivos
   - Adicione uma mensagem de commit como "Initial commit"
   - Clique em "Commit changes"

3. **Configure o GitHub Pages**:
   - Vá para "Settings" > "Pages"
   - Em "Source", selecione "main" e a pasta raiz (/)
   - Clique em "Save"
   - Em "Custom domain", adicione `xperiencehubs.com` e clique em "Save"
   - Marque a opção "Enforce HTTPS" se disponível

### **Opção 4: Deploy via Netlify (Interface Web)**

1. **Crie uma conta ou faça login no Netlify**:
   - Acesse https://app.netlify.com/

2. **Faça o upload do site**:
   - Na página inicial do Netlify, procure por "Sites"
   - Arraste e solte a pasta `dist/` inteira na área indicada
   - O Netlify fará o upload e deploy automaticamente

3. **Configure o domínio personalizado**:
   - Após o deploy, vá para "Site settings" > "Domain management"
   - Clique em "Add custom domain"
   - Digite `xperiencehubs.com` e siga as instruções para configurar os registros DNS

### **Opção 5: Deploy via Vercel (Interface Web)**

1. **Crie uma conta ou faça login no Vercel**:
   - Acesse https://vercel.com/

2. **Faça o upload do site**:
   - Na página inicial do Vercel, clique em "Add New..." > "Project"
   - Escolha "Upload" na seção "Import Git Repository"
   - Arraste e solte a pasta `dist/` ou selecione-a do seu computador
   - Clique em "Deploy"

3. **Configure o domínio personalizado**:
   - Após o deploy, vá para as configurações do projeto
   - Navegue até "Domains"
   - Adicione `xperiencehubs.com` e siga as instruções para configurar os registros DNS

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
2. Confirme que os caminhos dos recursos estão corretos
3. Verifique se o servidor está configurado para servir corretamente arquivos estáticos
4. Limpe o cache do navegador ou teste em uma janela anônima

### **Problema: Rotas não funcionam**

**Causa**: Configuração incorreta do roteamento SPA.

**Solução**:
1. Verifique se o servidor está configurado para redirecionar todas as requisições para o `index.html`
2. Para o Netlify, crie um arquivo `_redirects` com o conteúdo: `/* /index.html 200`
3. Para o Vercel, crie um arquivo `vercel.json` com a configuração de redirecionamento

## 📊 Próximos Passos

1. Verifique o deploy no domínio personalizado
2. Teste a navegação em todas as páginas
3. Confirme que o PWA está funcionando (instalação, cache, etc.)
4. Configure o Google Analytics e Search Console para o domínio personalizado

---

**🎉 Seu site estará pronto para ser acessado após o deploy manual!**
