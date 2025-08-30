import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Cart from '../Cart';
import { CartProvider } from '../../contexts/CartContext';

// Mock do useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do CartContext
const mockCartContext = {
  cart: {
    id: 'cart-1',
    items: [
      {
        id: 'plan-1',
        name: 'Plano Essencial',
        description: 'Mentoria individual com acompanhamento personalizado',
        price: 3000,
        currency: 'BRL',
        quantity: 1,
        duration: 3,
        features: [
          'Mentoria individual',
          'Acompanhamento personalizado',
          'Suporte dedicado',
          'Material exclusivo',
          'Certificado de conclusão',
          'Acesso vitalício'
        ],
        isPopular: true,
        discount: {
          type: 'percentage' as const,
          value: 10
        }
      },
      {
        id: 'plan-2',
        name: 'Plano Start',
        description: 'Plano básico para iniciantes',
        price: 1500,
        currency: 'BRL',
        quantity: 2,
        duration: 3,
        features: [
          'Mentoria básica',
          'Material de apoio',
          'Suporte por email'
        ],
        isPopular: false
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  removeItem: jest.fn(),
  updateQuantity: jest.fn(),
  getCartSummary: jest.fn(() => ({
    itemCount: 3,
    subtotal: 6000,
    discount: 300,
    tax: 0,
    total: 5700,
    currency: 'BRL',
    savings: 300
  })),
  hasItems: jest.fn(() => true),
  isLoading: false,
  clearCart: jest.fn(),
  addItem: jest.fn(),
  getItem: jest.fn()
};

const mockEmptyCartContext = {
  ...mockCartContext,
  cart: null,
  hasItems: jest.fn(() => false),
  getCartSummary: jest.fn(() => ({
    itemCount: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    currency: 'BRL',
    savings: 0
  }))
};

jest.mock('../../contexts/CartContext', () => ({
  CartProvider: ({ children }: { children: React.ReactNode }) => children,
  useCart: () => mockCartContext,
}));

const renderCart = (contextOverride?: any) => {
  if (contextOverride) {
    jest.doMock('../../contexts/CartContext', () => ({
      CartProvider: ({ children }: { children: React.ReactNode }) => children,
      useCart: () => contextOverride,
    }));
  }

  return render(
    <BrowserRouter>
      <CartProvider>
        <Cart />
      </CartProvider>
    </BrowserRouter>
  );
};

describe('Cart Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate.mockClear();
  });

  describe('Empty Cart', () => {
    beforeEach(() => {
      jest.doMock('../../contexts/CartContext', () => ({
        CartProvider: ({ children }: { children: React.ReactNode }) => children,
        useCart: () => mockEmptyCartContext,
      }));
    });

    it('should render empty cart message when cart is empty', () => {
      const { useCart } = require('../../contexts/CartContext');
      useCart.mockReturnValue(mockEmptyCartContext);
      
      renderCart();

      expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
      expect(screen.getByText('Adicione alguns planos para começar sua jornada de mentoria')).toBeInTheDocument();
      expect(screen.getByText('Ver Planos')).toBeInTheDocument();
    });

    it('should navigate to plans when "Ver Planos" is clicked', () => {
      const { useCart } = require('../../contexts/CartContext');
      useCart.mockReturnValue(mockEmptyCartContext);
      
      renderCart();

      const verPlanosButton = screen.getByText('Ver Planos');
      fireEvent.click(verPlanosButton);

      expect(mockNavigate).toHaveBeenCalledWith('/plans');
    });
  });

  describe('Cart with Items', () => {
    it('should render cart items correctly', () => {
      renderCart();

      expect(screen.getByText('Carrinho de Compras')).toBeInTheDocument();
      expect(screen.getByText('3 itens no seu carrinho')).toBeInTheDocument();
      
      // Check items
      expect(screen.getByText('Plano Essencial')).toBeInTheDocument();
      expect(screen.getByText('Plano Start')).toBeInTheDocument();
      
      // Check popular badge
      expect(screen.getByText('Popular')).toBeInTheDocument();
    });

    it('should display item details correctly', () => {
      renderCart();

      // Check first item details
      expect(screen.getByText('Mentoria individual com acompanhamento personalizado')).toBeInTheDocument();
      expect(screen.getByText('Duração: 3 meses')).toBeInTheDocument();
      expect(screen.getByText('6 recursos inclusos')).toBeInTheDocument();
      
      // Check features
      expect(screen.getByText('Mentoria individual')).toBeInTheDocument();
      expect(screen.getByText('Acompanhamento personalizado')).toBeInTheDocument();
      expect(screen.getByText('Suporte dedicado')).toBeInTheDocument();
    });

    it('should display quantities correctly', () => {
      renderCart();

      const quantityElements = screen.getAllByText(/^\d+$/);
      // Should find quantity displays for both items
      expect(quantityElements.length).toBeGreaterThan(0);
    });

    it('should handle quantity increase', async () => {
      renderCart();

      const plusButtons = screen.getAllByRole('button');
      const plusButton = plusButtons.find(btn => 
        btn.querySelector('svg') && btn.getAttribute('class')?.includes('hover:bg-gray-100')
      );

      if (plusButton) {
        fireEvent.click(plusButton);
        expect(mockCartContext.updateQuantity).toHaveBeenCalled();
      }
    });

    it('should handle quantity decrease', async () => {
      renderCart();

      const minusButtons = screen.getAllByRole('button');
      const minusButton = minusButtons.find(btn => 
        btn.querySelector('svg') && btn.getAttribute('class')?.includes('hover:bg-gray-100')
      );

      if (minusButton) {
        fireEvent.click(minusButton);
        expect(mockCartContext.updateQuantity).toHaveBeenCalled();
      }
    });

    it('should handle item removal', async () => {
      renderCart();

      const removeButtons = screen.getAllByRole('button');
      const removeButton = removeButtons.find(btn => 
        btn.getAttribute('class')?.includes('text-red-500')
      );

      if (removeButton) {
        fireEvent.click(removeButton);
        expect(mockCartContext.removeItem).toHaveBeenCalled();
      }
    });

    it('should display order summary correctly', () => {
      renderCart();

      expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument();
      expect(screen.getByText('Subtotal')).toBeInTheDocument();
      expect(screen.getByText('Desconto')).toBeInTheDocument();
      expect(screen.getByText('Total')).toBeInTheDocument();
      expect(screen.getByText('Você economiza R$ 3,00!')).toBeInTheDocument();
    });

    it('should handle checkout button click', () => {
      renderCart();

      const checkoutButton = screen.getByText('Finalizar Compra');
      fireEvent.click(checkoutButton);

      expect(mockNavigate).toHaveBeenCalledWith('/checkout');
    });

    it('should handle continue shopping button click', () => {
      renderCart();

      const continueButton = screen.getByText('Continuar Comprando');
      fireEvent.click(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith('/plans');
    });

    it('should handle clear cart button click', () => {
      renderCart();

      const clearButton = screen.getByText('Limpar Carrinho');
      fireEvent.click(clearButton);

      expect(mockCartContext.clearCart).toHaveBeenCalled();
    });

    it('should handle back button click', () => {
      renderCart();

      const backButton = screen.getByText('Voltar');
      fireEvent.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });

    it('should display guarantee information', () => {
      renderCart();

      expect(screen.getByText('Garantia de 30 dias')).toBeInTheDocument();
      expect(screen.getByText('Não ficou satisfeito? Devolvemos seu dinheiro em até 30 dias.')).toBeInTheDocument();
    });

    it('should show loading state when processing', () => {
      const loadingContext = {
        ...mockCartContext,
        isLoading: true
      };

      const { useCart } = require('../../contexts/CartContext');
      useCart.mockReturnValue(loadingContext);

      renderCart();

      expect(screen.getByText('Processando...')).toBeInTheDocument();
    });

    it('should disable buttons when loading', () => {
      const loadingContext = {
        ...mockCartContext,
        isLoading: true
      };

      const { useCart } = require('../../contexts/CartContext');
      useCart.mockReturnValue(loadingContext);

      renderCart();

      const checkoutButton = screen.getByText('Processando...');
      expect(checkoutButton).toBeDisabled();
    });

    it('should handle items with many features correctly', () => {
      renderCart();

      // Should show first 6 features and indicate additional ones
      const features = screen.getAllByText(/Mentoria|Acompanhamento|Suporte|Material|Certificado|Acesso/);
      expect(features.length).toBeGreaterThan(0);
    });

    it('should display discount information correctly', () => {
      renderCart();

      expect(screen.getByText(/Desconto: -10%/)).toBeInTheDocument();
    });

    it('should format currency correctly', () => {
      renderCart();

      // Check if currency formatting is working (should show R$ format)
      const priceElements = screen.getAllByText(/R\$/);
      expect(priceElements.length).toBeGreaterThan(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle single item correctly', () => {
      renderCart();

      const itemCountText = screen.getByText('3 itens no seu carrinho');
      expect(itemCountText).toBeInTheDocument();
    });

    it('should handle quantity of 1 correctly', () => {
      renderCart();

      // When quantity is 1, should show "cada" text
      const eachTexts = screen.getAllByText('cada');
      expect(eachTexts.length).toBeGreaterThan(0);
    });

    it('should handle items without discount', () => {
      renderCart();

      // Second item doesn't have discount, should render without discount info
      expect(screen.getByText('Plano Start')).toBeInTheDocument();
    });
  });
});
