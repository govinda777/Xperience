// Create a mock module factory for config
const mockConfig = {
  seoConfig: {
    enablePerformanceMonitoring: true,
  },
};

jest.mock('../../config/env', () => mockConfig);

import { renderHook, act } from '@testing-library/react';
import { usePerformance } from '../../hooks/usePerformance';
import { useAnalytics } from '../../contexts/AnalyticsContext';
import React from 'react';

// Mock dependencies
jest.mock('../../contexts/AnalyticsContext');

describe('usePerformance', () => {
  const mockTrackEvent = jest.fn();

  // Mock PerformanceObserver
  const mockObserve = jest.fn();
  const mockDisconnect = jest.fn();
  const mockPerformanceObserver = jest.fn().mockImplementation((callback) => ({
    observe: mockObserve,
    disconnect: mockDisconnect,
    callback,
  }));

  // Mock performance API
  const mockNavigationTiming = {
    requestStart: 0,
    responseStart: 100,
  };

  const mockPaintEntry = {
    name: 'first-contentful-paint',
    startTime: 150,
  };

  const mockGetEntriesByType = jest.fn((type) => {
    switch (type) {
      case 'navigation':
        return [mockNavigationTiming];
      case 'paint':
        return [mockPaintEntry];
      default:
        return [];
    }
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset config mock
    mockConfig.seoConfig.enablePerformanceMonitoring = true;

    // Mock useAnalytics
    (useAnalytics as jest.Mock).mockReturnValue({
      trackEvent: mockTrackEvent,
    });

    // Mock window.PerformanceObserver
    Object.defineProperty(window, 'PerformanceObserver', {
      writable: true,
      value: mockPerformanceObserver,
    });

    // Mock window.performance
    Object.defineProperty(window, 'performance', {
      writable: true,
      value: {
        getEntriesByType: mockGetEntriesByType,
        getEntriesByName: jest.fn().mockReturnValue([]),
        now: jest.fn().mockReturnValue(0),
        mark: jest.fn(),
        measure: jest.fn(),
        clearMarks: jest.fn(),
        clearMeasures: jest.fn(),
        timing: {
          navigationStart: 0,
          loadEventEnd: 0,
        },
      },
    });

    // Mock document.readyState
    Object.defineProperty(document, 'readyState', {
      writable: true,
      value: 'complete',
    });
  });

  it('should initialize with empty metrics', () => {
    // Mock getEntriesByType to return empty arrays for this test
    mockGetEntriesByType.mockImplementation(() => []);

    const { result } = renderHook(() => usePerformance());
    
    expect(result.current.metrics).toEqual({});
  });

  it('should not track metrics when performance monitoring is disabled', () => {
    // Mock seoConfig to disable performance monitoring
    mockConfig.seoConfig.enablePerformanceMonitoring = false;

    const { result } = renderHook(() => usePerformance());
    
    expect(mockPerformanceObserver).not.toHaveBeenCalled();
    expect(mockGetEntriesByType).not.toHaveBeenCalled();
  });

  it('should track LCP metric', () => {
    const { result } = renderHook(() => usePerformance());

    // Simulate LCP observer callback
    const lcpCallback = mockPerformanceObserver.mock.calls[0][0];
    act(() => {
      lcpCallback({
        getEntries: () => [{
          startTime: 2000,
        }],
      });
    });

    expect(result.current.metrics.lcp).toBe(2000);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'performance_metric',
      'core_web_vitals',
      'lcp',
      2000
    );
  });

  it('should track FID metric', () => {
    const { result } = renderHook(() => usePerformance());

    // Simulate FID observer callback
    const fidCallback = mockPerformanceObserver.mock.calls[1][0];
    act(() => {
      fidCallback({
        getEntries: () => [{
          startTime: 50,
          processingStart: 100,
        }],
      });
    });

    expect(result.current.metrics.fid).toBe(50);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'performance_metric',
      'core_web_vitals',
      'fid',
      50
    );
  });

  it('should track CLS metric', () => {
    const { result } = renderHook(() => usePerformance());

    // Simulate CLS observer callback
    const clsCallback = mockPerformanceObserver.mock.calls[2][0];
    act(() => {
      clsCallback({
        getEntries: () => [{
          value: 0.05,
          hadRecentInput: false,
        }],
      });
    });

    expect(result.current.metrics.cls).toBe(0.05);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'performance_metric',
      'core_web_vitals',
      'cls',
      50 // value * 1000
    );
  });

  it('should track navigation timing metrics', () => {
    // Mock getEntriesByType to return empty arrays for this test
    mockGetEntriesByType.mockImplementation((type) => {
      switch (type) {
        case 'navigation':
          return [mockNavigationTiming];
        case 'paint':
          return [mockPaintEntry];
        default:
          return [];
      }
    });

    const { result } = renderHook(() => usePerformance());

    expect(result.current.metrics.ttfb).toBe(100);
    expect(result.current.metrics.fcp).toBe(150);
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'performance_metric',
      'timing',
      'ttfb',
      100
    );
    expect(mockTrackEvent).toHaveBeenCalledWith(
      'performance_metric',
      'timing',
      'fcp',
      150
    );
  });

  it('should handle observer errors gracefully', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockObserve.mockImplementation(() => {
      throw new Error('Observer error');
    });

    renderHook(() => usePerformance());

    expect(consoleWarnSpy).toHaveBeenCalledWith('LCP observer not supported');
    expect(consoleWarnSpy).toHaveBeenCalledWith('FID observer not supported');
    expect(consoleWarnSpy).toHaveBeenCalledWith('CLS observer not supported');

    consoleWarnSpy.mockRestore();
  });

  it('should calculate core web vitals score correctly', () => {
    const { result } = renderHook(() => usePerformance());

    // Good scores
    act(() => {
      result.current.metrics.lcp = 2000; // Good: ≤ 2500ms
      result.current.metrics.fid = 50;   // Good: ≤ 100ms
      result.current.metrics.cls = 0.05;  // Good: ≤ 0.1
    });

    expect(result.current.getCoreWebVitalsScore()).toBe(100);

    // Needs improvement scores
    act(() => {
      result.current.metrics.lcp = 3000; // Needs improvement: ≤ 4000ms
      result.current.metrics.fid = 200;  // Needs improvement: ≤ 300ms
      result.current.metrics.cls = 0.15; // Needs improvement: ≤ 0.25
    });

    expect(result.current.getCoreWebVitalsScore()).toBe(50);

    // Poor scores
    act(() => {
      result.current.metrics.lcp = 5000; // Poor: > 4000ms
      result.current.metrics.fid = 400;  // Poor: > 300ms
      result.current.metrics.cls = 0.3;  // Poor: > 0.25
    });

    expect(result.current.getCoreWebVitalsScore()).toBe(0);
  });

  it('should return null score when metrics are missing', () => {
    const { result } = renderHook(() => usePerformance());

    expect(result.current.getCoreWebVitalsScore()).toBeNull();

    // Partial metrics
    act(() => {
      result.current.metrics.lcp = 2000;
      result.current.metrics.fid = 50;
    });

    expect(result.current.getCoreWebVitalsScore()).toBeNull();
  });

  it('should cleanup event listeners on unmount', () => {
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    const { unmount } = renderHook(() => usePerformance());

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function));
  });
});