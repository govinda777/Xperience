// types/sessionRAG.ts

/**
 * Representa um chunk (pedaço) de texto do documento
 */
export interface SessionRAGChunk {
  id: string;                    // Identificador único
  text: string;                  // Texto do chunk
  embedding: number[];           // Vetor de 512 dimensões
  index: number;                 // Posição no documento original
  metadata: {
    page?: number;               // Número da página (se aplicável)
    section?: string;            // Seção do documento
  };
}

/**
 * Representa um arquivo carregado na sessão
 */
export interface SessionRAGFile {
  id: string;                    // ID único do arquivo
  name: string;                  // Nome original
  type: string;                  // MIME type (pdf, txt, docx)
  size: number;                  // Tamanho em bytes
  uploadedAt: Date;              // Data/hora de upload
  chunks: SessionRAGChunk[];     // Chunks processados
  status: 'processing' | 'ready' | 'error';
  errorMessage?: string;         // Mensagem de erro se falhar
}

/**
 * Contexto RAG completo da sessão
 */
export interface SessionRAGContext {
  files: SessionRAGFile[];       // Todos os arquivos
  activeFileId?: string;         // Arquivo selecionado (opcional)
  totalChunks: number;           // Total de chunks carregados
}

/**
 * Resultado de busca por similaridade
 */
export interface RAGSearchResult extends SessionRAGChunk {
  score: number;                 // Similaridade (0-1)
  fileName: string;              // Nome do arquivo fonte
}
