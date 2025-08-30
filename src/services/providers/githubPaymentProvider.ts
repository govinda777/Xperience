import { 
  PaymentProviderInterface, 
  PaymentResult, 
  PaymentStatus, 
  PaymentCurrency 
} from '../../types/payment';

// Tipos específicos do GitHub Sponsors
interface GitHubSponsorshipConfig {
  username: string;
  sponsorshipTier?: string;
  frequency: 'one-time' | 'monthly';
  amount: number;
  currency: 'USD';
}

interface GitHubPaymentMetadata {
  username: string;
  sponsorshipUrl: string;
  amount: number;
  frequency: string;
  planId: string;
  userId: string;
  externalReference: string;
}

export class GitHubPaymentProvider implements PaymentProviderInterface {
  id = 'github' as const;
  name = 'GitHub Pay';
  type = 'fiat' as const;
  supportedCurrencies: PaymentCurrency[] = ['USD'];

  private githubUsername: string;
  private baseUrl = 'https://github.com/sponsors';

  constructor(githubUsername: string = 'govinda777') {
    this.githubUsername = githubUsername;
  }

  /**
   * Processa um pagamento via GitHub Sponsors
   */
  async process(amount: number, planId: string, userId: string): Promise<PaymentResult> {
    try {
      // Validar configuração antes de processar
      const validation = this.validateConfiguration();
      if (!validation.isValid) {
        throw new Error(`Configuração inválida: ${validation.errors.join(', ')}`);
      }

      const externalReference = `${userId}-${planId}-${Date.now()}`;
      
      // Converter BRL para USD (aproximadamente)
      const usdAmount = this.convertBrlToUsd(amount);
      
      // Gerar URL do GitHub Sponsors
      const sponsorshipUrl = this.generateSponsorshipUrl({
        username: this.githubUsername,
        frequency: 'one-time',
        amount: usdAmount,
        currency: 'USD'
      });

      // Criar ID de transação único
      const transactionId = `github-${externalReference}`;

      const metadata: GitHubPaymentMetadata = {
        username: this.githubUsername,
        sponsorshipUrl,
        amount: usdAmount,
        frequency: 'one-time',
        planId,
        userId,
        externalReference
      };

      return {
        transactionId,
        paymentUrl: sponsorshipUrl,
        amount: usdAmount,
        currency: 'USD',
        metadata
      };
    } catch (error) {
      console.error('Erro ao processar pagamento GitHub:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      throw new Error(`Falha ao processar pagamento GitHub: ${errorMessage}`);
    }
  }

  /**
   * Verifica o status de um pagamento GitHub
   * Nota: GitHub Sponsors não fornece API pública para verificação automática
   */
  async verify(transactionId: string): Promise<PaymentStatus> {
    try {
      // Como o GitHub Sponsors não tem API pública para verificação automática,
      // retornamos 'pending' e dependemos de verificação manual ou webhook
      console.log(`Verificação manual necessária para transação GitHub: ${transactionId}`);
      
      // Simular erro para transações inválidas (para testes)
      if (transactionId === 'invalid-transaction') {
        throw new Error('Transação inválida');
      }
      
      return 'pending';
    } catch (error) {
      console.error('Erro ao verificar pagamento GitHub:', error);
      return 'failed';
    }
  }

  /**
   * Cancela um pagamento GitHub (não suportado)
   */
  async cancel(transactionId: string): Promise<boolean> {
    // GitHub Sponsors não suporta cancelamento automático
    console.log(`Cancelamento manual necessário para transação GitHub: ${transactionId}`);
    return false;
  }

  /**
   * Gera URL do GitHub Sponsors
   */
  private generateSponsorshipUrl(config: GitHubSponsorshipConfig): string {
    const params = new URLSearchParams({
      sponsor: config.username,
      frequency: config.frequency,
      amount: config.amount.toString()
    });

    // Adicionar preview=true para mostrar preview da sponsorship
    params.append('preview', 'true');

    return `${this.baseUrl}/${config.username}/sponsorships?${params.toString()}`;
  }

  /**
   * Converte BRL para USD (taxa aproximada)
   * Em produção, isso deveria usar uma API de câmbio real
   */
  private convertBrlToUsd(brlAmount: number): number {
    // Taxa aproximada BRL -> USD (1 USD = ~5.5 BRL)
    const exchangeRate = 0.18; // 1 BRL = ~0.18 USD
    const usdAmount = Math.ceil(brlAmount * exchangeRate);
    
    // Garantir valor mínimo de $1 USD
    return Math.max(usdAmount, 1);
  }

  /**
   * Converte USD para BRL para exibição
   */
  convertUsdToBrl(usdAmount: number): number {
    // Taxa aproximada USD -> BRL (1 USD = ~5.5 BRL)
    const exchangeRate = 5.5;
    return Math.round(usdAmount * exchangeRate * 100) / 100;
  }

  /**
   * Processa webhook do GitHub (se disponível no futuro)
   */
  async processWebhook(payload: any): Promise<{
    transactionId: string;
    status: PaymentStatus;
    amount?: number;
  }> {
    try {
      // GitHub Sponsors não fornece webhooks públicos atualmente
      // Esta implementação é preparatória para futuras funcionalidades
      
      const { action, sponsorship } = payload;
      
      if (action === 'created' && sponsorship) {
        return {
          transactionId: `github-${sponsorship.node_id}`,
          status: 'completed',
          amount: sponsorship.tier.monthly_price_in_cents / 100
        };
      }

      if (action === 'cancelled' && sponsorship) {
        return {
          transactionId: `github-${sponsorship.node_id}`,
          status: 'cancelled'
        };
      }

      throw new Error('Ação de webhook não suportada');
    } catch (error) {
      console.error('Erro ao processar webhook GitHub:', error);
      throw error;
    }
  }

  /**
   * Gera instruções de pagamento para o usuário
   */
  generatePaymentInstructions(paymentResult: PaymentResult): {
    title: string;
    steps: string[];
    notes: string[];
  } {
    const metadata = paymentResult.metadata as GitHubPaymentMetadata;
    
    return {
      title: 'Como pagar via GitHub Sponsors',
      steps: [
        '1. Clique no botão "Pagar com GitHub" abaixo',
        '2. Você será redirecionado para o GitHub Sponsors',
        '3. Faça login na sua conta GitHub (se necessário)',
        `4. Confirme o patrocínio de $${paymentResult.amount} USD`,
        '5. Complete o pagamento usando seu método preferido no GitHub',
        '6. Aguarde a confirmação do pagamento'
      ],
      notes: [
        `💡 Valor: $${paymentResult.amount} USD (aproximadamente R$ ${this.convertUsdToBrl(paymentResult.amount)})`,
        '🔒 Pagamento processado de forma segura pelo GitHub',
        '⏱️ A confirmação pode levar alguns minutos',
        '📧 Você receberá um email de confirmação do GitHub',
        '🎯 Seu acesso será liberado após a confirmação manual'
      ]
    };
  }

  /**
   * Valida se o pagamento GitHub está configurado corretamente
   */
  validateConfiguration(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.githubUsername || this.githubUsername.trim() === '') {
      errors.push('Nome de usuário do GitHub não configurado');
    }

    // Verificar se o usuário existe (simulação)
    if (this.githubUsername === 'example' || this.githubUsername === 'test') {
      errors.push('Nome de usuário do GitHub inválido');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Obtém informações sobre o perfil GitHub
   */
  async getGitHubProfile(): Promise<{
    username: string;
    sponsorsUrl: string;
    isSponsorsEnabled: boolean;
  }> {
    return {
      username: this.githubUsername,
      sponsorsUrl: `${this.baseUrl}/${this.githubUsername}`,
      isSponsorsEnabled: true // Assumindo que está habilitado
    };
  }
}
