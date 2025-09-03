import React, { useState } from "react";
import { useUserWallet } from "../hooks/useUserWallet";

/**
 * Transaction component for sending ETH transactions
 */
const Transaction: React.FC = () => {
  const { walletData, isLoading, error, sendTransaction } = useUserWallet();

  const [recipient, setRecipient] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);

  /**
   * Handle form submission to send a transaction
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipient || !amount || parseFloat(amount) <= 0) {
      setTxError("Por favor, preencha todos os campos corretamente");
      return;
    }

    setTxHash(null);
    setTxError(null);
    setIsSending(true);

    try {
      // Convert amount to Wei (1 ETH = 10^18 Wei)
      const valueInEther = amount;

      // Send the transaction
      const hash = await sendTransaction({
        to: recipient,
        value: valueInEther,
      });

      // Set the transaction hash
      setTxHash(hash);

      // Clear form
      setRecipient("");
      setAmount("");
    } catch (err) {
      console.error("Transaction error:", err);
      setTxError(
        err instanceof Error ? err.message : "Erro ao enviar transação",
      );
    } finally {
      setIsSending(false);
    }
  };

  if (!walletData) {
    return (
      <div className="p-4 border rounded shadow-sm">
        Conecte-se para enviar transações
      </div>
    );
  }

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Enviar Transação</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Endereço do Destinatário
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            placeholder="0x..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSending || isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Valor (ETH)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.01"
            step="0.000001"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            disabled={isSending || isLoading}
          />
          {walletData && (
            <p className="text-xs text-gray-500 mt-1">
              Saldo disponível: {Number(walletData.balance).toFixed(4)} ETH
            </p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={isSending || isLoading || !recipient || !amount}
          >
            {isSending ? "Enviando..." : "Enviar Transação"}
          </button>
        </div>
      </form>

      {txHash && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
          <p className="text-green-700 text-sm font-medium">
            Transação enviada com sucesso!
          </p>
          <p className="text-xs mt-1 font-mono break-all">{txHash}</p>
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-600 hover:underline mt-2 inline-block"
          >
            Ver no Etherscan →
          </a>
        </div>
      )}

      {(txError || error) && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-700 text-sm">{txError || error}</p>
        </div>
      )}
    </div>
  );
};

export default Transaction;
