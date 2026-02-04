import React, { useState } from "react";
import { useCart } from "../../contexts/CartContext";
import { useAuth } from "../../contexts/AuthContext";
import { CustomerInfo, Address } from "../../types/cart";
import { formatCurrency } from "../../types/cart";
import { CreditCard, User, MapPin, Phone, Mail, FileText } from "lucide-react";

interface CheckoutFormProps {
  onNext: (customerInfo: CustomerInfo, billingAddress?: Address) => void;
  isLoading?: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  onNext,
  isLoading = false,
}) => {
  const { cart, getCartSummary } = useCart();
  const { user } = useAuth();
  const summary = getCartSummary();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: user?.google?.name || user?.github?.name || "",
    email: user?.email?.address || "",
    phone: "",
    document: "",
    documentType: "cpf",
  });

  const [billingAddress, setBillingAddress] = useState<Address>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zipCode: "",
    country: "BR",
  });

  const [useAddress, setUseAddress] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validar informações do cliente
    if (!customerInfo.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!customerInfo.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = "Email inválido";
    }

    if (!customerInfo.phone?.trim()) {
      newErrors.phone = "Telefone é obrigatório";
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/.test(customerInfo.phone)) {
      newErrors.phone = "Telefone inválido (ex: (11) 99999-9999)";
    }

    if (customerInfo.document && customerInfo.documentType === "cpf") {
      const cpf = customerInfo.document.replace(/\D/g, "");
      if (cpf.length !== 11) {
        newErrors.document = "CPF deve ter 11 dígitos";
      }
    }

    if (customerInfo.document && customerInfo.documentType === "cnpj") {
      const cnpj = customerInfo.document.replace(/\D/g, "");
      if (cnpj.length !== 14) {
        newErrors.document = "CNPJ deve ter 14 dígitos";
      }
    }

    // Validar endereço se necessário
    if (useAddress) {
      if (!billingAddress.street.trim()) {
        newErrors.street = "Rua é obrigatória";
      }
      if (!billingAddress.number.trim()) {
        newErrors.number = "Número é obrigatório";
      }
      if (!billingAddress.neighborhood.trim()) {
        newErrors.neighborhood = "Bairro é obrigatório";
      }
      if (!billingAddress.city.trim()) {
        newErrors.city = "Cidade é obrigatória";
      }
      if (!billingAddress.state.trim()) {
        newErrors.state = "Estado é obrigatório";
      }
      if (!billingAddress.zipCode.trim()) {
        newErrors.zipCode = "CEP é obrigatório";
      } else if (!/^\d{5}-?\d{3}$/.test(billingAddress.zipCode)) {
        newErrors.zipCode = "CEP inválido (ex: 12345-678)";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onNext(customerInfo, useAddress ? billingAddress : undefined);
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 10) {
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
  };

  const formatDocument = (value: string, type: "cpf" | "cnpj") => {
    const numbers = value.replace(/\D/g, "");
    if (type === "cpf") {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else {
      return numbers.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5",
      );
    }
  };

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    return numbers.replace(/(\d{5})(\d{3})/, "$1-$2");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Formulário */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Informações do Cliente */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Informações Pessoais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: formatPhone(e.target.value),
                      })
                    }
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={customerInfo.documentType}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          documentType: e.target.value as "cpf" | "cnpj",
                          document: "",
                        })
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="cpf">CPF</option>
                      <option value="cnpj">CNPJ</option>
                    </select>
                    <input
                      type="text"
                      value={customerInfo.document}
                      onChange={(e) =>
                        setCustomerInfo({
                          ...customerInfo,
                          document: formatDocument(
                            e.target.value,
                            customerInfo.documentType || "cpf",
                          ),
                        })
                      }
                      className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.document ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder={
                        customerInfo.documentType === "cpf"
                          ? "000.000.000-00"
                          : "00.000.000/0000-00"
                      }
                      maxLength={customerInfo.documentType === "cpf" ? 14 : 18}
                    />
                  </div>
                  {errors.document && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.document}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço de Cobrança */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Endereço de Cobrança
                </h3>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useAddress}
                    onChange={(e) => setUseAddress(e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Adicionar endereço</span>
                </label>
              </div>

              {useAddress && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CEP *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.zipCode}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          zipCode: formatZipCode(e.target.value),
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.zipCode ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="12345-678"
                      maxLength={9}
                    />
                    {errors.zipCode && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.zipCode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rua *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.street}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          street: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.street ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nome da rua"
                    />
                    {errors.street && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.street}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.number}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          number: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.number ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="123"
                    />
                    {errors.number && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      type="text"
                      value={billingAddress.complement}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          complement: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Apto, sala, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bairro *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.neighborhood}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          neighborhood: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.neighborhood
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Nome do bairro"
                    />
                    {errors.neighborhood && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.neighborhood}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      value={billingAddress.city}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          city: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Nome da cidade"
                    />
                    {errors.city && (
                      <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Estado *
                    </label>
                    <select
                      value={billingAddress.state}
                      onChange={(e) =>
                        setBillingAddress({
                          ...billingAddress,
                          state: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.state ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Selecione o estado</option>
                      <option value="SP">São Paulo</option>
                      <option value="RJ">Rio de Janeiro</option>
                      <option value="MG">Minas Gerais</option>
                      <option value="RS">Rio Grande do Sul</option>
                      <option value="PR">Paraná</option>
                      <option value="SC">Santa Catarina</option>
                      {/* Adicione outros estados conforme necessário */}
                    </select>
                    {errors.state && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.state}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Botão de Continuar */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Continuar para Pagamento
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Resumo do Pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Resumo do Pedido</h3>

            <div className="space-y-3 mb-4">
              {cart?.items.map((item) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity}x • {item.duration} meses
                    </p>
                  </div>
                  <p className="font-medium text-sm">
                    {formatCurrency(item.price * item.quantity, item.currency)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>
                  {formatCurrency(summary.subtotal, summary.currency)}
                </span>
              </div>

              {summary.discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Desconto</span>
                  <span>
                    -{formatCurrency(summary.discount, summary.currency)}
                  </span>
                </div>
              )}

              {summary.tax > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Impostos</span>
                  <span>{formatCurrency(summary.tax, summary.currency)}</span>
                </div>
              )}

              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrency(summary.total, summary.currency)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;
