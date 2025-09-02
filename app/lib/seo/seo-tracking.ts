/**
 * PostHog SEO Tracking System
 * 
 * Advanced SEO performance tracking and analytics integration
 * for measuring search optimization impact and ROI
 */

import { posthog } from 'posthog-js';

export interface SEOTrackingEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}

export interface SEOPerformanceMetrics {
  organicSessions: number;
  organicPageViews: number;
  averageSessionDuration: number;
  bounceRate: number;
  conversionRate: number;
  topLandingPages: Array<{
    page: string;
    sessions: number;
    conversions: number;
  }>;
  topKeywords: Array<{
    keyword: string;
    impressions: number;
    clicks: number;
    position: number;
    ctr: number;
  }>;
}

export class SEOTracker {
  
  private readonly isClient = typeof window !== 'undefined';

  /**
   * Track SEO-related page views with enhanced metadata
   */
  trackSEOPageView(pageData: {
    url: string;
    title: string;
    pageType: 'venue' | 'event' | 'package' | 'team' | 'page';
    entityId?: string;
    entityName?: string;
    seoScore?: number;
    loadTime?: number;
    referrer?: string;
    searchKeyword?: string;
  }): void {
    if (!this.isClient) return;

    const properties = {
      // Basic page info
      page_type: pageData.pageType,
      page_title: pageData.title,
      page_url: pageData.url,
      
      // SEO-specific properties
      seo_score: pageData.seoScore,
      page_load_time: pageData.loadTime,
      referrer_type: this.categorizeReferrer(pageData.referrer || ''),
      
      // Entity-specific tracking
      entity_id: pageData.entityId,
      entity_name: pageData.entityName,
      
      // Search-specific tracking
      search_keyword: pageData.searchKeyword,
      is_organic_search: this.isOrganicSearch(pageData.referrer || ''),
      search_engine: this.getSearchEngine(pageData.referrer || ''),
      
      // Performance metrics
      timestamp: new Date().toISOString(),
      user_agent: window.navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight
    };

    posthog.capture('seo_page_view', properties);
  }

