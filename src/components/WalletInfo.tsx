import React from "react";
import { useUserWallet } from "../hooks/useUserWallet";

/**
 * Component to display wallet information
 */
const WalletInfo: React.FC = () => {
  const { walletData, isLoading, error, refreshBalance } = useUserWallet();

  if (isLoading) {
    return (
      <div className="p-4 border rounded shadow-sm">
        Carregando dados da carteira...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded shadow-sm bg-red-50 text-red-600">
        <p>Erro ao carregar carteira: {error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!walletData) {
    return (
      <div className="p-4 border rounded shadow-sm">
        Conecte-se para visualizar sua carteira
      </div>
    );
  }

  // Format the wallet address to show only first and last characters
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="p-4 border rounded shadow-sm bg-white">
      <h3 className="text-lg font-semibold mb-4">Sua Carteira</h3>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Endereço:</span>
          <span className="font-mono bg-gray-100 p-1 rounded text-sm">
            {formatAddress(walletData.smartAccountAddress)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-600">Saldo:</span>
          <span className="font-semibold">
            {Number(walletData.balance).toFixed(4)} ETH
          </span>
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={refreshBalance}
        >
          Atualizar Saldo
        </button>
      </div>

      <div className="mt-4 pt-4 border-t text-xs text-gray-500">
        <p>Carteira ERC-4337 - Conta Inteligente</p>
        <p className="mt-1">
          <a
            href={`https://etherscan.io/address/${walletData.smartAccountAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Ver no Etherscan →
          </a>
        </p>
      </div>
    </div>
  );
};

export default WalletInfo;
