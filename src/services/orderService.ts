// Serviço para gerenciamento de pedidos
import { Order, CheckoutSession, CustomerInfo, Address } from "../types/cart";
import { PaymentStatus } from "../types/payment";

export class OrderService {
  private apiUrl = process.env.VITE_API_URL || "http://localhost:3001/api";
  private _ordersCache: Order[] | null = null;

  // Criar um novo pedido
  async createOrder(
    checkoutSession: CheckoutSession,
    paymentMethod: "pix" | "bitcoin" | "usdt" | "github",
  ): Promise<Order> {
    try {
      const response = await fetch(`${this.apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          checkoutSessionId: checkoutSession.id,
          userId: checkoutSession.userId,
          items: [], // Será preenchido com os itens do carrinho
          paymentMethod,
          customerInfo: checkoutSession.customerInfo,
          billingAddress: checkoutSession.billingAddress,
          total: checkoutSession.total,
          currency: checkoutSession.currency,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao criar pedido:", error);

      // Fallback: criar pedido localmente se API não estiver disponível
      const order: Order = {
        id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        checkoutSessionId: checkoutSession.id,
        userId: checkoutSession.userId,
        items: [], // Será preenchido posteriormente
        status: "pending",
        paymentStatus: "pending",
        paymentMethod,
        subtotal: checkoutSession.total,
        discount: 0,
        tax: 0,
        total: checkoutSession.total,
        currency: checkoutSession.currency,
        customerInfo: checkoutSession.customerInfo,
        billingAddress: checkoutSession.billingAddress,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Salvar localmente
      this.saveOrderLocally(order);
      return order;
    }
  }

  // Atualizar status do pedido
  async updateOrderStatus(
    orderId: string,
    status: Order["status"],
  ): Promise<Order> {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update order status: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);

      // Fallback: atualizar localmente
      const order = this.getOrderLocally(orderId);
      if (order) {
        order.status = status;
        order.updatedAt = new Date();
        if (status === "completed") {
          order.completedAt = new Date();
        }
        this.saveOrderLocally(order);
        return order;
      }

      throw error;
    }
  }

  // Atualizar status do pagamento
  async updatePaymentStatus(
    orderId: string,
    paymentStatus: PaymentStatus,
    paymentId?: string,
    transactionHash?: string,
  ): Promise<Order> {
    try {
      const response = await fetch(
        `${this.apiUrl}/orders/${orderId}/payment-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus,
            paymentId,
            transactionHash,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update payment status: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao atualizar status do pagamento:", error);

      // Fallback: atualizar localmente
      const order = this.getOrderLocally(orderId);
      if (order) {
        order.paymentStatus = paymentStatus as
          | "pending"
          | "processing"
          | "completed"
          | "failed"
          | "refunded";
        order.paymentId = paymentId;
        order.transactionHash = transactionHash;
        order.updatedAt = new Date();

        // Atualizar status do pedido baseado no pagamento
        if (paymentStatus === "completed") {
          order.status = "confirmed";
          order.completedAt = new Date();
        } else if (paymentStatus === "failed") {
          order.status = "cancelled";
        }

        this.saveOrderLocally(order);
        return order;
      }

      throw error;
    }
  }

  // Obter pedido por ID
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}`);

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`Failed to get order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao obter pedido:", error);

      // Fallback: buscar localmente
      return this.getOrderLocally(orderId);
    }
  }

  // Obter pedidos do usuário
  async getUserOrders(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ): Promise<Order[]> {
    try {
      const response = await fetch(
        `${this.apiUrl}/orders/user/${userId}?limit=${limit}&offset=${offset}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to get user orders: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao obter pedidos do usuário:", error);

      // Fallback: buscar localmente
      return this.getUserOrdersLocally(userId);
    }
  }

  // Cancelar pedido
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/cancel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error(`Failed to cancel order: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);

      // Fallback: cancelar localmente
      const order = this.getOrderLocally(orderId);
      if (order) {
        order.status = "cancelled";
        order.updatedAt = new Date();
        order.metadata = {
          ...order.metadata,
          cancellationReason: reason,
          cancelledAt: new Date().toISOString(),
        };
        this.saveOrderLocally(order);
        return order;
      }

      throw error;
    }
  }

  // Solicitar reembolso
  async requestRefund(orderId: string, reason: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}/refund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason }),
      });

      return response.ok;
    } catch (error) {
      console.error("Erro ao solicitar reembolso:", error);

      // Fallback: marcar como solicitação de reembolso localmente
      const order = this.getOrderLocally(orderId);
      if (order) {
        order.metadata = {
          ...order.metadata,
          refundRequested: true,
          refundReason: reason,
          refundRequestedAt: new Date().toISOString(),
        };
        this.saveOrderLocally(order);
        return true;
      }

      return false;
    }
  }

  // Obter estatísticas de pedidos
  async getOrderStats(userId: string): Promise<{
    totalOrders: number;
    completedOrders: number;
    pendingOrders: number;
    cancelledOrders: number;
    totalSpent: number;
  }> {
    try {
      const response = await fetch(
        `${this.apiUrl}/orders/user/${userId}/stats`,
      );

      if (!response.ok) {
        throw new Error(`Failed to get order stats: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Erro ao obter estatísticas:", error);

      // Fallback: calcular localmente
      const orders = this.getUserOrdersLocally(userId);
      return {
        totalOrders: orders.length,
        completedOrders: orders.filter((o) => o.status === "completed").length,
        pendingOrders: orders.filter((o) => o.status === "pending").length,
        cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
        totalSpent: orders
          .filter((o) => o.status === "completed")
          .reduce((sum, o) => sum + o.total, 0),
      };
    }
  }

  // Métodos de fallback para armazenamento local
  private saveOrderLocally(order: Order): void {
    try {
      const orders = this.getAllOrdersLocally();
      const existingIndex = orders.findIndex((o) => o.id === order.id);

      if (existingIndex >= 0) {
        orders[existingIndex] = order;
      } else {
        orders.push(order);
      }

      this._ordersCache = orders;
      localStorage.setItem("xperience_orders", JSON.stringify(orders));
    } catch (error) {
      console.error("Erro ao salvar pedido localmente:", error);
    }
  }

  private getOrderLocally(orderId: string): Order | null {
    try {
      const orders = this.getAllOrdersLocally();
      return orders.find((o) => o.id === orderId) || null;
    } catch (error) {
      console.error("Erro ao obter pedido localmente:", error);
      return null;
    }
  }

  private getUserOrdersLocally(userId: string): Order[] {
    try {
      const orders = this.getAllOrdersLocally();
      return orders.filter((o) => o.userId === userId);
    } catch (error) {
      console.error("Erro ao obter pedidos do usuário localmente:", error);
      return [];
    }
  }

  private getAllOrdersLocally(): Order[] {
    try {
      if (this._ordersCache) {
        return this._ordersCache;
      }

      const ordersJson = localStorage.getItem("xperience_orders");
      if (!ordersJson) return [];

      const orders = JSON.parse(ordersJson);
      // Converter strings de data de volta para objetos Date
      const parsedOrders = orders.map((order: any) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        completedAt: order.completedAt
          ? new Date(order.completedAt)
          : undefined,
      }));

      this._ordersCache = parsedOrders;
      return parsedOrders;
    } catch (error) {
      console.error("Erro ao obter todos os pedidos localmente:", error);
      return [];
    }
  }

  // Limpar dados locais (para desenvolvimento)
  clearLocalData(): void {
    localStorage.removeItem("xperience_orders");
    this._ordersCache = null;
  }
}

// Instância singleton
export const orderService = new OrderService();
