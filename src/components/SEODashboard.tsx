import React, { useState, useEffect } from "react";
import {
  SEOService,
  SEOMetrics,
  PerformanceAudit,
} from "../services/seoService";
import { usePerformance } from "../hooks/usePerformance";
import { useAnalytics } from "../contexts/AnalyticsContext";

interface DashboardProps {
  className?: string;
}

export const SEODashboard: React.FC<DashboardProps> = ({ className = "" }) => {
  const [metrics, setMetrics] = useState<SEOMetrics | null>(null);
  const [performanceAudit, setPerformanceAudit] =
    useState<PerformanceAudit | null>(null);
  const [indexationStatus, setIndexationStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "performance" | "indexation"
  >("overview");

  const { metrics: realTimeMetrics, getCoreWebVitalsScore } = usePerformance();
  const { trackEvent } = useAnalytics();
  const seoService = SEOService.getInstance();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);

    try {
      const [metricsData, performanceData, indexationData] = await Promise.all([
        seoService.collectGA4Metrics(),
        seoService.auditPagePerformance(window.location.origin),
        seoService.checkIndexationStatus(),
      ]);

      setMetrics(metricsData);
      setPerformanceAudit(performanceData);
      setIndexationStatus(indexationData);

      // Track dashboard view
      trackEvent("dashboard_viewed", "seo", "dashboard_load");
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
      trackEvent("dashboard_error", "seo", "load_failed");
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    seoService.clearCache();
    loadDashboardData();
    trackEvent("dashboard_refresh", "seo", "manual_refresh");
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat("pt-BR").format(num);
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getMetricStatus = (
    value: number,
    thresholds: { good: number; poor: number },
  ): string => {
    if (value <= thresholds.good) return "good";
    if (value <= thresholds.poor) return "needs-improvement";
    return "poor";
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg ${className}`}>
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard SEO</h2>
          <button
            onClick={refreshData}
            className="bg-[#F34A0D] text-white px-4 py-2 rounded-lg hover:bg-[#E03A00] transition-colors"
          >
            Atualizar Dados
          </button>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex space-x-1">
          {[
            { id: "overview", label: "Visão Geral" },
            { id: "performance", label: "Performance" },
            { id: "indexation", label: "Indexação" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg font-medium ${
                activeTab === tab.id
                  ? "bg-[#F34A0D] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6">
        {/* Overview Tab */}
        {activeTab === "overview" && metrics && (
          <div className="space-y-6">
            {/* Métricas principais */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">
                  Sessões Orgânicas
                </h3>
                <p className="text-2xl font-bold text-blue-900">
                  {formatNumber(metrics.organicSessions)}
                </p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">
                  Visualizações
                </h3>
                <p className="text-2xl font-bold text-green-900">
                  {formatNumber(metrics.pageViews)}
                </p>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-yellow-800">
                  Taxa de Rejeição
                </h3>
                <p className="text-2xl font-bold text-yellow-900">
                  {metrics.bounceRate}%
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-purple-800">
                  Tempo Médio
                </h3>
                <p className="text-2xl font-bold text-purple-900">
                  {formatDuration(metrics.avgSessionDuration)}
                </p>
              </div>
            </div>

            {/* Top Pages */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Páginas Mais Visitadas
              </h3>
              <div className="space-y-2">
                {metrics.topPages.map((page, index) => (
                  <div
                    key={page.page}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <span className="font-medium">{page.page}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({page.bounceRate}% rejeição)
                      </span>
                    </div>
                    <span className="font-bold">
                      {formatNumber(page.views)} views
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Search Queries */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">
                Principais Consultas de Busca
              </h3>
              <div className="space-y-2">
                {metrics.searchQueries.map((query, index) => (
                  <div
                    key={query.query}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0"
                  >
                    <div>
                      <span className="font-medium">{query.query}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        Posição {query.position.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">
                        {formatNumber(query.clicks)} cliques
                      </div>
                      <div className="text-sm text-gray-500">
                        {query.ctr.toFixed(1)}% CTR
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Performance Tab */}
        {activeTab === "performance" && (
          <div className="space-y-6">
            {/* Core Web Vitals em tempo real */}
            {realTimeMetrics && Object.keys(realTimeMetrics).length > 0 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Core Web Vitals (Tempo Real)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {realTimeMetrics.lcp && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        <span
                          className={getScoreColor(
                            realTimeMetrics.lcp <= 2500
                              ? 90
                              : realTimeMetrics.lcp <= 4000
                                ? 70
                                : 40,
                          )}
                        >
                          {(realTimeMetrics.lcp / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">LCP</div>
                    </div>
                  )}
                  {realTimeMetrics.fid !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        <span
                          className={getScoreColor(
                            realTimeMetrics.fid <= 100
                              ? 90
                              : realTimeMetrics.fid <= 300
                                ? 70
                                : 40,
                          )}
                        >
                          {realTimeMetrics.fid.toFixed(0)}ms
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">FID</div>
                    </div>
                  )}
                  {realTimeMetrics.cls !== undefined && (
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        <span
                          className={getScoreColor(
                            realTimeMetrics.cls <= 0.1
                              ? 90
                              : realTimeMetrics.cls <= 0.25
                                ? 70
                                : 40,
                          )}
                        >
                          {realTimeMetrics.cls.toFixed(3)}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">CLS</div>
                    </div>
                  )}
                </div>
                {getCoreWebVitalsScore() && (
                  <div className="mt-4 text-center">
                    <div className="text-lg font-semibold">
                      Score:{" "}
                      <span className={getScoreColor(getCoreWebVitalsScore()!)}>
                        {getCoreWebVitalsScore()}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Performance Audit */}
            {performanceAudit && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">
                  Auditoria de Performance
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-center mb-4">
                      <div
                        className={`text-4xl font-bold ${getScoreColor(performanceAudit.score)}`}
                      >
                        {performanceAudit.score}
                      </div>
                      <div className="text-sm text-gray-600">
                        Score PageSpeed
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>LCP:</span>
                        <span>
                          {(performanceAudit.metrics.lcp / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>FID:</span>
                        <span>{performanceAudit.metrics.fid.toFixed(0)}ms</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CLS:</span>
                        <span>{performanceAudit.metrics.cls.toFixed(3)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>FCP:</span>
                        <span>
                          {(performanceAudit.metrics.fcp / 1000).toFixed(2)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>TTFB:</span>
                        <span>
                          {performanceAudit.metrics.ttfb.toFixed(0)}ms
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">
                      Oportunidades de Melhoria:
                    </h4>
                    <ul className="space-y-1">
                      {performanceAudit.opportunities.map(
                        (opportunity, index) => (
                          <li key={index} className="text-sm text-gray-600">
                            • {opportunity}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Indexation Tab */}
        {activeTab === "indexation" && indexationStatus && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-green-800">
                  Páginas Indexadas
                </h3>
                <p className="text-2xl font-bold text-green-900">
                  {indexationStatus.indexedPages}/{indexationStatus.totalPages}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-blue-800">
                  Último Crawl
                </h3>
                <p className="text-sm font-bold text-blue-900">
                  {new Date(indexationStatus.lastCrawl).toLocaleDateString(
                    "pt-BR",
                  )}
                </p>
              </div>
            </div>

            {indexationStatus.warnings.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-yellow-800">
                  Avisos
                </h3>
                <ul className="space-y-1">
                  {indexationStatus.warnings.map(
                    (warning: string, index: number) => (
                      <li key={index} className="text-sm text-yellow-700">
                        ⚠️ {warning}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}

            {indexationStatus.errors.length > 0 && (
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-red-800">
                  Erros
                </h3>
                <ul className="space-y-1">
                  {indexationStatus.errors.map(
                    (error: string, index: number) => (
                      <li key={index} className="text-sm text-red-700">
                        ❌ {error}
                      </li>
                    ),
                  )}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SEODashboard;
