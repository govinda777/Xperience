import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { SEOService, } from "../services/seoService";
import { usePerformance } from "../hooks/usePerformance";
import { useAnalytics } from "../contexts/AnalyticsContext";
export const SEODashboard = ({ className = "" }) => {
    const [metrics, setMetrics] = useState(null);
    const [performanceAudit, setPerformanceAudit] = useState(null);
    const [indexationStatus, setIndexationStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
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
        }
        catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
            trackEvent("dashboard_error", "seo", "load_failed");
        }
        finally {
            setLoading(false);
        }
    };
    const refreshData = () => {
        seoService.clearCache();
        loadDashboardData();
        trackEvent("dashboard_refresh", "seo", "manual_refresh");
    };
    const formatNumber = (num) => {
        return new Intl.NumberFormat("pt-BR").format(num);
    };
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };
    const getScoreColor = (score) => {
        if (score >= 90)
            return "text-green-600";
        if (score >= 70)
            return "text-yellow-600";
        return "text-red-600";
    };
    const getMetricStatus = (value, thresholds) => {
        if (value <= thresholds.good)
            return "good";
        if (value <= thresholds.poor)
            return "needs-improvement";
        return "poor";
    };
    if (loading) {
        return (_jsx("div", { className: `bg-white rounded-lg shadow-lg p-6 ${className}`, children: _jsxs("div", { className: "animate-pulse", children: [_jsx("div", { className: "h-8 bg-gray-200 rounded mb-4" }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [...Array(4)].map((_, i) => (_jsx("div", { className: "h-24 bg-gray-200 rounded" }, i))) })] }) }));
    }
    return (_jsxs("div", { className: `bg-white rounded-lg shadow-lg ${className}`, children: [_jsxs("div", { className: "border-b border-gray-200 p-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Dashboard SEO" }), _jsx("button", { onClick: refreshData, className: "bg-[#F34A0D] text-white px-4 py-2 rounded-lg hover:bg-[#E03A00] transition-colors", children: "Atualizar Dados" })] }), _jsx("div", { className: "mt-4 flex space-x-1", children: [
                            { id: "overview", label: "Visão Geral" },
                            { id: "performance", label: "Performance" },
                            { id: "indexation", label: "Indexação" },
                        ].map((tab) => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-4 py-2 rounded-lg font-medium ${activeTab === tab.id
                                ? "bg-[#F34A0D] text-white"
                                : "text-gray-600 hover:text-gray-900"}`, children: tab.label }, tab.id))) })] }), _jsxs("div", { className: "p-6", children: [activeTab === "overview" && metrics && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-blue-800", children: "Sess\u00F5es Org\u00E2nicas" }), _jsx("p", { className: "text-2xl font-bold text-blue-900", children: formatNumber(metrics.organicSessions) })] }), _jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-green-800", children: "Visualiza\u00E7\u00F5es" }), _jsx("p", { className: "text-2xl font-bold text-green-900", children: formatNumber(metrics.pageViews) })] }), _jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-yellow-800", children: "Taxa de Rejei\u00E7\u00E3o" }), _jsxs("p", { className: "text-2xl font-bold text-yellow-900", children: [metrics.bounceRate, "%"] })] }), _jsxs("div", { className: "bg-purple-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-purple-800", children: "Tempo M\u00E9dio" }), _jsx("p", { className: "text-2xl font-bold text-purple-900", children: formatDuration(metrics.avgSessionDuration) })] })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "P\u00E1ginas Mais Visitadas" }), _jsx("div", { className: "space-y-2", children: metrics.topPages.map((page, index) => (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: page.page }), _jsxs("span", { className: "text-sm text-gray-500 ml-2", children: ["(", page.bounceRate, "% rejei\u00E7\u00E3o)"] })] }), _jsxs("span", { className: "font-bold", children: [formatNumber(page.views), " views"] })] }, page.page))) })] }), _jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Principais Consultas de Busca" }), _jsx("div", { className: "space-y-2", children: metrics.searchQueries.map((query, index) => (_jsxs("div", { className: "flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0", children: [_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: query.query }), _jsxs("span", { className: "text-sm text-gray-500 ml-2", children: ["Posi\u00E7\u00E3o ", query.position.toFixed(1)] })] }), _jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "font-bold", children: [formatNumber(query.clicks), " cliques"] }), _jsxs("div", { className: "text-sm text-gray-500", children: [query.ctr.toFixed(1), "% CTR"] })] })] }, query.query))) })] })] })), activeTab === "performance" && (_jsxs("div", { className: "space-y-6", children: [realTimeMetrics && Object.keys(realTimeMetrics).length > 0 && (_jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Core Web Vitals (Tempo Real)" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [realTimeMetrics.lcp && (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: _jsxs("span", { className: getScoreColor(realTimeMetrics.lcp <= 2500
                                                                ? 90
                                                                : realTimeMetrics.lcp <= 4000
                                                                    ? 70
                                                                    : 40), children: [(realTimeMetrics.lcp / 1000).toFixed(2), "s"] }) }), _jsx("div", { className: "text-sm text-gray-600", children: "LCP" })] })), realTimeMetrics.fid !== undefined && (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: _jsxs("span", { className: getScoreColor(realTimeMetrics.fid <= 100
                                                                ? 90
                                                                : realTimeMetrics.fid <= 300
                                                                    ? 70
                                                                    : 40), children: [realTimeMetrics.fid.toFixed(0), "ms"] }) }), _jsx("div", { className: "text-sm text-gray-600", children: "FID" })] })), realTimeMetrics.cls !== undefined && (_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-2xl font-bold", children: _jsx("span", { className: getScoreColor(realTimeMetrics.cls <= 0.1
                                                                ? 90
                                                                : realTimeMetrics.cls <= 0.25
                                                                    ? 70
                                                                    : 40), children: realTimeMetrics.cls.toFixed(3) }) }), _jsx("div", { className: "text-sm text-gray-600", children: "CLS" })] }))] }), getCoreWebVitalsScore() && (_jsx("div", { className: "mt-4 text-center", children: _jsxs("div", { className: "text-lg font-semibold", children: ["Score:", " ", _jsxs("span", { className: getScoreColor(getCoreWebVitalsScore()), children: [getCoreWebVitalsScore(), "/100"] })] }) }))] })), performanceAudit && (_jsxs("div", { className: "bg-gray-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", children: "Auditoria de Performance" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("div", { className: "text-center mb-4", children: [_jsx("div", { className: `text-4xl font-bold ${getScoreColor(performanceAudit.score)}`, children: performanceAudit.score }), _jsx("div", { className: "text-sm text-gray-600", children: "Score PageSpeed" })] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "LCP:" }), _jsxs("span", { children: [(performanceAudit.metrics.lcp / 1000).toFixed(2), "s"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "FID:" }), _jsxs("span", { children: [performanceAudit.metrics.fid.toFixed(0), "ms"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "CLS:" }), _jsx("span", { children: performanceAudit.metrics.cls.toFixed(3) })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "FCP:" }), _jsxs("span", { children: [(performanceAudit.metrics.fcp / 1000).toFixed(2), "s"] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { children: "TTFB:" }), _jsxs("span", { children: [performanceAudit.metrics.ttfb.toFixed(0), "ms"] })] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold mb-2", children: "Oportunidades de Melhoria:" }), _jsx("ul", { className: "space-y-1", children: performanceAudit.opportunities.map((opportunity, index) => (_jsxs("li", { className: "text-sm text-gray-600", children: ["\u2022 ", opportunity] }, index))) })] })] })] }))] })), activeTab === "indexation" && indexationStatus && (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-green-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-green-800", children: "P\u00E1ginas Indexadas" }), _jsxs("p", { className: "text-2xl font-bold text-green-900", children: [indexationStatus.indexedPages, "/", indexationStatus.totalPages] })] }), _jsxs("div", { className: "bg-blue-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-sm font-medium text-blue-800", children: "\u00DAltimo Crawl" }), _jsx("p", { className: "text-sm font-bold text-blue-900", children: new Date(indexationStatus.lastCrawl).toLocaleDateString("pt-BR") })] })] }), indexationStatus.warnings.length > 0 && (_jsxs("div", { className: "bg-yellow-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-yellow-800", children: "Avisos" }), _jsx("ul", { className: "space-y-1", children: indexationStatus.warnings.map((warning, index) => (_jsxs("li", { className: "text-sm text-yellow-700", children: ["\u26A0\uFE0F ", warning] }, index))) })] })), indexationStatus.errors.length > 0 && (_jsxs("div", { className: "bg-red-50 p-4 rounded-lg", children: [_jsx("h3", { className: "text-lg font-semibold mb-4 text-red-800", children: "Erros" }), _jsx("ul", { className: "space-y-1", children: indexationStatus.errors.map((error, index) => (_jsxs("li", { className: "text-sm text-red-700", children: ["\u274C ", error] }, index))) })] }))] }))] })] }));
};
export default SEODashboard;
