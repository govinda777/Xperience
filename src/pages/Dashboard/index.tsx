import React from "react";
import { Link } from "react-router-dom";
import { usePrivy } from "@privy-io/react-auth";

const Dashboard = () => {
  const { user, logout, ready } = usePrivy();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-xl font-medium">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Área Logada</h1>
          <p className="mt-2 text-amber-100">
            Bem-vindo à sua área exclusiva de usuário
          </p>
        </div>

        {/* User Profile Section */}
        <div className="p-6 flex flex-col md:flex-row border-b">
          <div className="flex-shrink-0 mb-4 md:mb-0">
            <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-2xl text-gray-600">
                {(
                  user?.email?.address?.charAt(0) ||
                  user?.wallet?.address?.charAt(0) ||
                  "U"
                ).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="md:ml-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {user?.email?.address?.split("@")[0] ||
                user?.wallet?.address?.slice(0, 10) + "..." ||
                "Usuário"}
            </h2>
            <p className="text-gray-600">
              {user?.email?.address || user?.wallet?.address || "Usuário Privy"}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
              >
                Sair da conta
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition">
                Editar perfil
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Activity Summary */}
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Resumo de Atividades
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Projetos ativos</span>
                <span className="font-medium">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tarefas pendentes</span>
                <span className="font-medium">7</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Mensagens não lidas</span>
                <span className="font-medium">2</span>
              </div>
              <div className="mt-4">
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  Ver detalhes →
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-50 p-5 rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Atividades Recentes
            </h3>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-3">
                <p className="text-gray-800">Relatório gerado com sucesso</p>
                <p className="text-sm text-gray-500">Há 2 horas</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="text-gray-800">Novo projeto criado</p>
                <p className="text-sm text-gray-500">Ontem às 16:45</p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-3">
                <p className="text-gray-800">Feedback recebido do cliente</p>
                <p className="text-sm text-gray-500">3 dias atrás</p>
              </div>
              <div className="mt-4">
                <button className="text-orange-600 hover:text-orange-700 font-medium">
                  Ver todas atividades →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access */}
        <div className="p-6 border-t">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Acesso Rápido
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-orange-100 p-4 rounded-lg text-center cursor-pointer hover:bg-orange-200 transition">
              <div className="text-orange-700 text-2xl mb-2">📊</div>
              <div className="text-gray-800 font-medium">Relatórios</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg text-center cursor-pointer hover:bg-green-200 transition">
              <div className="text-green-700 text-2xl mb-2">📁</div>
              <div className="text-gray-800 font-medium">Projetos</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center cursor-pointer hover:bg-yellow-200 transition">
              <div className="text-yellow-700 text-2xl mb-2">📝</div>
              <div className="text-gray-800 font-medium">Tarefas</div>
            </div>
            <div className="bg-purple-100 p-4 rounded-lg text-center cursor-pointer hover:bg-purple-200 transition">
              <div className="text-purple-700 text-2xl mb-2">🤝</div>
              <div className="text-gray-800 font-medium">Comunidade</div>
            </div>
            <Link
              to="/agents"
              className="bg-blue-100 p-4 rounded-lg text-center cursor-pointer hover:bg-blue-200 transition"
            >
              <div className="text-blue-700 text-2xl mb-2">🤖</div>
              <div className="text-gray-800 font-medium">Agentes</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
