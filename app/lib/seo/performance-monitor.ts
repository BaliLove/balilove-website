/**
 * Core Web Vitals & Performance Monitoring for SEO
 * 
 * Monitors and tracks page performance metrics that directly impact
 * SEO rankings and user experience for wedding content
 */

import { seoTracker } from './seo-tracking';

export interface WebVitalMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift  
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  inp?: number; // Interaction to Next Paint (new metric)
}

export interface PerformanceAnalysis {
  score: number; // 0-100 overall performance score
  grades: {
    lcp: 'good' | 'needs-improvement' | 'poor';
    fid: 'good' | 'needs-improvement' | 'poor';
    cls: 'good' | 'needs-improvement' | 'poor';
  };
  seoImpact: 'high' | 'medium' | 'low';
  recommendations: string[];
  mobileOptimized: boolean;
}

export class PerformanceMonitor {
  
  private metrics: Partial<WebVitalMetrics> = {};
  private observer: PerformanceObserver | null = null;

  /**
   * Initialize performance monitoring for current page
   */
  startMonitoring(pageData: {
    url: string;
    pageType: 'venue' | 'event' | 'package' | 'page';
    entityName?: string;
  }): void {
    
    if (typeof window === 'undefined') return;

    // Track page load start
    const pageLoadStart = performance.now();
    
    // Monitor Core Web Vitals
    this.measureLCP(pageData);
    this.measureFID(pageData);
    this.measureCLS(pageData);
    this.measureFCP(pageData);
    this.measureTTFB(pageData);
    
    // Track overall page load time
    window.addEventListener('load', () => {
      const loadTime = performance.now() - pageLoadStart;
      this.trackPageLoadComplete(pageData, loadTime);
    });

    // Set up navigation timing analysis
    this.analyzeNavigationTiming(pageData);
  }

  /**
   * Measure Largest Contentful Paint (Critical for SEO)
   */
  private measureLCP(pageData: any): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.metrics.lcp = lastEntry.startTime;
      
