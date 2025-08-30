import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { seoConfig } from '../config/env';

interface AnalyticsContextType {
  trackPageView: (path: string) => void;
  trackEvent: (action: string, category: string, label?: string, value?: number) => void;
  trackConversion: (conversionType: string, value?: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Inicializar Google Analytics apenas se habilitado
    if (seoConfig.enableAnalytics && seoConfig.gaId && seoConfig.gaId !== 'G-XXXXXXXXXX') {
      ReactGA.initialize(seoConfig.gaId, {
        testMode: seoConfig.isDev
      });
    }
  }, []);

  useEffect(() => {
    // Track page view on route change
    if (seoConfig.enableAnalytics && seoConfig.gaId && seoConfig.gaId !== 'G-XXXXXXXXXX') {
      const path = location.pathname + location.search;
      ReactGA.send({ 
        hitType: 'pageview', 
        page: path,
        title: document.title
      });
    }
  }, [location]);

  const trackPageView = (path: string) => {
    if (seoConfig.enableAnalytics && seoConfig.gaId && seoConfig.gaId !== 'G-XXXXXXXXXX') {
      ReactGA.send({ 
        hitType: 'pageview', 
        page: path,
        title: document.title
      });
    }
  };

  const trackEvent = (action: string, category: string, label?: string, value?: number) => {
    if (seoConfig.enableAnalytics && seoConfig.gaId && seoConfig.gaId !== 'G-XXXXXXXXXX') {
      ReactGA.event({
        action,
        category,
        label,
        value
      });
    }
  };

  const trackConversion = (conversionType: string, value?: number) => {
    if (seoConfig.enableAnalytics && seoConfig.gaId && seoConfig.gaId !== 'G-XXXXXXXXXX') {
      ReactGA.event({
        action: 'conversion',
        category: 'engagement',
        label: conversionType,
        value
      });

      // Track specific conversion events
      switch (conversionType) {
        case 'contact_form_submit':
          ReactGA.event({
            action: 'generate_lead',
            category: 'conversion'
          });
          break;
        case 'plan_selection':
          ReactGA.event({
            action: 'select_item',
            category: 'ecommerce',
            label: 'plan_selection'
          });
          break;
        case 'newsletter_signup':
          ReactGA.event({
            action: 'sign_up',
            category: 'engagement'
          });
          break;
      }
    }
  };

  return (
    <AnalyticsContext.Provider value={{ trackPageView, trackEvent, trackConversion }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider');
  }
  return context;
};

export default AnalyticsContext;
