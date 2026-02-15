// utils/textProcessing.ts

/**
 * Lê conteúdo de um arquivo como texto
 */
export const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      resolve(text);
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    reader.readAsText(file);
  });
};

/**
 * Divide texto em chunks com overlap
 */
export const chunkText = (
  text: string,
  options: { chunkSize: number; overlap: number }
): string[] => {
  const { chunkSize, overlap } = options;
  const chunks: string[] = [];

  let start = 0;

  // Se o texto for menor que o tamanho do chunk, retorna o texto inteiro
  if (text.length <= chunkSize) {
    return [text];
  }

  while (start < text.length) {
    // Extrai chunk
    const end = Math.min(start + chunkSize, text.length);
    const chunk = text.substring(start, end);

    // Adiciona apenas se não for vazio
    if (chunk.trim().length > 0) {
      chunks.push(chunk.trim());
    }

    // Avança com overlap
    start += chunkSize - overlap;

    // Evita loop infinito se overlap >= chunkSize
    if (chunkSize <= overlap) {
       start += 1;
    }
  }

  return chunks;
};
