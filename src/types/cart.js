// Tipos para o sistema de carrinho de compras
// Utilitários
export const calculateCartTotals = (items, coupon) => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let discount = 0;
    if (coupon) {
        if (coupon.type === "percentage") {
            discount = (subtotal * coupon.value) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }
        else {
            discount = coupon.value;
        }
    }
    // Adicionar desconto por item se aplicável
    const itemDiscounts = items.reduce((sum, item) => {
        if (item.discount) {
            if (item.discount.type === "percentage") {
                return sum + (item.price * item.quantity * item.discount.value) / 100;
            }
            else {
                return sum + item.discount.value * item.quantity;
            }
        }
        return sum;
    }, 0);
    discount += itemDiscounts;
    // Calcular impostos (se aplicável)
    const tax = 0; // Por enquanto sem impostos
    const total = Math.max(0, subtotal - discount + tax);
    return {
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        subtotal,
        discount,
        tax,
        total,
        currency: items[0]?.currency || "BRL",
        savings: discount,
    };
};
export const formatCurrency = (amount, currency) => {
    switch (currency) {
        case "BRL":
            return new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
            }).format(amount);
        case "USD":
            return new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
            }).format(amount);
        case "BTC":
            return `₿ ${amount.toFixed(8)}`;
        case "USDT":
            return `${amount.toFixed(2)} USDT`;
        default:
            return amount.toString();
    }
};