  /**
   * Track SEO optimization actions and improvements
   */
  trackSEOOptimization(optimization: {
    pageUrl: string;
    pageType: string;
    optimizationType: 'metadata' | 'content' | 'technical' | 'keywords';
    beforeScore: number;
    afterScore: number;
    specificChanges: string[];
    estimatedImpact: number;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_optimization_applied', {
      page_url: optimization.pageUrl,
      page_type: optimization.pageType,
      optimization_type: optimization.optimizationType,
      score_before: optimization.beforeScore,
      score_after: optimization.afterScore,
      score_improvement: optimization.afterScore - optimization.beforeScore,
      specific_changes: optimization.specificChanges,
      estimated_impact: optimization.estimatedImpact,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track search engine rankings and position changes
   */
  trackKeywordRanking(rankingData: {
    keyword: string;
    currentPosition: number;
    previousPosition?: number;
    searchVolume: number;
    pageUrl: string;
    searchEngine: 'google' | 'bing' | 'yahoo';
    competition: 'low' | 'medium' | 'high';
  }): void {
    if (!this.isClient) return;

    const positionChange = rankingData.previousPosition ? 
      rankingData.previousPosition - rankingData.currentPosition : 0;

    posthog.capture('seo_keyword_ranking', {
      keyword: rankingData.keyword,
      current_position: rankingData.currentPosition,
      previous_position: rankingData.previousPosition,
      position_change: positionChange,
      position_trend: positionChange > 0 ? 'improved' : positionChange < 0 ? 'declined' : 'stable',
      search_volume: rankingData.searchVolume,
      page_url: rankingData.pageUrl,
      search_engine: rankingData.searchEngine,
      competition_level: rankingData.competition,
      ranking_page: Math.ceil(rankingData.currentPosition / 10),
      is_first_page: rankingData.currentPosition <= 10,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track organic search traffic and conversions
   */
  trackOrganicConversion(conversionData: {
    pageUrl: string;
    conversionType: 'contact_form' | 'email_click' | 'phone_click' | 'venue_inquiry' | 'package_request';
    conversionValue?: number;
    sourceKeyword?: string;
    searchEngine?: string;
    landingPage: string;
    sessionDuration: number;
    pagesViewed: number;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_organic_conversion', {
      conversion_type: conversionData.conversionType,
      conversion_page: conversionData.pageUrl,
      conversion_value: conversionData.conversionValue,
      source_keyword: conversionData.sourceKeyword,
      search_engine: conversionData.searchEngine,
      landing_page: conversionData.landingPage,
      session_duration: conversionData.sessionDuration,
      pages_viewed: conversionData.pagesViewed,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track Core Web Vitals and page performance
   */
  trackPagePerformance(performanceData: {
    url: string;
    pageType: string;
    metrics: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay  
      cls: number; // Cumulative Layout Shift
      fcp: number; // First Contentful Paint
      ttfb: number; // Time to First Byte
    };
    deviceType: 'desktop' | 'mobile' | 'tablet';
    connectionType?: string;
  }): void {
    if (!this.isClient) return;

    const { metrics } = performanceData;
    
    // Calculate performance score
    const performanceScore = this.calculatePerformanceScore(metrics);
    
    posthog.capture('seo_page_performance', {
      page_url: performanceData.url,
      page_type: performanceData.pageType,
      device_type: performanceData.deviceType,
      connection_type: performanceData.connectionType,
      
      // Core Web Vitals
      lcp: metrics.lcp,
      fid: metrics.fid,
      cls: metrics.cls,
      fcp: metrics.fcp,
      ttfb: metrics.ttfb,
      
      // Calculated scores
      performance_score: performanceScore,
      lcp_grade: this.getLCPGrade(metrics.lcp),
      fid_grade: this.getFIDGrade(metrics.fid),
      cls_grade: this.getCLSGrade(metrics.cls),
      
      // SEO impact indicators
      is_mobile_optimized: performanceData.deviceType === 'mobile' && performanceScore >= 75,
      meets_core_web_vitals: this.meetsWebVitals(metrics),
      
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track content engagement for SEO insights
   */
  trackContentEngagement(engagementData: {
    pageUrl: string;
    pageType: string;
    contentLength: number;
    readingTime: number; // estimated
    actualTimeOnPage: number;
    scrollDepth: number; // percentage
    bounced: boolean;
    exitPage: boolean;
    nextPageUrl?: string;
    sourceKeyword?: string;
  }): void {
    if (!this.isClient) return;

    const readingCompletion = engagementData.actualTimeOnPage / engagementData.readingTime;
    
    posthog.capture('seo_content_engagement', {
      page_url: engagementData.pageUrl,
      page_type: engagementData.pageType,
      content_length: engagementData.contentLength,
      estimated_reading_time: engagementData.readingTime,
      actual_time_on_page: engagementData.actualTimeOnPage,
      scroll_depth_percentage: engagementData.scrollDepth,
      reading_completion_rate: readingCompletion,
      content_quality_indicator: readingCompletion >= 0.7 ? 'high' : readingCompletion >= 0.4 ? 'medium' : 'low',
      bounced: engagementData.bounced,
      exit_page: engagementData.exitPage,
      next_page: engagementData.nextPageUrl,
      source_keyword: engagementData.sourceKeyword,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track internal link clicks for SEO flow analysis
   */
  trackInternalLinkClick(linkData: {
    fromPage: string;
    toPage: string;
    linkText: string;
    linkPosition: 'header' | 'content' | 'sidebar' | 'footer';
    isRelatedContent: boolean;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_internal_link_click', {
      from_page: linkData.fromPage,
      to_page: linkData.toPage,
      link_text: linkData.linkText,
      link_position: linkData.linkPosition,
      is_related_content: linkData.isRelatedContent,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track search feature usage (filters, sorting, etc.)
   */
  trackSearchFeatureUsage(featureData: {
    feature: 'venue_filter' | 'area_filter' | 'capacity_filter' | 'price_filter' | 'search_box';
    value: string;
    pageUrl: string;
    resultCount: number;
    clickedResult?: string;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_search_feature_usage', {
      feature_type: featureData.feature,
      filter_value: featureData.value,
      page_url: featureData.pageUrl,
      result_count: featureData.resultCount,
      clicked_result: featureData.clickedResult,
      conversion_rate: featureData.clickedResult ? (1 / featureData.resultCount) * 100 : 0,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track local SEO signals
   */
  trackLocalSEOEvent(localData: {
    eventType: 'location_view' | 'direction_click' | 'phone_click' | 'area_browse';
    venueId?: string;
    venueName?: string;
    area: string;
    userLocation?: { lat: number; lng: number };
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_local_interaction', {
      local_event_type: localData.eventType,
      venue_id: localData.venueId,
      venue_name: localData.venueName,
      bali_area: localData.area,
      user_latitude: localData.userLocation?.lat,
      user_longitude: localData.userLocation?.lng,
      is_international_user: this.isInternationalUser(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track structured data implementation and performance
   */
  trackStructuredDataEvent(schemaData: {
    pageUrl: string;
    schemaType: 'LocalBusiness' | 'Event' | 'Product' | 'Review' | 'Organization';
    isImplemented: boolean;
    validationErrors?: string[];
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_structured_data', {
      page_url: schemaData.pageUrl,
      schema_type: schemaData.schemaType,
      is_implemented: schemaData.isImplemented,
      validation_errors: schemaData.validationErrors || [],
      error_count: schemaData.validationErrors?.length || 0,
      is_valid: !schemaData.validationErrors || schemaData.validationErrors.length === 0,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Create SEO dashboard events for PostHog insights
   */
  initializeSEODashboard(): void {
    if (!this.isClient) return;

    // Set up user properties for SEO segmentation
    posthog.setPersonProperties({
      seo_tracking_enabled: true,
      website_type: 'wedding_business',
      primary_location: 'bali_indonesia',
      business_category: 'wedding_planning',
      content_entities: ['venues', 'real_weddings', 'packages', 'team'],
      seo_focus_keywords: [
        'bali wedding',
        'bali wedding planner', 
        'wedding venues bali',
        'destination wedding bali'
      ]
    });

    // Track SEO system initialization
    posthog.capture('seo_system_initialized', {
      total_pages_tracked: this.getPageCount(),
      tracking_features_enabled: [
        'page_performance',
        'keyword_tracking',
        'conversion_tracking',
        'local_seo',
        'structured_data',
        'content_engagement'
      ],
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track weekly SEO performance summary
   */
  trackWeeklySEOSummary(summaryData: {
    totalOrganicSessions: number;
    totalOrganicConversions: number;
    averageSEOScore: number;
    topPerformingPages: string[];
    keywordRankingChanges: Array<{
      keyword: string;
      positionChange: number;
    }>;
    newOptimizationsApplied: number;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_weekly_summary', {
      organic_sessions: summaryData.totalOrganicSessions,
      organic_conversions: summaryData.totalOrganicConversions,
      conversion_rate: (summaryData.totalOrganicConversions / summaryData.totalOrganicSessions) * 100,
      average_seo_score: summaryData.averageSEOScore,
      top_performing_pages: summaryData.topPerformingPages,
      keyword_improvements: summaryData.keywordRankingChanges.filter(k => k.positionChange > 0).length,
      keyword_declines: summaryData.keywordRankingChanges.filter(k => k.positionChange < 0).length,
      optimizations_applied: summaryData.newOptimizationsApplied,
      week_start: this.getWeekStart().toISOString(),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track venue-specific SEO performance
   */
  trackVenueSEOPerformance(venueData: {
    venueId: string;
    venueName: string;
    area: string;
    venueType: string;
    organicVisits: number;
    inquiries: number;
    averageTimeOnPage: number;
    bounceRate: number;
    topKeywords: string[];
    imageViews: number;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_venue_performance', {
      venue_id: venueData.venueId,
      venue_name: venueData.venueName,
      venue_area: venueData.area,
      venue_type: venueData.venueType,
      organic_visits: venueData.organicVisits,
      inquiry_conversions: venueData.inquiries,
      conversion_rate: (venueData.inquiries / venueData.organicVisits) * 100,
      average_time_on_page: venueData.averageTimeOnPage,
      bounce_rate: venueData.bounceRate,
      top_keywords: venueData.topKeywords,
      image_views: venueData.imageViews,
      engagement_score: this.calculateEngagementScore(venueData),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Track competitor analysis and market insights
   */
  trackCompetitorInsight(competitorData: {
    competitorDomain: string;
    keywordGap: string;
    opportunityScore: number;
    actionTaken: string;
    estimatedTrafficPotential: number;
  }): void {
    if (!this.isClient) return;

    posthog.capture('seo_competitor_insight', {
      competitor_domain: competitorData.competitorDomain,
      keyword_gap: competitorData.keywordGap,
      opportunity_score: competitorData.opportunityScore,
      action_taken: competitorData.actionTaken,
      traffic_potential: competitorData.estimatedTrafficPotential,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Custom PostHog events for wedding business SEO KPIs
   */
  trackWeddingBusinessKPIs(kpiData: {
    totalVenueViews: number;
    totalInquiries: number;
    averageInquiryValue: number;
    seasonalBookingTrend: 'up' | 'down' | 'stable';
    topVenuesByTraffic: string[];
    topAreasByInquiries: string[];
  }): void {
    if (!this.isClient) return;

    posthog.capture('wedding_business_seo_kpis', {
      venue_views: kpiData.totalVenueViews,
      total_inquiries: kpiData.totalInquiries,
      inquiry_rate: (kpiData.totalInquiries / kpiData.totalVenueViews) * 100,
      average_inquiry_value: kpiData.averageInquiryValue,
      seasonal_trend: kpiData.seasonalBookingTrend,
      top_venues_traffic: kpiData.topVenuesByTraffic,
      top_areas_inquiries: kpiData.topAreasByInquiries,
      revenue_per_session: this.estimateRevenuePerSession(kpiData),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Helper methods for tracking analysis
   */
  private categorizeReferrer(referrer: string): string {
    if (!referrer) return 'direct';
    
    if (this.isOrganicSearch(referrer)) return 'organic_search';
    if (referrer.includes('facebook') || referrer.includes('instagram')) return 'social';
    if (referrer.includes('google') && referrer.includes('ads')) return 'paid_search';
    if (referrer.includes('booking') || referrer.includes('expedia')) return 'booking_platform';
    
    return 'referral';
  }

  private isOrganicSearch(referrer: string): boolean {
    const organicDomains = ['google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com'];
    return organicDomains.some(domain => referrer.includes(domain)) && !referrer.includes('ads');
  }

  private getSearchEngine(referrer: string): string | undefined {
    if (referrer.includes('google')) return 'google';
    if (referrer.includes('bing')) return 'bing';
    if (referrer.includes('yahoo')) return 'yahoo';
    if (referrer.includes('duckduckgo')) return 'duckduckgo';
    return undefined;
  }

  private calculatePerformanceScore(metrics: any): number {
    // Simplified performance scoring
    let score = 100;
    
    if (metrics.lcp > 4000) score -= 25;
    else if (metrics.lcp > 2500) score -= 15;
    
    if (metrics.fid > 300) score -= 25;
    else if (metrics.fid > 100) score -= 15;
    
    if (metrics.cls > 0.25) score -= 25;
    else if (metrics.cls > 0.1) score -= 15;

    return Math.max(0, score);
  }

  private getLCPGrade(lcp: number): 'good' | 'needs_improvement' | 'poor' {
    if (lcp <= 2500) return 'good';
    if (lcp <= 4000) return 'needs_improvement';
    return 'poor';
  }

  private getFIDGrade(fid: number): 'good' | 'needs_improvement' | 'poor' {
    if (fid <= 100) return 'good';
    if (fid <= 300) return 'needs_improvement';
    return 'poor';
  }

  private getCLSGrade(cls: number): 'good' | 'needs_improvement' | 'poor' {
    if (cls <= 0.1) return 'good';
    if (cls <= 0.25) return 'needs_improvement';
    return 'poor';
  }

  private meetsWebVitals(metrics: any): boolean {
    return metrics.lcp <= 2500 && metrics.fid <= 100 && metrics.cls <= 0.1;
  }

  private calculateEngagementScore(venueData: any): number {
    let score = 0;
    
    // Time on page score (40% of total)
    if (venueData.averageTimeOnPage >= 120) score += 40;
    else score += (venueData.averageTimeOnPage / 120) * 40;
    
    // Bounce rate score (30% of total)
    const bounceScore = Math.max(0, 100 - venueData.bounceRate);
    score += (bounceScore / 100) * 30;
    
    // Conversion rate score (30% of total)
    const conversionRate = (venueData.inquiries / venueData.organicVisits) * 100;
    if (conversionRate >= 5) score += 30;
    else score += (conversionRate / 5) * 30;
    
    return Math.round(score);
  }

  private isInternationalUser(): boolean {
    // Simple detection based on timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return !timezone.includes('Asia/Jakarta') && !timezone.includes('Asia/Makassar');
  }

  private estimateRevenuePerSession(kpiData: any): number {
    // Estimate revenue per session based on average inquiry value and conversion rate
    const conversionRate = kpiData.totalInquiries / kpiData.totalVenueViews;
    return kpiData.averageInquiryValue * conversionRate;
  }

  private getPageCount(): number {
    // Would be dynamically calculated based on Sanity content
    return 150; // Estimated: 111 venues + packages + events + other pages
  }

  private getWeekStart(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const firstDayOfWeek = new Date(today);
    firstDayOfWeek.setDate(today.getDate() - dayOfWeek);
    firstDayOfWeek.setHours(0, 0, 0, 0);
    return firstDayOfWeek;
  }
}

/**
 * PostHog SEO Dashboard Configuration
 * Use these event names to create custom insights in PostHog
 */
export const SEO_EVENTS = {
  PAGE_VIEW: 'seo_page_view',
  OPTIMIZATION_APPLIED: 'seo_optimization_applied',
  KEYWORD_RANKING: 'seo_keyword_ranking',
  ORGANIC_CONVERSION: 'seo_organic_conversion',
  PAGE_PERFORMANCE: 'seo_page_performance',
  CONTENT_ENGAGEMENT: 'seo_content_engagement',
  INTERNAL_LINK_CLICK: 'seo_internal_link_click',
  SEARCH_FEATURE_USAGE: 'seo_search_feature_usage',
  LOCAL_INTERACTION: 'seo_local_interaction',
  STRUCTURED_DATA: 'seo_structured_data',
  WEEKLY_SUMMARY: 'seo_weekly_summary',
  BUSINESS_KPIS: 'wedding_business_seo_kpis',
  SYSTEM_INITIALIZED: 'seo_system_initialized'
} as const;

/**
 * PostHog Dashboard Insights Configuration
 * 
 * Create these insights in PostHog for comprehensive SEO monitoring:
 * 
 * 1. SEO Performance Overview
 *    - Average SEO score trend
 *    - Organic traffic growth
 *    - Conversion rate from organic traffic
 *    
 * 2. Keyword Performance
 *    - Ranking position changes over time  
 *    - Top performing keywords by traffic
 *    - Keyword opportunity tracking
 *    
 * 3. Page Performance Analysis
 *    - Core Web Vitals by page type
 *    - Performance scores by device type
 *    - Pages needing optimization
 *    
 * 4. Local SEO Performance
 *    - Performance by Bali area
 *    - International vs domestic traffic
 *    - Local interaction rates
 *    
 * 5. Content Engagement
 *    - Content quality by engagement metrics
 *    - Reading completion rates
 *    - Internal link flow analysis
 *    
 * 6. Wedding Business KPIs
 *    - Inquiry rates by venue/area
 *    - Seasonal booking trends
 *    - Revenue per organic session
 */

export const seoTracker = new SEOTracker();