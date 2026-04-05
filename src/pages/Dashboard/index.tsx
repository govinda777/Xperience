import React, { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Bot,
  BarChart3,
  Folder,
  Settings,
  FileText,
  Trash2,
  Clock,
  AlertCircle,
  X,
  Map,
  LayoutDashboard,
  LogOut,
  ChevronRight,
  Zap,
  CheckCircle2,
  Play
} from "lucide-react";
import { ReportSessionService, Report } from "../../services/reportSessionService";
import { TrailStorageService } from "../../services/trailStorageService";
import { Trail } from "../../types/trails";
import TrailList from "../Trails/TrailList";

type DashboardView = 'overview' | 'trails' | 'reports' | 'agents';

const Dashboard = () => {
  const { user, logout, ready } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [view, setView] = useState<DashboardView>('overview');
  const [trails, setTrails] = useState<Trail[]>([]);

  useEffect(() => {
    const loadReports = () => {
      setReports(ReportSessionService.getReports());
    };

    const fetchTrails = async () => {
      try {
        const trailFiles = ['onboarding.json', 'business-map.json'];
        const trailData = await Promise.all(
          trailFiles.map(async (file) => {
            const res = await fetch(`/trails/${file}`);
            return res.json();
          })
        );
        setTrails(trailData);
      } catch (e) {
        console.error('Failed to load trails', e);
      }
    };

    loadReports();
    fetchTrails();

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
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        <p className="ml-3 text-xl font-medium text-orange-800">Carregando...</p>
      </div>
    );
  }

  const getOnboardingStatus = () => {
    const state = TrailStorageService.getTrailState('onboarding');
    if (state.completed) return 'completed';
    if (state.currentStepIndex > 0 || Object.keys(state.data).length > 0) return 'in_progress';
    return 'not_started';
  };

  const renderSidebarItem = (id: DashboardView, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setView(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        view === id
          ? 'bg-orange-500 text-white shadow-md'
          : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
      }`}
    >
      {icon}
      <span className="font-bold">{label}</span>
      {view === id && <ChevronRight size={16} className="ml-auto" />}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-gray-100 p-6 flex flex-col shrink-0">

        <nav className="space-y-2 flex-grow">
          {renderSidebarItem('overview', 'Dashboard', <LayoutDashboard size={20} />)}
          {renderSidebarItem('trails', 'Minha Jornada', <Map size={20} />)}
          <button
            onClick={() => navigate('/agents')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
          >
            <Bot size={20} />
            <span className="font-bold">Meus Agentes</span>
          </button>
          {renderSidebarItem('reports', 'Relatórios', <BarChart3 size={20} />)}
        </nav>

        <div className="pt-6 border-t border-gray-100 mt-6">
            <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-gray-50 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                    {(user?.email?.address?.charAt(0) || "U").toUpperCase()}
                </div>
                <div className="overflow-hidden">
                    <p className="text-xs font-bold text-gray-800 truncate">{user?.email?.address || "Usuário"}</p>
                </div>
            </div>
            <button
                onClick={() => logout()}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all"
            >
                <LogOut size={20} />
                <span className="font-bold">Sair</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto h-screen p-4 md:p-10">
        <div className="max-w-6xl mx-auto">
            {view === 'overview' && (
                <div className="space-y-10">
                    <header>
                        <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">Bem-vindo, {user?.email?.address?.split('@')[0] || 'Empreendedor'}!</h1>
                        <p className="text-gray-500 text-lg">Aqui está o resumo da sua evolução na plataforma.</p>
                    </header>

                    {/* Onboarding Highlight */}
                    {getOnboardingStatus() !== 'completed' && (
                        <div className="bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 text-white shadow-xl shadow-orange-200 relative overflow-hidden group">
                            <Zap className="absolute right-[-20px] top-[-20px] w-48 h-48 text-white/10 rotate-12 transition-transform group-hover:scale-110 duration-700" />
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="max-w-md">
                                    <h2 className="text-2xl font-bold mb-2">Seu Onboarding está incompleto</h2>
                                    <p className="text-orange-50/80 mb-6">Complete os primeiros passos para desbloquear recomendações personalizadas da nossa IA.</p>
                                    <button
                                        onClick={() => navigate('/trails/onboarding')}
                                        className="bg-white text-orange-600 px-8 py-3 rounded-xl font-black shadow-lg hover:scale-105 transition-transform flex items-center gap-2 w-fit"
                                    >
                                        <Play size={18} fill="currentColor" />
                                        {getOnboardingStatus() === 'not_started' ? 'Começar Agora' : 'Continuar Jornada'}
                                    </button>
                                </div>
                                <div className="flex gap-4">
                                    <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-white/10">
                                        <span className="text-3xl font-black">
                                            {TrailStorageService.getTrailState('onboarding').currentStepIndex}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Passo Atual</span>
                                    </div>
                                    <div className="bg-black/10 backdrop-blur-md rounded-2xl p-4 flex flex-col items-center justify-center min-w-[100px] border border-white/10">
                                        <span className="text-3xl font-black">3</span>
                                        <span className="text-[10px] font-bold uppercase tracking-wider opacity-60">Total</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Grid de Ferramentas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div
                            onClick={() => setView('trails')}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                                <Map size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Minha Jornada</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Trilhas de conhecimento e ferramentas para mapear seu negócio.</p>
                            <span className="text-orange-500 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Acessar trilhas <ChevronRight size={16}/></span>
                        </div>

                        <div
                            onClick={() => navigate('/agents')}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                <Bot size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Meus Agentes</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Seus assistentes de IA personalizados prontos para agir.</p>
                            <span className="text-blue-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Ver agentes <ChevronRight size={16}/></span>
                        </div>

                        <div
                            onClick={() => setView('reports')}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <BarChart3 size={28} />
                            </div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Relatórios</h3>
                            <p className="text-gray-500 mb-6 text-sm leading-relaxed">Dossiês e análises geradas pelos seus agentes.</p>
                            <span className="text-green-600 font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">Ver relatórios <ChevronRight size={16}/></span>
                        </div>
                    </div>
                </div>
            )}

            {view === 'trails' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="mb-10 flex justify-between items-end">
                        <div>
                            <button onClick={() => setView('overview')} className="text-orange-600 font-bold text-sm mb-2 flex items-center gap-1 hover:gap-2 transition-all">
                                <ChevronRight size={16} className="rotate-180" /> Voltar ao Dashboard
                            </button>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Minha Jornada</h1>
                            <p className="text-gray-500 mt-2">Escolha uma trilha para desenvolver seu negócio.</p>
                        </div>
                    </header>
                    <TrailList />
                </div>
            )}

            {view === 'reports' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <header className="mb-10 flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Meus Relatórios</h1>
                            <p className="text-gray-500 mt-2">Documentos e análises geradas em suas sessões.</p>
                        </div>
                        {reports.length > 0 && (
                            <button
                                onClick={handleClearReports}
                                className="flex items-center gap-2 text-red-500 hover:text-red-600 text-sm font-bold bg-red-50 px-4 py-2 rounded-xl transition-all"
                            >
                                <Trash2 size={16} />
                                Limpar Sessão
                            </button>
                        )}
                    </header>

                    <div className="bg-white p-2 rounded-[32px] shadow-sm border border-gray-100">
                        {reports.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-24 text-gray-500 bg-gray-50/50 rounded-[28px] border border-dashed border-gray-200">
                                <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 text-gray-300">
                                    <FileText size={40} />
                                </div>
                                <p className="font-black text-2xl text-gray-400">Nenhum relatório</p>
                                <p className="text-sm mt-2 text-gray-400">Use o comando /REPORT no chat para gerar dados.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-2">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        onClick={() => setSelectedReport(report)}
                                        className="flex items-center justify-between p-5 bg-white border border-transparent rounded-2xl hover:border-orange-100 hover:bg-orange-50/30 transition-all cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-gray-50 text-gray-400 rounded-2xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                                                <FileText size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-lg text-gray-800">{report.title}</h4>
                                                <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mt-1 uppercase tracking-wider">
                                                    <span className="flex items-center gap-1.5"><Bot size={12} /> {report.agentName}</span>
                                                    <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date(report.timestamp).toLocaleTimeString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="px-5 py-2.5 bg-gray-100 text-gray-500 rounded-xl text-sm font-black group-hover:bg-orange-500 group-hover:text-white transition-all">
                                            Visualizar
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
      </main>

      {/* Report Modal */}
      {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-md animate-in fade-in duration-200">
              <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col border border-white/20 animate-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center p-8 border-b border-gray-50 bg-gray-50/50">
                      <div>
                          <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedReport.title}</h3>
                          <p className="text-sm font-bold text-gray-400 mt-1 flex items-center gap-2 uppercase tracking-widest">
                            <Bot size={14} /> {selectedReport.agentName} • {new Date(selectedReport.timestamp).toLocaleString()}
                          </p>
                      </div>
                      <button
                          onClick={() => setSelectedReport(null)}
                          className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900"
                      >
                          <X size={28} />
                      </button>
                  </div>
                  <div className="p-10 overflow-y-auto bg-white flex-1 custom-scrollbar">
                      <div className="prose prose-orange max-w-none">
                          <div className="whitespace-pre-wrap font-sans text-gray-700 leading-relaxed text-lg">
                              {selectedReport.content}
                          </div>
                      </div>
                  </div>
                  <div className="p-8 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-4">
                      <button
                          onClick={() => window.print()}
                          className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-black text-gray-600 hover:bg-gray-100 transition-all shadow-sm"
                      >
                          Imprimir / PDF
                      </button>
                      <button
                          onClick={() => setSelectedReport(null)}
                          className="px-10 py-3 bg-orange-500 rounded-xl font-black text-white hover:bg-orange-600 transition-all shadow-lg shadow-orange-200"
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
