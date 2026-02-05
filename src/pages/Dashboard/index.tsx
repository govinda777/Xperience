import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bot, BarChart3, Folder, Settings } from "lucide-react";

const Dashboard = () => {
  const { user, logout, ready } = useAuth();
  const navigate = useNavigate();

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
      <div className="bg-white shadow-lg rounded-lg overflow-hidden min-h-[80vh]">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-600 p-6 text-white">
          <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Área Logada</h1>
                <p className="mt-2 text-amber-100">
                    Bem-vindo à sua área exclusiva de usuário
                </p>
              </div>
              <button
                onClick={() => logout()}
                className="px-4 py-2 bg-black/20 text-white rounded hover:bg-black/30 transition text-sm font-medium"
              >
                Sair
              </button>
          </div>
        </div>

        {/* User Profile Summary */}
        <div className="bg-gray-50 border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-200 flex items-center justify-center text-orange-700 font-bold">
                    {(user?.email?.address?.charAt(0) || user?.wallet?.address?.charAt(0) || "U").toUpperCase()}
                </div>
                <div className="text-sm">
                    <p className="font-bold text-gray-800">{user?.email?.address || "Usuário"}</p>
                    <p className="text-gray-500 text-xs">ID: {user?.id.slice(0, 8)}...</p>
                </div>
            </div>
        </div>

        {/* Content Area - Dashboard Hub */}
        <div className="p-6 bg-[#F9F9F9] min-h-[600px]">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Agentes - Link Ativo */}
                <div
                    onClick={() => navigate('/agents')}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Bot size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Agentes</h3>
                    </div>
                    <p className="text-gray-600">Crie e gerencie seus assistentes de IA personalizados.</p>
                </div>

                {/* Relatórios - Placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 opacity-60 cursor-not-allowed relative">
                    <span className="absolute top-4 right-4 text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded">Em breve</span>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Relatórios</h3>
                    </div>
                    <p className="text-gray-600">Visualize métricas e desempenho dos seus agentes.</p>
                </div>

                {/* Projetos - Placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 opacity-60 cursor-not-allowed relative">
                    <span className="absolute top-4 right-4 text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded">Em breve</span>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Folder size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Projetos</h3>
                    </div>
                    <p className="text-gray-600">Organize seus recursos e arquivos em projetos.</p>
                </div>

                {/* Configurações - Placeholder */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 opacity-60 cursor-not-allowed relative">
                    <span className="absolute top-4 right-4 text-xs font-bold bg-gray-200 text-gray-600 px-2 py-1 rounded">Em breve</span>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gray-100 text-gray-600 rounded-lg">
                            <Settings size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Configurações</h3>
                    </div>
                    <p className="text-gray-600">Gerencie preferências da conta e integrações.</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
