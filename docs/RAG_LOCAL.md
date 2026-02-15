# 🧠 Funcionalidade RAG Local - Sistema de Perguntas e Respostas sobre Documentos

Este documento detalha a implementação e uso do sistema de RAG (Retrieval-Augmented Generation) que roda **100% na sessão do usuário**, permitindo upload de documentos e perguntas contextuais sem necessidade de banco de dados vetorial externo.

## 📋 Visão Geral

O sistema permite que o usuário faça upload de arquivos de texto (.txt) diretamente no navegador. Esses arquivos são processados localmente, transformados em vetores (embeddings) e armazenados na memória da sessão. Quando o usuário faz uma pergunta, o sistema busca os trechos mais relevantes dos documentos e os envia como contexto para o Agente de IA.

### Características Principais
- ✅ **100% Client-Side**: Processamento de texto e geração de embeddings ocorrem no navegador.
- ✅ **Sessão Temporária**: Dados são perdidos ao fechar a aba ou recarregar a página (privacidade garantida).
- ✅ **Zero Infraestrutura Vetorial**: Não utiliza Pinecone, Weaviate ou outros bancos vetoriais.
- ✅ **Integração com Agente**: Contexto é injetado automaticamente no prompt do sistema.

---

## 🚀 Como Usar

1.  Acesse a página de **Meus Agentes**.
2.  Ative o botão **"Ativar RAG"** no topo da lista de agentes.
3.  Selecione um agente para conversar.
4.  No chat, utilize a barra lateral esquerda para fazer upload de arquivos `.txt`.
    - O sistema processará o arquivo (leitura -> chunking -> embeddings).
5.  Após o processamento (status ✅), faça perguntas sobre o conteúdo dos documentos no chat.
    - O agente responderá com base nas informações encontradas, citando as fontes.

---

## 🏗️ Arquitetura Técnica

### Fluxo de Dados

1.  **Upload**:
    - O arquivo é lido via `FileReader API`.
    - O texto é extraído e dividido em pedaços (chunks) de ~500 caracteres com sobreposição (overlap).
    - Cada chunk é convertido em um vetor de 512 dimensões usando **TensorFlow.js** (`@tensorflow-models/universal-sentence-encoder`).
    - Os vetores são armazenados no estado do React (`useSessionRAG`).

2.  **Busca (Retrieval)**:
    - Quando o usuário envia uma mensagem, o sistema gera o embedding da pergunta localmente.
    - É calculada a **Similaridade de Cosseno** entre a pergunta e todos os chunks armazenados.
    - Os chunks com maior pontuação (top 3) são selecionados como contexto.

3.  **Geração (Generation)**:
    - O contexto selecionado é formatado em texto e inserido no `System Message` enviado para a API.
    - A API (`/api/chat`) recebe o histórico + contexto e chama o modelo (GPT-4) para gerar a resposta.

### Componentes Principais

-   **`src/hooks/useSessionRAG.ts`**: Gerencia o estado dos arquivos, processamento e busca vetorial.
-   **`src/utils/embeddings.ts`**: Carrega o modelo TensorFlow.js e gera embeddings.
-   **`src/components/ChatWithRAG.tsx`**: Interface principal do chat com suporte a RAG.
-   **`api/chat.ts`**: Endpoint serverless que processa a requisição com o contexto já injetado.

---

## 📦 Dependências Adicionadas

-   `@tensorflow/tfjs`: Biblioteca core do TensorFlow para JavaScript.
-   `@tensorflow-models/universal-sentence-encoder`: Modelo pré-treinado para gerar embeddings de frases.

---

## ⚠️ Limitações

-   **Persistência**: Os dados não são salvos em banco de dados. Recarregar a página apaga os documentos.
-   **Performance**: O processamento inicial (gerar embeddings) pode ser lento em dispositivos móveis ou com arquivos muito grandes, pois roda na CPU/GPU do cliente.
-   **Tamanho de Arquivo**: Limitado a 10MB por arquivo para evitar travamento do navegador.
