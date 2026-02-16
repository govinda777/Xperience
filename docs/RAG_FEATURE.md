# Funcionalidade de RAG (Retrieval-Augmented Generation)

Este documento descreve a funcionalidade de RAG implementada no Xperience, que permite aos usuários adicionar documentos à sessão do agente para obter respostas contextuais.

## Visão Geral

A funcionalidade de RAG foi integrada nativamente à interface de chat do agente (`ChatInterface`). Isso permite que o usuário faça upload de arquivos de texto, que são processados localmente no navegador, e o agente utilize esse conteúdo para responder perguntas.

## Como Funciona

1.  **Upload de Arquivo**: O usuário seleciona um arquivo na barra lateral.
2.  **Processamento Local**:
    *   O arquivo é lido.
    *   O texto é dividido em pedaços (chunks) menores (ex: 500 caracteres).
    *   Embeddings (vetores numéricos) são gerados para cada chunk usando o modelo **Universal Sentence Encoder** (`@tensorflow-models/universal-sentence-encoder`) via TensorFlow.js.
    *   Tudo isso acontece no navegador do usuário (Client-Side), garantindo privacidade e velocidade, sem enviar os arquivos brutos para o servidor para indexação.
3.  **Busca Vetorial**:
    *   Quando o usuário envia uma mensagem, o sistema gera um embedding para a pergunta.
    *   É feita uma busca por similaridade (cosseno) entre a pergunta e os chunks armazenados localmente.
    *   Os chunks mais relevantes são selecionados.
4.  **Geração da Resposta**:
    *   O conteúdo dos chunks relevantes é anexado às instruções do sistema (System Prompt) enviadas para a API do Agente.
    *   O Agente (LLM) usa esse contexto para formular a resposta.
    *   As fontes consultadas são exibidas na mensagem de resposta.

## Tipos de Arquivos Suportados

Os seguintes formatos de arquivo de texto são suportados:

*   `.txt` (Texto Simples)
*   `.md` (Markdown)
*   `.json` (JSON)
*   `.csv` (CSV - Valores separados por vírgula)
*   `.xml`, `.yml`, `.yaml` (Configurações e dados estruturados)

## Limitações

*   **Sessão Efêmera**: Os dados processados (chunks e embeddings) são armazenados na memória do navegador (React State). Se a página for recarregada ou fechada, os dados são perdidos e os arquivos precisam ser carregados novamente.
*   **Tamanho do Arquivo**: O processamento é feito no cliente, então arquivos muito grandes podem causar lentidão ou travar o navegador. Há um limite sugerido de 10MB.

## Estrutura do Código

*   `src/hooks/useSessionRAG.ts`: Hook principal que gerencia o estado dos arquivos, chunking e busca vetorial.
*   `src/utils/embeddings.ts`: Wrapper para o modelo TensorFlow.js.
*   `src/utils/textProcessing.ts`: Utilitários para leitura de arquivo e divisão de texto.
*   `src/components/SessionRAGUpload.tsx`: Componente de UI para upload e listagem de arquivos.
*   `src/pages/Agents/ChatInterface.tsx`: Interface de chat integrada com a barra lateral de arquivos.

## Testes

Testes unitários cobrem a lógica de processamento de texto e o gerenciamento de estado do RAG:

*   `src/utils/__tests__/textProcessing.test.ts`
*   `src/hooks/__tests__/useSessionRAG.test.ts`

Para rodar os testes:
```bash
npm test src/utils/__tests__/textProcessing.test.ts src/hooks/__tests__/useSessionRAG.test.ts
```
