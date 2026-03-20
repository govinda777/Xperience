// utils/embeddings.ts
import * as use from "@tensorflow-models/universal-sentence-encoder";
import * as tf from "@tensorflow/tfjs";

let model: use.UniversalSentenceEncoder | null = null;

// Cache for embeddings to avoid redundant computations
const embeddingCache = new Map<string, number[]>();
const MAX_CACHE_SIZE = 200;

/**
 * Limpa o cache de embeddings (útil para testes)
 * @internal
 */
export const _clearEmbeddingCache = (): void => {
  embeddingCache.clear();
};

/**
 * Carrega o modelo de embeddings (apenas uma vez)
 */
export const loadEmbeddingModel =
  async (): Promise<use.UniversalSentenceEncoder> => {
    if (!model) {
      console.log("🧠 Carregando modelo de embeddings...");
      await tf.ready(); // Ensure backend is ready
      model = await use.load();
      console.log("✅ Modelo carregado");
    }
    return model;
  };

/**
 * Gera embedding de um texto (vetor de 512 dimensões)
 */
export const generateEmbeddingLocal = async (
  text: string,
): Promise<number[]> => {
  // Check cache first
  if (embeddingCache.has(text)) {
    return embeddingCache.get(text)!;
  }

  const encoder = await loadEmbeddingModel();
  const embeddings = await encoder.embed([text]);
  const embeddingArray = await embeddings.array();
  const result = embeddingArray[0];

  // Store in cache
  if (embeddingCache.size >= MAX_CACHE_SIZE) {
    // Basic FIFO eviction: remove the first (oldest) entry
    const firstKey = embeddingCache.keys().next().value;
    if (firstKey !== undefined) {
      embeddingCache.delete(firstKey);
    }
  }
  embeddingCache.set(text, result);

  return result;
};

/**
 * Calcula similaridade cosseno entre dois vetores
 * Retorna valor entre 0 (nada similar) e 1 (idêntico)
 */
export const cosineSimilarity = (a: number[], b: number[]): number => {
  // Produto escalar
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);

  // Magnitude de A
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));

  // Magnitude de B
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));

  // Similaridade
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  return dotProduct / (magnitudeA * magnitudeB);
};
