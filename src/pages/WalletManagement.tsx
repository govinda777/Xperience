import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import WalletInfo from '../components/WalletInfo';
import Transaction from '../components/Transaction';

/**
 * Wallet Management Page
 */
const WalletManagement: React.FC = () => {
  const { authenticated, ready, login, user } = usePrivy();

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border">
          <h2 className="text-2xl font-bold mb-4">Gerencie sua Carteira Digital</h2>
          <p className="text-gray-600 mb-6">
            Faça login para acessar sua carteira digital e gerenciar suas transações.
          </p>
          <button
            onClick={() => login()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Fazer Login
          </button>
          
          <div className="mt-10 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-2">Recursos da Carteira</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="p-4 bg-blue-50 rounded-md">
                <h4 className="font-medium text-blue-800">Sem Gas</h4>
                <p className="text-sm text-gray-600 mt-1">Transações sem custos de gas para você</p>
              </div>
              <div className="p-4 bg-green-50 rounded-md">
                <h4 className="font-medium text-green-800">Recuperação Social</h4>
                <p className="text-sm text-gray-600 mt-1">Nunca perca acesso à sua carteira</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-md">
                <h4 className="font-medium text-purple-800">Segurança Avançada</h4>
                <p className="text-sm text-gray-600 mt-1">Proteção com tecnologia de contrato inteligente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Sua Carteira Digital</h2>
        <p className="text-gray-600 mt-1">
          Bem-vindo(a), {user?.email?.address?.split("@")[0] || user?.wallet?.address?.slice(0, 10) + "..." || 'Usuário'}! Gerencie sua carteira e faça transações.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <WalletInfo />
        </div>
        <div>
          <Transaction />
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Sobre Carteiras ERC-4337</h3>
        <p className="text-sm text-gray-700">
          Sua carteira utiliza a tecnologia de Account Abstraction (ERC-4337), que oferece recursos avançados
          como recuperação de acesso, transações sem gas, e maior segurança. Todos esses benefícios são gerenciados
          automaticamente para você.
        </p>
        <p className="text-sm text-gray-700 mt-2">
          Quando você faz login com sua conta, nossa plataforma vincula uma carteira digital única para você,
          não sendo necessário instalar nenhum software adicional ou extensão de navegador.
        </p>
      </div>
    </div>
  );
};

export default WalletManagement; 