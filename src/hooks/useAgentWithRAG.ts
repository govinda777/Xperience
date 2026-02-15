// hooks/useAgentWithRAG.ts
import { useState } from 'react';
import { useSessionRAG } from './useSessionRAG';
import { useAgents } from '../pages/Agents/useAgents';
import type { RAGSearchResult } from '../types/sessionRAG';

export const useAgentWithRAG = (agentId: string) => {
  const sessionRAG = useSessionRAG();
  const { addMessage, getMessages } = useAgents();
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * ═══════════════════════════════════════════════════════════
   * FUNÇÃO PRINCIPAL: ENVIO DE MENSAGEM COM CONTEXTO RAG
   * ═══════════════════════════════════════════════════════════
   */
  const sendMessageWithRAG = async (userQuery: string) => {
    setIsProcessing(true);

    try {
      console.log('\n🚀 ═══ INICIANDO PROCESSAMENTO ═══');

      // ────────────────────────────────────────────────────────
      // PASSO 1: Adiciona mensagem do usuário no histórico
      // ────────────────────────────────────────────────────────
      console.log('1️⃣ Adicionando mensagem do usuário');
      addMessage(agentId, {
        role: 'user',
        content: userQuery
      });

      // ────────────────────────────────────────────────────────
      // PASSO 2: Busca contexto relevante no RAG local
      // ────────────────────────────────────────────────────────
      console.log('2️⃣ Buscando contexto RAG...');
      const ragResults: RAGSearchResult[] = await sessionRAG.searchSimilar(userQuery, {
        fileId: sessionRAG.ragContext.activeFileId,
        topK: 3,
        threshold: 0.5 // Lower default threshold
      });

      // ────────────────────────────────────────────────────────
      // PASSO 3: Monta o contexto em formato de texto
      // ────────────────────────────────────────────────────────
      console.log('3️⃣ Montando contexto textual');
      const ragContextText = ragResults.length > 0
        ? ragResults.map((r, idx) => `
[DOCUMENTO ${idx + 1}: ${r.fileName} - Relevância: ${(r.score * 100).toFixed(0)}%]
${r.text}
──────────────────────────────────────
        `).join('\n')
        : 'Nenhum documento carregado ou contexto relevante encontrado.';

      console.log(`   📄 Usando ${ragResults.length} chunks de contexto`);

      // ────────────────────────────────────────────────────────
      // PASSO 4: Busca histórico de mensagens anteriores
      // ────────────────────────────────────────────────────────
      console.log('4️⃣ Recuperando histórico');
      const previousMessages = getMessages(agentId);
      const recentMessages = previousMessages.slice(-10); // Últimas 10

      // ────────────────────────────────────────────────────────
      // PASSO 5: Monta payload completo para o agente
      // ────────────────────────────────────────────────────────
      console.log('5️⃣ Montando payload para API');

      const payload = {
        agentId,
        messages: [
          // ═══ SYSTEM MESSAGE COM RAG CONTEXT ═══
          {
            role: 'system',
            content: `Você é um assistente inteligente especializado em analisar documentos.

═══════════════════════════════════════════════════════════
CONTEXTO DOS DOCUMENTOS CARREGADOS
═══════════════════════════════════════════════════════════

${ragContextText}

═══════════════════════════════════════════════════════════
FIM DO CONTEXTO
═══════════════════════════════════════════════════════════

INSTRUÇÕES IMPORTANTES:
1. Responda APENAS baseado no contexto acima
2. Se não houver informação relevante, diga: "Não encontrei essa informação nos documentos carregados"
3. SEMPRE cite de qual documento veio a informação
4. Seja preciso, objetivo e baseado em fatos
5. Se houver múltiplas fontes, mencione todas
6. Use formatação markdown para melhor legibilidade`
          },

          // ═══ HISTÓRICO DE MENSAGENS ═══
          ...recentMessages.map(m => ({
            role: m.role,
            content: m.content
          })),

          // ═══ NOVA PERGUNTA DO USUÁRIO ═══
          {
            role: 'user',
            content: userQuery
          }
        ],

        // ═══ METADADOS DO RAG (para analytics) ═══
        ragMetadata: {
          hasContext: ragResults.length > 0,
          filesUsed: [...new Set(ragResults.map(r => r.fileName))],
          averageScore: ragResults.length > 0
            ? ragResults.reduce((sum, r) => sum + r.score, 0) / ragResults.length
            : 0,
          chunksUsed: ragResults.length,
          totalFilesInSession: sessionRAG.ragContext.files.length,
          totalChunksInSession: sessionRAG.ragContext.totalChunks
        }
      };

      console.log('   📊 Metadados:', payload.ragMetadata);

      // ────────────────────────────────────────────────────────
      // PASSO 6: Envia para API do agente (LLM)
      // ────────────────────────────────────────────────────────
      console.log('6️⃣ Chamando API do agente...');

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`API retornou ${response.status}`);
      }

      const data = await response.json();
      console.log('   ✅ Resposta recebida');

      // ────────────────────────────────────────────────────────
      // PASSO 7: Adiciona resposta do agente no histórico
      // ────────────────────────────────────────────────────────
      console.log('7️⃣ Salvando resposta');

      addMessage(agentId, {
        role: 'assistant',
        content: data.response,
        // ═══ ARMAZENA CONTEXTO RAG USADO ═══
        ragContext: ragResults.map(r => ({
          title: r.fileName,
          score: r.score,
          source: `chunk_${r.index}`
        })),
        timeMs: data.processingTime
      });

      console.log('✅ ═══ PROCESSAMENTO CONCLUÍDO ═══\n');
      return data;

    } catch (error: any) {
      console.error('❌ Erro ao processar mensagem:', error);

      // Adiciona mensagem de erro
      addMessage(agentId, {
        role: 'assistant',
        content: '❌ Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
      });

      throw error;

    } finally {
      setIsProcessing(false);
    }
  };

  return {
    sendMessageWithRAG,
    isProcessing,
    sessionRAG // Expõe para componentes de upload
  };
};
