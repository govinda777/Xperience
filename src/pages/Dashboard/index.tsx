import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Bot, BarChart3, Folder, Settings, FileText, Trash2, Clock, AlertCircle, X } from "lucide-react";
import { ReportSessionService, Report } from "../../services/reportSessionService";

const Dashboard = () => {
  const { user, logout, ready } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    setReports(ReportSessionService.getReports());
  }, []);

  const handleClearReports = () => {
    if (window.confirm("Tem certeza que deseja excluir todos os relatórios desta sessão?")) {
      ReportSessionService.clearReports();
      setReports([]);
    }
  };

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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Visão Geral</h2>
                {reports.length > 0 && (
                    <button
                        onClick={handleClearReports}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                        <Trash2 size={16} />
                        Limpar Sessão
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Agentes - Link Ativo */}
                <div
                    onClick={() => navigate('/agents')}
                    className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group lg:col-span-1"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                            <Bot size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Agentes</h3>
                    </div>
                    <p className="text-gray-600">Crie e gerencie seus assistentes de IA personalizados.</p>
                </div>

                {/* Relatórios de Sessão */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <BarChart3 size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">Relatórios de Sessão</h3>
                    </div>

                    {reports.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <FileText size={48} className="mb-4 opacity-20" />
                            <p className="font-medium">Nenhum relatório gerado nesta sessão.</p>
                            <p className="text-sm mt-1">Use o comando /REPORT no chat do agente.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg text-amber-800 text-sm mb-4">
                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                <p><strong>Atenção:</strong> Estes relatórios são efêmeros e serão removidos ao fechar o navegador. Exporte os dados importantes.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => setSelectedReport(report)}
                                        className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-gray-100 text-gray-600 rounded group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">{report.title}</h4>
                                                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center gap-1"><Bot size={12} /> {report.agentName}</span>
                                                    <span className="flex items-center gap-1"><Clock size={12} /> {new Date(report.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-blue-600 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">Visualizar</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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

      {/* Report Modal */}
      {selectedReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
                  <div className="flex justify-between items-center p-6 border-b bg-gray-50">
                      <div>
                          <h3 className="text-2xl font-bold text-gray-800">{selectedReport.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">Gerado por {selectedReport.agentName} em {new Date(selectedReport.timestamp).toLocaleString()}</p>
                      </div>
                      <button
                          onClick={() => setSelectedReport(null)}
                          className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                      >
                          <X size={24} className="text-gray-500" />
                      </button>
                  </div>
                  <div className="p-8 overflow-y-auto bg-white flex-1">
                      <div className="prose prose-blue max-w-none">
                          <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                              {selectedReport.content}
                          </div>
                      </div>
                  </div>
                  <div className="p-6 border-t bg-gray-50 flex justify-end gap-4">
                      <button
                          onClick={() => window.print()}
                          className="px-6 py-2 bg-white border border-gray-300 rounded-lg font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                          Imprimir / PDF
                      </button>
                      <button
                          onClick={() => setSelectedReport(null)}
                          className="px-6 py-2 bg-blue-600 rounded-lg font-bold text-white hover:bg-blue-700 transition-colors shadow-md"
                      >
                          Fechar
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Dashboard;
