import { SessionKnowledge } from './SessionKnowledge';

interface CommandContext {
  conversationHistory: string[];
  knowledgeBase: string;
}

export class CommandProcessor {

  // Processa comando preservando contexto
  static async process(
    command: string,
    userMessage: string,
    conversationHistory: string[]
  ): Promise<string> {

    // 1. Coleta conhecimento da sessão
    const knowledgeContext = SessionKnowledge.getContext();

    // 2. Monta contexto completo
    const fullContext: CommandContext = {
      conversationHistory,
      knowledgeBase: knowledgeContext
    };

    // 3. Processa comando específico
    switch (command.toLowerCase()) {
      case 'report':
        return this.generateReport(userMessage, fullContext);

      case 'projeto':
        return this.analyzeProject(userMessage, fullContext);

      default:
        return this.handleCustomCommand(command, userMessage, fullContext);
    }
  }

  private static generateReport(
    message: string,
    context: CommandContext
  ): string {
    // Monta prompt contextual para o agente
    return `
      # CONTEXTO DA SESSÃO
      ${context.knowledgeBase}

      # HISTÓRICO DA CONVERSA
      ${context.conversationHistory.join('\n')}

      # SOLICITAÇÃO
      Gere um relatório sobre: ${message}

      Use APENAS as informações do contexto acima.
    `;
  }

  private static analyzeProject(
    message: string,
    context: CommandContext
  ): string {
    return `
      # CONTEXTO DA SESSÃO
      ${context.knowledgeBase}

      # HISTÓRICO DA CONVERSA
      ${context.conversationHistory.join('\n')}

      # SOLICITAÇÃO
      Analise o projeto considerando: ${message}

      Use APENAS as informações do contexto acima.
    `;
  }

  private static handleCustomCommand(
    command: string,
    message: string,
    context: CommandContext
  ): string {
    return `
      # CONTEXTO DA SESSÃO
      ${context.knowledgeBase}

      # HISTÓRICO DA CONVERSA
      ${context.conversationHistory.join('\n')}

      # COMANDO: ${command}
      ${message}

      Use o contexto fornecido para responder adequadamente.
    `;
  }
}
