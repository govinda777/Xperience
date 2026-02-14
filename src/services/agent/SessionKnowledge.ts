export interface KnowledgeItem {
  id: string;
  content: string;
  filename: string;
  uploadedAt: number;
}

export class SessionKnowledge {
  private static STORAGE_KEY = 'agent_knowledge_session';

  private static generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  // Adiciona conhecimento à sessão
  static add(filename: string, content: string): void {
    const items = this.getAll();
    const newItem: KnowledgeItem = {
      id: this.generateId(),
      content,
      filename,
      uploadedAt: Date.now()
    };

    items.push(newItem);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  // Busca todo o conhecimento da sessão
  static getAll(): KnowledgeItem[] {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  // Busca conhecimento relevante por termo
  static search(query: string): KnowledgeItem[] {
    const items = this.getAll();
    const queryLower = query.toLowerCase();

    return items.filter(item =>
      item.content.toLowerCase().includes(queryLower) ||
      item.filename.toLowerCase().includes(queryLower)
    );
  }

  // Remove item específico
  static remove(id: string): void {
    const items = this.getAll().filter(item => item.id !== id);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
  }

  // Limpa tudo (opcional, pois sessionStorage já limpa ao fechar aba)
  static clear(): void {
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  // Retorna todo o conhecimento como contexto para o agente
  static getContext(): string {
    const items = this.getAll();
    if (items.length === 0) return '';

    return items.map(item =>
      `[Arquivo: ${item.filename}]\n${item.content}\n`
    ).join('\n---\n\n');
  }
}
