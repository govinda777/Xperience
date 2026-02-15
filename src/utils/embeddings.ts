// utils/embeddings.ts
import * as use from '@tensorflow-models/universal-sentence-encoder';
import * as tf from '@tensorflow/tfjs';

let model: use.UniversalSentenceEncoder | null = null;

/**
 * Carrega o modelo de embeddings (apenas uma vez)
 */
export const loadEmbeddingModel = async (): Promise<use.UniversalSentenceEncoder> => {
  if (!model) {
    console.log('🧠 Carregando modelo de embeddings...');
    await tf.ready(); // Ensure backend is ready
    model = await use.load();
    console.log('✅ Modelo carregado');
  }
  return model;
};

/**
 * Gera embedding de um texto (vetor de 512 dimensões)
 */
export const generateEmbeddingLocal = async (text: string): Promise<number[]> => {
  const encoder = await loadEmbeddingModel();
  const embeddings = await encoder.embed([text]);
  const embeddingArray = await embeddings.array();
  return embeddingArray[0];
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
