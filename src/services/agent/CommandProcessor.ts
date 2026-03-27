interface CommandContext {
  conversationHistory: string[];
}

export class CommandProcessor {

  // Processa comando preservando contexto
  static async process(
    command: string,
    userMessage: string,
    conversationHistory: string[]
  ): Promise<string> {

    // 1. Monta contexto parcial (histórico)
    const context: CommandContext = {
      conversationHistory
    };

    // 2. Processa comando específico
    switch (command.toUpperCase()) {
      case 'REPORT':
        return `/REPORT ${userMessage}`;

      case 'PROJECT':
        return this.analyzeProject(userMessage, context);

      default:
        return this.handleCustomCommand(command, userMessage, context);
    }
  }

  private static generateReport(
    message: string,
    context: CommandContext
  ): string {
    return `/REPORT ${message}`;
  }

  private static analyzeProject(
    message: string,
    context: CommandContext
  ): string {
    return `
      # HISTÓRICO DA CONVERSA
      ${context.conversationHistory.join('\n')}

      # SOLICITAÇÃO
      Analise o projeto considerando: ${message}
    `;
  }

  private static handleCustomCommand(
    command: string,
    message: string,
    context: CommandContext
  ): string {
    return `
      # HISTÓRICO DA CONVERSA
      ${context.conversationHistory.join('\n')}

      # COMANDO: ${command}
      ${message}
    `;
  }
}
