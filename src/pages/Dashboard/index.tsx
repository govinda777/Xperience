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
  const [view, setView] = useState<'overview' | 'reports'>('overview');

  useEffect(() => {
    const loadReports = () => {
      setReports(ReportSessionService.getReports());
    };
    loadReports();
    // Listen for storage changes in the same window (custom events) or other tabs
    window.addEventListener('storage', loadReports);
    return () => window.removeEventListener('storage', loadReports);
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
            {view === 'overview' ? (
                <>
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

                        {/* Relatórios - Link Ativo */}
                        <div
                            onClick={() => setView('reports')}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer border border-gray-100 group relative"
                        >
                            {reports.length > 0 && (
                                <span className="absolute top-4 right-4 text-xs font-bold bg-green-500 text-white px-2 py-1 rounded-full animate-pulse">
                                    {reports.length}
                                </span>
                            )}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-green-100 text-green-600 rounded-lg group-hover:bg-green-600 group-hover:text-white transition-colors">
                                    <BarChart3 size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Relatórios</h3>
                            </div>
                            <p className="text-gray-600">Visualize métricas e análises dos seus agentes.</p>
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
                </>
            ) : (
                <>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setView('overview')}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                                aria-label="Voltar para Visão Geral"
                            >
                                <X size={24} className="text-gray-600" />
                            </button>
                            <h2 className="text-2xl font-bold text-gray-800">Meus Relatórios</h2>
                        </div>
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

                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        {reports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <FileText size={48} className="mb-4 opacity-20" />
                                <p className="font-medium text-lg">Nenhum relatório gerado nesta sessão.</p>
                                <p className="text-sm mt-1">Use o comando /REPORT no chat do agente para criar um dossiê.</p>
                                <button
                                    onClick={() => navigate('/agents')}
                                    className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                                >
                                    Ir para Agentes
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm mb-6 border border-amber-100">
                                    <AlertCircle size={20} className="mt-0.5 shrink-0" />
                                    <div>
                                        <p className="font-bold">Persistência Efêmera (ADR 003)</p>
                                        <p>Estes relatórios são temporários e serão removidos ao fechar o navegador. Exporte os dados importantes como PDF.</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {reports.map((report) => (
                                        <div
                                            key={report.id}
                                            onClick={() => setSelectedReport(report)}
                                            className="flex items-center justify-between p-5 bg-white border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-5">
                                                <div className="p-3 bg-gray-100 text-gray-600 rounded-lg group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                    <FileText size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-lg text-gray-800">{report.title}</h4>
                                                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                        <span className="flex items-center gap-1.5"><Bot size={14} /> {report.agentName}</span>
                                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(report.timestamp).toLocaleTimeString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-all hover:bg-blue-600 hover:text-white">
                                                Visualizar
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
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
