// hooks/useSessionRAG.ts
import { useState, useCallback } from 'react';
import { generateEmbeddingLocal, cosineSimilarity } from '../utils/embeddings';
import { chunkText, readFileAsText } from '../utils/textProcessing';
import type { SessionRAGContext, SessionRAGChunk, RAGSearchResult } from '../types/sessionRAG';

export const useSessionRAG = () => {
  // Estado local do RAG (perdido ao fechar aba)
  const [ragContext, setRagContext] = useState<SessionRAGContext>({
    files: [],
    totalChunks: 0
  });

  /**
   * ═══════════════════════════════════════════════════════════
   * UPLOAD E PROCESSAMENTO DE ARQUIVO
   * ═══════════════════════════════════════════════════════════
   */
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Adiciona arquivo com status "processing"
    setRagContext(prev => ({
      ...prev,
      files: [...prev.files, {
        id: fileId,
        name: file.name,
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        chunks: [],
        status: 'processing'
      }]
    }));

    try {
      // ETAPA 1: Lê conteúdo do arquivo
      console.log(`📄 Lendo arquivo: ${file.name}`);
      const text = await readFileAsText(file);

      // ETAPA 2: Divide em chunks
      console.log('✂️ Dividindo em chunks...');
      const textChunks = chunkText(text, {
        chunkSize: 500,    // 500 caracteres por chunk
        overlap: 50        // 50 caracteres de overlap
      });

      console.log(`📊 ${textChunks.length} chunks criados`);

      // ETAPA 3: Gera embeddings para cada chunk
      console.log('🧠 Gerando embeddings...');
      const chunks: SessionRAGChunk[] = await Promise.all(
        textChunks.map(async (chunk, index) => ({
          id: `${fileId}_chunk_${index}`,
          text: chunk,
          embedding: await generateEmbeddingLocal(chunk),
          index,
          metadata: {}
        }))
      );

      // ETAPA 4: Atualiza estado para "ready"
      setRagContext(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileId
            ? { ...f, chunks, status: 'ready' }
            : f
        ),
        totalChunks: prev.totalChunks + chunks.length
      }));

      console.log(`✅ Arquivo processado: ${file.name}`);
      return fileId;

    } catch (error: any) {
      console.error('❌ Erro ao processar arquivo:', error);

      // Marca arquivo como erro
      setRagContext(prev => ({
        ...prev,
        files: prev.files.map(f =>
          f.id === fileId
            ? { ...f, status: 'error', errorMessage: error.message }
            : f
        )
      }));

      throw error;
    }
  }, []);

  /**
   * ═══════════════════════════════════════════════════════════
   * BUSCA POR SIMILARIDADE (CORE DO RAG)
   * ═══════════════════════════════════════════════════════════
   */
  const searchSimilar = useCallback(async (
    query: string,
    options?: {
      fileId?: string;    // Buscar só em arquivo específico
      topK?: number;      // Quantos resultados retornar
      threshold?: number; // Relevância mínima
    }
  ): Promise<RAGSearchResult[]> => {
    const { fileId, topK = 5, threshold = 0.5 } = options || {}; // Lower default threshold to be more inclusive

    console.log(`🔍 Buscando: "${query}"`);

    // ETAPA 1: Gera embedding da query
    const queryEmbedding = await generateEmbeddingLocal(query);

    // ETAPA 2: Seleciona chunks onde buscar
    const chunks = fileId
      ? ragContext.files.find(f => f.id === fileId)?.chunks || []
      : ragContext.files.flatMap(f => f.chunks);

    if (chunks.length === 0) {
      console.log('⚠️ Nenhum chunk disponível para busca');
      return [];
    }

    // ETAPA 3: Calcula similaridade com cada chunk
    const results: RAGSearchResult[] = chunks.map(chunk => {
      const score = cosineSimilarity(queryEmbedding, chunk.embedding);
      const fileName = ragContext.files.find(f =>
        f.chunks.some(c => c.id === chunk.id)
      )?.name || 'Desconhecido';

      return {
        ...chunk,
        score,
        fileName
      };
    });

    // ETAPA 4: Filtra e ordena por relevância
    const filtered = results
      .filter(r => r.score >= threshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    console.log(`📚 ${filtered.length} chunks relevantes encontrados`);
    filtered.forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.fileName} - ${(r.score * 100).toFixed(0)}%`);
    });

    return filtered;
  }, [ragContext]);

  /**
   * Remove arquivo da sessão
   */
  const removeFile = useCallback((fileId: string) => {
    setRagContext(prev => {
      const file = prev.files.find(f => f.id === fileId);
      return {
        ...prev,
        files: prev.files.filter(f => f.id !== fileId),
        totalChunks: prev.totalChunks - (file?.chunks.length || 0),
        activeFileId: prev.activeFileId === fileId ? undefined : prev.activeFileId
      };
    });
  }, []);

  /**
   * Define arquivo ativo (para buscar só nele)
   */
  const setActiveFile = useCallback((fileId?: string) => {
    setRagContext(prev => ({ ...prev, activeFileId: fileId }));
  }, []);

  return {
    ragContext,
    uploadFile,
    searchSimilar,
    removeFile,
    setActiveFile
  };
};
