import { useEffect, useState } from "react";
import { useAnalytics } from "../contexts/AnalyticsContext";
import { seoConfig } from "../config/env";

interface PerformanceMetrics {
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    if (!seoConfig.enablePerformanceMonitoring) return;

    // Função para capturar métricas de performance
    const captureMetrics = () => {
      // Performance Observer para Core Web Vitals
      if ("PerformanceObserver" in window) {
        // Largest Contentful Paint (LCP)
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;

          if (lastEntry) {
            const lcp = lastEntry.startTime;
            setMetrics((prev) => ({ ...prev, lcp }));

            // Track no Analytics
            trackEvent(
              "performance_metric",
              "core_web_vitals",
              "lcp",
              Math.round(lcp),
            );

            // Avaliar qualidade do LCP
            if (lcp > 4000) {
              trackEvent(
                "performance_issue",
                "core_web_vitals",
                "lcp_poor",
                Math.round(lcp),
              );
            } else if (lcp > 2500) {
              trackEvent(
                "performance_warning",
                "core_web_vitals",
                "lcp_needs_improvement",
                Math.round(lcp),
              );
            }
          }
        });

        try {
          lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
        } catch (e) {
          console.warn("LCP observer not supported");
        }

        // First Input Delay (FID)
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            const fid = entry.processingStart - entry.startTime;
            setMetrics((prev) => ({ ...prev, fid }));

            trackEvent(
              "performance_metric",
              "core_web_vitals",
              "fid",
              Math.round(fid),
            );

            if (fid > 300) {
              trackEvent(
                "performance_issue",
                "core_web_vitals",
                "fid_poor",
                Math.round(fid),
              );
            } else if (fid > 100) {
              trackEvent(
                "performance_warning",
                "core_web_vitals",
                "fid_needs_improvement",
                Math.round(fid),
              );
            }
          });
        });

        try {
          fidObserver.observe({ entryTypes: ["first-input"] });
        } catch (e) {
          console.warn("FID observer not supported");
        }

        // Cumulative Layout Shift (CLS)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          const entries = list.getEntries();

          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });

          if (clsValue > 0) {
            setMetrics((prev) => ({ ...prev, cls: clsValue }));
            trackEvent(
              "performance_metric",
              "core_web_vitals",
              "cls",
              Math.round(clsValue * 1000),
            );

            if (clsValue > 0.25) {
              trackEvent(
                "performance_issue",
                "core_web_vitals",
                "cls_poor",
                Math.round(clsValue * 1000),
              );
            } else if (clsValue > 0.1) {
              trackEvent(
                "performance_warning",
                "core_web_vitals",
                "cls_needs_improvement",
                Math.round(clsValue * 1000),
              );
            }
          }
        });

        try {
          clsObserver.observe({ entryTypes: ["layout-shift"] });
        } catch (e) {
          console.warn("CLS observer not supported");
        }
      }

      // Navigation Timing API para outras métricas
      if ("performance" in window && "getEntriesByType" in performance) {
        const navigationEntries = performance.getEntriesByType(
          "navigation",
        ) as PerformanceNavigationTiming[];

        if (navigationEntries.length > 0) {
          const navigation = navigationEntries[0];

          // First Contentful Paint
          const paintEntries = performance.getEntriesByType("paint");
          const fcpEntry = paintEntries.find(
            (entry) => entry.name === "first-contentful-paint",
          );

          if (fcpEntry) {
            const fcp = fcpEntry.startTime;
            setMetrics((prev) => ({ ...prev, fcp }));
            trackEvent("performance_metric", "timing", "fcp", Math.round(fcp));
          }

          // Time to First Byte
          const ttfb = navigation.responseStart - navigation.requestStart;
          setMetrics((prev) => ({ ...prev, ttfb }));
          trackEvent("performance_metric", "timing", "ttfb", Math.round(ttfb));
        }
      }
    };

    // Capturar métricas após o carregamento da página
    if (document.readyState === "complete") {
      captureMetrics();
    } else {
      window.addEventListener("load", captureMetrics);
    }

    return () => {
      window.removeEventListener("load", captureMetrics);
    };
  }, [trackEvent]);

  return {
    metrics,
    getCoreWebVitalsScore: () => {
      const { lcp, fid, cls } = metrics;

      if (!lcp || fid === undefined || cls === undefined) {
        return null;
      }

      // Calcular score baseado nos thresholds do Google
      let score = 0;

      // LCP Score (0-40 pontos)
      if (lcp <= 2500) score += 40;
      else if (lcp <= 4000) score += 20;

      // FID Score (0-30 pontos)
      if (fid <= 100) score += 30;
      else if (fid <= 300) score += 15;

      // CLS Score (0-30 pontos)
      if (cls <= 0.1) score += 30;
      else if (cls <= 0.25) score += 15;

      return Math.round(score);
    },
  };
};

export default usePerformance;
