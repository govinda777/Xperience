import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { GitHubPaymentComponent } from '../../../components/payments/GitHubPaymentComponent';
import { GitHubPaymentProvider } from '../../../services/providers/githubPaymentProvider';

// Mock do provider
jest.mock('../../../services/providers/githubPaymentProvider');

const MockedGitHubPaymentProvider = GitHubPaymentProvider as jest.MockedClass<typeof GitHubPaymentProvider>;

describe('GitHubPaymentComponent', () => {
  const defaultProps = {
    amount: 100,
    planId: 'plan-1',
    userId: 'user-1',
    onPaymentComplete: jest.fn(),
    onPaymentError: jest.fn(),
    onCancel: jest.fn()
  };

  const mockPaymentResult = {
    transactionId: 'github-test-123',
    paymentUrl: 'https://github.com/sponsors/testuser/sponsorships?sponsor=testuser&frequency=one-time&amount=18&preview=true',
    amount: 18,
    currency: 'USD' as const,
    metadata: {
      username: 'testuser',
      sponsorshipUrl: 'https://github.com/sponsors/testuser/sponsorships?sponsor=testuser&frequency=one-time&amount=18&preview=true',
      amount: 18,
      frequency: 'one-time',
      planId: 'plan-1',
      userId: 'user-1',
      externalReference: 'user-1-plan-1-123456789'
    }
  };

  const mockInstructions = {
    title: 'Como pagar via GitHub Sponsors',
    steps: [
      '1. Clique no botão "Pagar com GitHub" abaixo',
      '2. Você será redirecionado para o GitHub Sponsors',
      '3. Faça login na sua conta GitHub (se necessário)',
      '4. Confirme o patrocínio de $18 USD',
      '5. Complete o pagamento usando seu método preferido no GitHub',
      '6. Aguarde a confirmação do pagamento'
    ],
    notes: [
      '💡 Valor: $18 USD (aproximadamente R$ 99.00)',
      '🔒 Pagamento processado de forma segura pelo GitHub',
      '⏱️ A confirmação pode levar alguns minutos',
      '📧 Você receberá um email de confirmação do GitHub',
      '🎯 Seu acesso será liberado após a confirmação manual'
    ]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    MockedGitHubPaymentProvider.mockImplementation(() => ({
      validateConfiguration: jest.fn().mockReturnValue({ isValid: true, errors: [] }),
      process: jest.fn().mockResolvedValue(mockPaymentResult),
      generatePaymentInstructions: jest.fn().mockReturnValue(mockInstructions),
      convertUsdToBrl: jest.fn().mockReturnValue(99.00),
      verify: jest.fn().mockResolvedValue('pending'),
      cancel: jest.fn().mockResolvedValue(false),
      processWebhook: jest.fn(),
      getGitHubProfile: jest.fn(),
      id: 'github',
      name: 'GitHub Pay',
      type: 'fiat',
      supportedCurrencies: ['USD']
    } as any));
  });

  describe('Renderização inicial', () => {
    it('deve renderizar estado de carregamento', () => {
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      expect(screen.getByText('Preparando pagamento GitHub...')).toBeInTheDocument();
    });

    it('deve renderizar componente após inicialização', async () => {
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });

      expect(screen.getByText('Patrocine via GitHub Sponsors')).toBeInTheDocument();
      expect(screen.getByText('$18 USD')).toBeInTheDocument();
      expect(screen.getByText('≈ R$ 99.00')).toBeInTheDocument();
    });
  });

  describe('Exibição de informações', () => {
    beforeEach(async () => {
      render(<GitHubPaymentComponent {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });
    });

    it('deve exibir valor correto', () => {
      expect(screen.getByText('$18 USD')).toBeInTheDocument();
      expect(screen.getByText('≈ R$ 99.00')).toBeInTheDocument();
    });

    it('deve exibir status inicial como pendente', () => {
      expect(screen.getByText('Aguardando pagamento')).toBeInTheDocument();
    });

    it('deve exibir instruções de pagamento', () => {
      expect(screen.getByText('Como pagar via GitHub Sponsors')).toBeInTheDocument();
      expect(screen.getByText(/Clique no botão "Pagar com GitHub"/)).toBeInTheDocument();
      expect(screen.getByText(/Você será redirecionado para o GitHub Sponsors/)).toBeInTheDocument();
    });

    it('deve exibir notas importantes', () => {
      expect(screen.getByText(/Valor: \$18 USD/)).toBeInTheDocument();
      expect(screen.getByText(/🔒 Pagamento processado de forma segura pelo GitHub/)).toBeInTheDocument();
    });

    it('deve exibir informações do GitHub', () => {
      expect(screen.getByText('Patrocinando: @testuser')).toBeInTheDocument();
      expect(screen.getByText('Ver perfil GitHub →')).toBeInTheDocument();
    });
  });

  describe('Interações do usuário', () => {
    beforeEach(async () => {
      render(<GitHubPaymentComponent {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });
    });

    it('deve abrir GitHub Sponsors ao clicar no botão de pagamento', () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation();
      
      const payButton = screen.getByText('Pagar com GitHub Sponsors');
      fireEvent.click(payButton);
      
      expect(openSpy).toHaveBeenCalledWith(
        mockPaymentResult.paymentUrl,
        '_blank',
        'noopener,noreferrer'
      );
      
      openSpy.mockRestore();
    });

    it('deve atualizar status para processando após clicar em pagar', async () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation();
      
      const payButton = screen.getByText('Pagar com GitHub Sponsors');
      fireEvent.click(payButton);
      
      await waitFor(() => {
        expect(screen.getByText('Processando pagamento...')).toBeInTheDocument();
      });
      
      openSpy.mockRestore();
    });

    it('deve permitir confirmação manual', async () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation();
      
      // Clicar em pagar primeiro
      const payButton = screen.getByText('Pagar com GitHub Sponsors');
      fireEvent.click(payButton);
      
      await waitFor(() => {
        expect(screen.getByText('✅ Já paguei - Confirmar manualmente')).toBeInTheDocument();
      });
      
      // Clicar em confirmar manualmente
      const confirmButton = screen.getByText('✅ Já paguei - Confirmar manualmente');
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Obrigado pelo seu patrocínio/)).toBeInTheDocument();
      });
      
      expect(defaultProps.onPaymentComplete).toHaveBeenCalledWith(mockPaymentResult);
      
      openSpy.mockRestore();
    });

    it('deve chamar onCancel ao clicar no botão de cancelar', () => {
      const cancelButton = screen.getByText('✕');
      fireEvent.click(cancelButton);
      
      expect(defaultProps.onCancel).toHaveBeenCalled();
    });
  });

  describe('Estados do pagamento', () => {
    it('deve exibir estado de processamento corretamente', async () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation();
      
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });
      
      const payButton = screen.getByText('Pagar com GitHub Sponsors');
      fireEvent.click(payButton);
      
      await waitFor(() => {
        expect(screen.getByText('🔄')).toBeInTheDocument();
        expect(screen.getByText('Processando pagamento...')).toBeInTheDocument();
        expect(screen.getByText('Pagamento em andamento!')).toBeInTheDocument();
      });
      
      openSpy.mockRestore();
    });

    it('deve exibir estado de conclusão corretamente', async () => {
      const openSpy = jest.spyOn(window, 'open').mockImplementation();
      
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });
      
      // Simular fluxo completo
      const payButton = screen.getByText('Pagar com GitHub Sponsors');
      fireEvent.click(payButton);
      
      await waitFor(() => {
        expect(screen.getByText('✅ Já paguei - Confirmar manualmente')).toBeInTheDocument();
      });
      
      const confirmButton = screen.getByText('✅ Já paguei - Confirmar manualmente');
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        expect(screen.getByText('🎉')).toBeInTheDocument();
        expect(screen.getByText(/Obrigado pelo seu patrocínio/)).toBeInTheDocument();
      });
      
      openSpy.mockRestore();
    });
  });

  describe('Tratamento de erros', () => {
    it('deve exibir erro quando validação falha', async () => {
      MockedGitHubPaymentProvider.mockImplementation(() => ({
        validateConfiguration: jest.fn().mockReturnValue({ 
          isValid: false, 
          errors: ['Configuração inválida'] 
        }),
        process: jest.fn(),
        generatePaymentInstructions: jest.fn(),
        convertUsdToBrl: jest.fn(),
        verify: jest.fn(),
        cancel: jest.fn(),
        processWebhook: jest.fn(),
        getGitHubProfile: jest.fn(),
        id: 'github',
        name: 'GitHub Pay',
        type: 'fiat',
        supportedCurrencies: ['USD']
      } as any));
      
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      await waitFor(() => {
        expect(defaultProps.onPaymentError).toHaveBeenCalledWith(
          'Configuração inválida: Configuração inválida'
        );
      });
    });

    it('deve exibir erro quando processamento falha', async () => {
      MockedGitHubPaymentProvider.mockImplementation(() => ({
        validateConfiguration: jest.fn().mockReturnValue({ isValid: true, errors: [] }),
        process: jest.fn().mockRejectedValue(new Error('Erro no processamento')),
        generatePaymentInstructions: jest.fn(),
        convertUsdToBrl: jest.fn(),
        verify: jest.fn(),
        cancel: jest.fn(),
        processWebhook: jest.fn(),
        getGitHubProfile: jest.fn(),
        id: 'github',
        name: 'GitHub Pay',
        type: 'fiat',
        supportedCurrencies: ['USD']
      } as any));
      
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      await waitFor(() => {
        expect(defaultProps.onPaymentError).toHaveBeenCalledWith(
          'Erro no processamento'
        );
      });
    });

    it('deve exibir componente de erro quando inicialização falha', async () => {
      MockedGitHubPaymentProvider.mockImplementation(() => ({
        validateConfiguration: jest.fn().mockReturnValue({ isValid: true, errors: [] }),
        process: jest.fn().mockRejectedValue(new Error('Falha na inicialização')),
        generatePaymentInstructions: jest.fn(),
        convertUsdToBrl: jest.fn(),
        verify: jest.fn(),
        cancel: jest.fn(),
        processWebhook: jest.fn(),
        getGitHubProfile: jest.fn(),
        id: 'github',
        name: 'GitHub Pay',
        type: 'fiat',
        supportedCurrencies: ['USD']
      } as any));
      
      render(<GitHubPaymentComponent {...defaultProps} />);
      
      await waitFor(() => {
        expect(defaultProps.onPaymentError).toHaveBeenCalled();
      });
    });
  });

  describe('Links externos', () => {
    beforeEach(async () => {
      render(<GitHubPaymentComponent {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });
    });

    it('deve ter link para perfil GitHub com atributos corretos', () => {
      const profileLink = screen.getByText('Ver perfil GitHub →');
      
      expect(profileLink).toHaveAttribute('href', 'https://github.com/testuser');
      expect(profileLink).toHaveAttribute('target', '_blank');
      expect(profileLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  describe('Acessibilidade', () => {
    beforeEach(async () => {
      render(<GitHubPaymentComponent {...defaultProps} />);
      await waitFor(() => {
        expect(screen.getByText('GitHub Pay')).toBeInTheDocument();
      });
    });

    it('deve ter botões com texto descritivo', () => {
      expect(screen.getByText('Pagar com GitHub Sponsors')).toBeInTheDocument();
      expect(screen.getByText('✕')).toBeInTheDocument();
    });

    it('deve ter informações de segurança visíveis', () => {
      expect(screen.getByText(/Pagamento processado de forma segura pelo GitHub Sponsors/)).toBeInTheDocument();
      expect(screen.getByText(/Seus dados estão protegidos/)).toBeInTheDocument();
    });
  });
});