      // Track LCP performance
      seoTracker.trackPagePerformance({
        url: pageData.url,
        pageType: pageData.pageType,
        metrics: {
          lcp: this.metrics.lcp,
          fid: this.metrics.fid || 0,
          cls: this.metrics.cls || 0,
          fcp: this.metrics.fcp || 0,
          ttfb: this.metrics.ttfb || 0
        },
        deviceType: this.getDeviceType()
      });
    });

    try {
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } catch (e) {
      console.warn('LCP monitoring not supported');
    }
  }

  /**
   * Measure First Input Delay (Interactivity metric)
   */
  private measureFID(pageData: any): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const firstEntry = list.getEntries()[0];
      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
    });

    try {
      observer.observe({ type: 'first-input', buffered: true });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }
  }

  /**
   * Measure Cumulative Layout Shift (Visual stability)
   */
  private measureCLS(pageData: any): void {
    if (!('PerformanceObserver' in window)) return;

    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        // Only count layout shifts that haven't been triggered by user input
        if (!(entry as any).hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          // If the entry occurred less than 1 second after the previous entry
          // and less than 5 seconds after the first entry in the session
          if (sessionValue && 
              (entry as any).startTime - lastSessionEntry.startTime < 1000 &&
              (entry as any).startTime - firstSessionEntry.startTime < 5000) {
            sessionValue += (entry as any).value;
            sessionEntries.push(entry);
          } else {
            sessionValue = (entry as any).value;
            sessionEntries = [entry];
          }

          // Update CLS if this session is larger than the current value
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            this.metrics.cls = clsValue;
          }
        }
      }
    });

    try {
      observer.observe({ type: 'layout-shift', buffered: true });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }

  /**
   * Measure First Contentful Paint
   */
  private measureFCP(pageData: any): void {
    if (!('PerformanceObserver' in window)) return;

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
      
      if (fcpEntry) {
        this.metrics.fcp = fcpEntry.startTime;
      }
    });

    try {
      observer.observe({ type: 'paint', buffered: true });
    } catch (e) {
      console.warn('FCP monitoring not supported');
    }
  }

  /**
   * Measure Time to First Byte
   */
  private measureTTFB(pageData: any): void {
    // Use Navigation Timing API for TTFB
    window.addEventListener('load', () => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navEntry) {
        this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }
    });
  }

  /**
   * Analyze navigation timing for additional insights
   */
  private analyzeNavigationTiming(pageData: any): void {
    window.addEventListener('load', () => {
      const navEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      
      if (navEntry) {
        const timing = {
          dns: navEntry.domainLookupEnd - navEntry.domainLookupStart,
          connection: navEntry.connectEnd - navEntry.connectStart,
          request: navEntry.responseStart - navEntry.requestStart,
          response: navEntry.responseEnd - navEntry.responseStart,
          domProcessing: navEntry.domContentLoadedEventStart - navEntry.responseEnd,
          total: navEntry.loadEventEnd - navEntry.navigationStart
        };

        // Track detailed performance breakdown
        this.trackDetailedPerformance(pageData, timing);
      }
    });
  }

  /**
   * Track page load completion with performance summary
   */
  private trackPageLoadComplete(pageData: any, loadTime: number): void {
    const analysis = this.analyzePerformance();
    
    // Enhanced SEO page view with performance data
    seoTracker.trackSEOPageView({
      url: pageData.url,
      title: document.title,
      pageType: pageData.pageType,
      entityName: pageData.entityName,
      seoScore: this.estimateSEOImpactScore(analysis),
      loadTime: loadTime / 1000, // Convert to seconds
      referrer: document.referrer
    });

    // Track performance-specific data
    if (this.hasCompleteMetrics()) {
      seoTracker.trackPagePerformance({
        url: pageData.url,
        pageType: pageData.pageType,
        metrics: this.metrics as WebVitalMetrics,
        deviceType: this.getDeviceType(),
        connectionType: this.getConnectionType()
      });
    }
  }

  /**
   * Analyze current performance metrics
   */
  private analyzePerformance(): PerformanceAnalysis {
    const score = this.calculatePerformanceScore();
    
    return {
      score,
      grades: {
        lcp: this.getLCPGrade(),
        fid: this.getFIDGrade(),
        cls: this.getCLSGrade()
      },
      seoImpact: score >= 80 ? 'low' : score >= 60 ? 'medium' : 'high',
      recommendations: this.getPerformanceRecommendations(),
      mobileOptimized: this.isMobileOptimized()
    };
  }

  /**
   * Calculate overall performance score (0-100)
   */
  private calculatePerformanceScore(): number {
    let score = 100;
    
    // LCP scoring (40% weight)
    if (this.metrics.lcp) {
      if (this.metrics.lcp > 4000) score -= 40;
      else if (this.metrics.lcp > 2500) score -= 20;
    }
    
    // FID scoring (30% weight) 
    if (this.metrics.fid) {
      if (this.metrics.fid > 300) score -= 30;
      else if (this.metrics.fid > 100) score -= 15;
    }
    
    // CLS scoring (30% weight)
    if (this.metrics.cls) {
      if (this.metrics.cls > 0.25) score -= 30;
      else if (this.metrics.cls > 0.1) score -= 15;
    }
    
    return Math.max(0, score);
  }

  /**
   * Get performance improvement recommendations
   */
  private getPerformanceRecommendations(): string[] {
    const recommendations: string[] = [];
    
    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push('Optimize image loading with priority loading for hero images');
      recommendations.push('Implement lazy loading for gallery images');
      recommendations.push('Use Next.js Image component with proper sizing');
    }
    
    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push('Reduce JavaScript execution time');
      recommendations.push('Implement code splitting for non-critical components');
    }
    
    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push('Add image dimensions to prevent layout shift');
      recommendations.push('Use CSS aspect-ratio for image containers');
      recommendations.push('Preload fonts to prevent text layout shift');
    }

    if (this.metrics.ttfb && this.metrics.ttfb > 800) {
      recommendations.push('Optimize server response time');
      recommendations.push('Implement CDN for static assets');
    }

    return recommendations;
  }

  /**
   * Track detailed performance breakdown
   */
  private trackDetailedPerformance(pageData: any, timing: any): void {
    // Track performance issues for SEO impact analysis
    const issues: string[] = [];
    
    if (timing.dns > 100) issues.push('slow-dns');
    if (timing.request > 500) issues.push('slow-server');
    if (timing.domProcessing > 2000) issues.push('heavy-dom');
    if (timing.total > 5000) issues.push('slow-total-load');

    // Custom tracking event for detailed performance
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture('seo_performance_breakdown', {
        page_url: pageData.url,
        page_type: pageData.pageType,
        dns_time: timing.dns,
        connection_time: timing.connection,
        server_response_time: timing.request,
        dom_processing_time: timing.domProcessing,
        total_load_time: timing.total,
        performance_issues: issues,
        device_type: this.getDeviceType(),
        connection_type: this.getConnectionType(),
        timestamp: new Date().toISOString()
      });
    }
  }

  /**
   * Utility methods
   */
  private getLCPGrade(): 'good' | 'needs-improvement' | 'poor' {
    if (!this.metrics.lcp) return 'good';
    if (this.metrics.lcp <= 2500) return 'good';
    if (this.metrics.lcp <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private getFIDGrade(): 'good' | 'needs-improvement' | 'poor' {
    if (!this.metrics.fid) return 'good';
    if (this.metrics.fid <= 100) return 'good';
    if (this.metrics.fid <= 300) return 'needs-improvement';
    return 'poor';
  }

  private getCLSGrade(): 'good' | 'needs-improvement' | 'poor' {
    if (!this.metrics.cls) return 'good';
    if (this.metrics.cls <= 0.1) return 'good';
    if (this.metrics.cls <= 0.25) return 'needs-improvement';
    return 'poor';
  }

  private getDeviceType(): 'desktop' | 'mobile' | 'tablet' {
    const width = window.innerWidth;
    if (width < 768) return 'mobile';
    if (width < 1024) return 'tablet';
    return 'desktop';
  }

  private getConnectionType(): string {
    // @ts-ignore - navigator.connection is experimental
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    return connection?.effectiveType || 'unknown';
  }

  private hasCompleteMetrics(): boolean {
    return !!(this.metrics.lcp && this.metrics.fid !== undefined && this.metrics.cls !== undefined);
  }

  private estimateSEOImpactScore(analysis: PerformanceAnalysis): number {
    // Estimate SEO score impact based on performance
    let seoScore = 85; // Base SEO score
    
    if (analysis.score >= 90) seoScore += 10;
    else if (analysis.score >= 80) seoScore += 5;
    else if (analysis.score < 60) seoScore -= 10;
    
    return Math.min(100, seoScore);
  }

  private isMobileOptimized(): boolean {
    const viewport = document.querySelector('meta[name="viewport"]');
    const hasResponsiveDesign = this.getDeviceType() === 'mobile' && 
                               this.calculatePerformanceScore() >= 70;
    
    return !!(viewport && hasResponsiveDesign);
  }

  /**
   * Image optimization monitoring for wedding galleries
   */
  monitorImagePerformance(): void {
    if (typeof window === 'undefined') return;

    // Monitor image loading performance
    const imageObserver = new PerformanceObserver((list) => {
      const imageEntries = list.getEntries().filter(entry => 
        entry.name.includes('.jpg') || 
        entry.name.includes('.jpeg') || 
        entry.name.includes('.png') ||
        entry.name.includes('.webp')
      );

      imageEntries.forEach(entry => {
        const loadTime = entry.responseEnd - entry.startTime;
        const size = (entry as any).transferSize || 0;
        
        // Track image performance for SEO
        if (window.posthog) {
          window.posthog.capture('seo_image_performance', {
            image_url: entry.name,
            load_time: loadTime,
            file_size: size,
            is_optimized: loadTime < 1000 && size < 500000, // Under 1s load, under 500KB
            device_type: this.getDeviceType(),
            page_url: window.location.pathname,
            timestamp: new Date().toISOString()
          });
        }

        // Alert for slow images that hurt SEO
        if (loadTime > 2000 || size > 1000000) { // 2s or 1MB
          console.warn(`🐌 Slow image detected: ${entry.name} (${loadTime}ms, ${size} bytes)`);
        }
      });
    });

    try {
      observer.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.warn('Image performance monitoring not supported');
    }
  }

  /**
   * Real-time performance alerts for SEO impact
   */
  setupPerformanceAlerts(): void {
    if (typeof window === 'undefined') return;

    // Alert for critical performance issues that impact SEO
    setTimeout(() => {
      const analysis = this.analyzePerformance();
      
      if (analysis.seoImpact === 'high') {
        console.warn('🚨 Performance issues detected that may impact SEO rankings:', {
          score: analysis.score,
          issues: analysis.recommendations,
          url: window.location.pathname
        });

        // Track performance alert
        if (window.posthog) {
          window.posthog.capture('seo_performance_alert', {
            page_url: window.location.pathname,
            performance_score: analysis.score,
            seo_impact: analysis.seoImpact,
            critical_issues: analysis.recommendations,
            device_type: this.getDeviceType(),
            timestamp: new Date().toISOString()
          });
        }
      }
    }, 5000); // Check after 5 seconds
  }

  /**
   * Generate performance optimization recommendations
   */
  getOptimizationRecommendations(): {
    immediate: string[];
    shortTerm: string[];
    technical: string[];
  } {
    const analysis = this.analyzePerformance();
    
    return {
      immediate: [
        'Add priority loading to hero images',
        'Implement lazy loading for gallery images',
        'Add image dimensions to prevent layout shift'
      ],
      shortTerm: [
        'Optimize image formats (convert to WebP)',
        'Implement image compression pipeline',
        'Add responsive image sizes',
        'Optimize font loading strategy'
      ],
      technical: [
        'Implement service worker for asset caching',
        'Use CDN for image delivery',
        'Optimize JavaScript bundle size',
        'Implement preloading for critical resources'
      ]
    };
  }

  /**
   * Wedding-specific performance optimization
   */
  optimizeWeddingContent(): {
    imageOptimization: string[];
    galleryOptimization: string[];
    venuePageOptimization: string[];
  } {
    return {
      imageOptimization: [
        'Hero images: Use priority loading + WebP format',
        'Gallery images: Implement lazy loading + responsive sizes',
        'Venue photos: Compress to <300KB while maintaining quality',
        'Testimonial photos: Optimize for mobile viewing'
      ],
      galleryOptimization: [
        'Implement virtual scrolling for large galleries',
        'Use thumbnail previews with full-size modal loading',
        'Add image preloading for next/previous gallery items',
        'Implement progressive image enhancement'
      ],
      venuePageOptimization: [
        'Lazy load venue comparison images',
        'Preload critical venue data for faster navigation',
        'Optimize venue filtering for instant results',
        'Implement venue image sprite loading'
      ]
    };
  }
}

/**
 * Initialize performance monitoring on page load
 */
export function initializePerformanceMonitoring(pageData: {
  url: string;
  pageType: 'venue' | 'event' | 'package' | 'page';
  entityName?: string;
}): void {
  
  if (typeof window === 'undefined') return;

  const monitor = new PerformanceMonitor();
  
  // Start monitoring immediately
  monitor.startMonitoring(pageData);
  monitor.monitorImagePerformance();
  monitor.setupPerformanceAlerts();

  // Set up ongoing monitoring
  window.addEventListener('beforeunload', () => {
    // Final performance report before page unload
    const analysis = monitor.analyzePerformance();
    
    if (window.posthog) {
      window.posthog.capture('seo_page_unload_performance', {
        page_url: pageData.url,
        final_performance_score: analysis.score,
        time_on_page: performance.now() / 1000,
        mobile_optimized: analysis.mobileOptimized,
        seo_impact: analysis.seoImpact,
        timestamp: new Date().toISOString()
      });
    }
  });
}

export const performanceMonitor = new PerformanceMonitor();