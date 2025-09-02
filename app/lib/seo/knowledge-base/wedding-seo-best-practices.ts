/**
 * Wedding Industry SEO Best Practices
 * 
 * Comprehensive knowledge base of wedding business SEO strategies,
 * local optimization techniques, and industry-specific tactics
 */

export interface SEOBestPractice {
  category: 'technical' | 'content' | 'local' | 'keywords' | 'conversion';
  title: string;
  description: string;
  implementation: string;
  impact: 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  weddingSpecific: boolean;
  examples?: string[];
}

export class WeddingSEOKnowledgeBase {
  
  /**
   * Get all wedding industry SEO best practices
   */
  getAllBestPractices(): SEOBestPractice[] {
    return [
      ...this.getLocalSEOPractices(),
      ...this.getWeddingContentPractices(),
      ...this.getTechnicalSEOPractices(),
      ...this.getConversionOptimizationPractices(),
      ...this.getKeywordOptimizationPractices()
    ];
  }

  /**
   * Local SEO best practices for wedding venues in Bali
   */
  private getLocalSEOPractices(): SEOBestPractice[] {
    return [
      {
        category: 'local',
        title: 'Optimize for "Area + Wedding" Keywords',
        description: 'Target location-specific wedding searches for each Bali area',
        implementation: 'Create location pages for Uluwatu, Seminyak, Ubud with area-specific venue listings and wedding tips',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '2-3 weeks',
        weddingSpecific: true,
        examples: [
          'Create /uluwatu-wedding-venues page',
          'Add "Uluwatu wedding" throughout venue content in that area',
          'Include local landmarks and attractions in venue descriptions'
        ]
      },
      {
        category: 'local',
        title: 'Implement Local Business Schema',
        description: 'Add structured data for local wedding planning business',
        implementation: 'Add LocalBusiness schema with Bali office location, contact info, service areas, and reviews',
        impact: 'high',
        difficulty: 'easy',
        timeframe: '1-2 hours',
        weddingSpecific: false,
        examples: [
          'Include office address in Seminyak',
          'Add service area coverage (all Bali areas)',
          'Include aggregate review ratings and count'
        ]
      },
      {
        category: 'local',
        title: 'Create Area-Specific Venue Guides',
        description: 'Build topical authority for each major Bali wedding area',
        implementation: 'Create comprehensive guides for each area with venue listings, local info, and planning tips',
        impact: 'high',
        difficulty: 'hard',
        timeframe: '4-6 weeks', 
        weddingSpecific: true,
        examples: [
          '"Ultimate Uluwatu Wedding Venue Guide"',
          '"Seminyak Wedding Planning: Venues, Vendors & Tips"',
          '"Ubud Wedding Guide: Jungle & Rice Paddy Venues"'
        ]
      },
      {
        category: 'local',
        title: 'Optimize for International + Local Search',
        description: 'Balance international wedding traffic with local Bali searches',
        implementation: 'Create content for both "bali wedding from [country]" and local Indonesian searches',
        impact: 'medium',
        difficulty: 'medium',
        timeframe: '2-3 weeks',
        weddingSpecific: true,
        examples: [
          'Target "Australian couple bali wedding"',
          'Create content in Indonesian for local searches',
          'Add currency conversion and visa information'
        ]
      }
    ];
  }

  /**
   * Wedding content optimization best practices
   */
  private getWeddingContentPractices(): SEOBestPractice[] {
    return [
      {
        category: 'content',
        title: 'Create Wedding Story Content Clusters',
        description: 'Build topical authority around real wedding stories and planning',
        implementation: 'Group real weddings by venue, style, season, and create interconnected content',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '3-4 weeks',
        weddingSpecific: true,
        examples: [
          'Group all Villa Vedas weddings with venue-specific insights',
          'Create seasonal wedding collections (dry season vs rainy season)',
          'Link related venues in same area with "similar venues" sections'
        ]
      },
      {
        category: 'content',
        title: 'Optimize Wedding Photo Alt Text',
        description: 'Use descriptive, keyword-rich alt text for all wedding imagery',
        implementation: 'Include venue name, couple names, wedding style, and location in image alt text',
        impact: 'medium',
        difficulty: 'easy',
        timeframe: '1 week',
        weddingSpecific: true,
        examples: [
          '"Sarah and James clifftop wedding ceremony at Villa Vedas Uluwatu Bali"',
          '"Beach wedding reception setup at Ku De Ta Seminyak with sunset view"',
          '"Traditional Balinese wedding decoration with tropical flowers at Ubud venue"'
        ]
      },
      {
        category: 'content',
        title: 'Build Wedding Planning Resource Hub',
        description: 'Create comprehensive planning resources that capture informational searches',
        implementation: 'Develop guides, checklists, timelines, and planning tools that convert to leads',
        impact: 'high',
        difficulty: 'hard',
        timeframe: '6-8 weeks',
        weddingSpecific: true,
        examples: [
          '"12-Month Bali Wedding Planning Checklist"',
          '"Bali Wedding Budget Calculator"',
          '"Wedding Vendor Contact Template"'
        ]
      },
      {
        category: 'content',
        title: 'Leverage Testimonial Content for SEO',
        description: 'Turn testimonials into SEO-optimized content pages',
        implementation: 'Create individual testimonial pages with full wedding details and venue information',
        impact: 'medium',
        difficulty: 'easy',
        timeframe: '1-2 weeks',
        weddingSpecific: true,
        examples: [
          'Create /reviews/sarah-james-villa-vedas page',
          'Include full wedding story with venue details',
          'Add structured data for review schema'
        ]
      }
    ];
  }

  /**
   * Technical SEO best practices for wedding websites
   */
  private getTechnicalSEOPractices(): SEOBestPractice[] {
    return [
      {
        category: 'technical',
        title: 'Optimize Image Loading for Wedding Galleries',
        description: 'Implement lazy loading and responsive images for large photo galleries',
        implementation: 'Use Next.js Image component with priority loading for hero images and lazy loading for galleries',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '1-2 days',
        weddingSpecific: true,
        examples: [
          'Add priority prop to venue hero images',
          'Implement gallery lazy loading with intersection observer',
          'Use responsive image sizing based on device'
        ]
      },
      {
        category: 'technical',
        title: 'Generate Dynamic XML Sitemaps',
        description: 'Create automatically updated sitemaps for all content types',
        implementation: 'Build sitemap generation from Sanity content with proper priority and frequency',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '4-6 hours',
        weddingSpecific: false,
        examples: [
          'Venue pages: priority 0.8, weekly updates',
          'Real wedding pages: priority 0.6, monthly updates', 
          'Package pages: priority 0.9, weekly updates'
        ]
      },
      {
        category: 'technical',
        title: 'Implement Structured Data for Events',
        description: 'Add Event schema markup for wedding events and venue information',
        implementation: 'Create JSON-LD structured data for venues, events, and business information',
        impact: 'high',
        difficulty: 'medium', 
        timeframe: '1-2 weeks',
        weddingSpecific: true,
        examples: [
          'Event schema for real wedding pages',
          'Place schema for venue pages with location data',
          'LocalBusiness schema for main business pages'
        ]
      },
      {
        category: 'technical',
        title: 'Optimize Core Web Vitals for Mobile',
        description: 'Ensure excellent mobile performance for wedding venue browsing',
        implementation: 'Optimize image loading, reduce layout shifts, minimize JavaScript execution',
        impact: 'high',
        difficulty: 'hard',
        timeframe: '1-2 weeks',
        weddingSpecific: false,
        examples: [
          'Implement image dimension attributes',
          'Use CSS aspect-ratio for image containers',
          'Optimize font loading to prevent layout shift'
        ]
      }
    ];
  }

  /**
   * Conversion optimization practices for wedding businesses
   */
  private getConversionOptimizationPractices(): SEOBestPractice[] {
    return [
      {
        category: 'conversion',
        title: 'Add Urgency and Scarcity Elements',
        description: 'Use wedding season and venue availability to create booking urgency',
        implementation: 'Display seasonal availability, booking calendars, and limited venue capacity',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '1-2 weeks',
        weddingSpecific: true,
        examples: [
          '"Only 3 dates available in peak season 2024"',
          '"This venue books 18 months in advance"',
          '"Limited to 100 weddings per year"'
        ]
      },
      {
        category: 'conversion',
        title: 'Implement Social Proof Throughout',
        description: 'Strategically place testimonials and wedding counts for trust building',
        implementation: 'Add testimonial widgets, wedding counters, and review ratings to all key pages',
        impact: 'high',
        difficulty: 'easy',
        timeframe: '3-5 days',
        weddingSpecific: true,
        examples: [
          'Add "2000+ weddings planned" to homepage',
          'Include venue-specific testimonials on venue pages',
          'Show star ratings and review counts'
        ]
      },
      {
        category: 'conversion',
        title: 'Create Multi-Step Lead Capture',
        description: 'Guide users through progressive information gathering',
        implementation: 'Create venue inquiry forms, package selectors, and planning questionnaires',
        impact: 'medium',
        difficulty: 'hard',
        timeframe: '2-3 weeks',
        weddingSpecific: true,
        examples: [
          'Venue availability checker',
          'Wedding style questionnaire',
          'Budget planning calculator'
        ]
      }
    ];
  }

  /**
   * Wedding keyword optimization strategies
   */
  private getKeywordOptimizationPractices(): SEOBestPractice[] {
    return [
      {
        category: 'keywords',
        title: 'Target Long-tail Wedding Combinations',
        description: 'Capture specific wedding style + location + venue type searches',
        implementation: 'Create content targeting "[style] wedding at [venue] in [area]" combinations',
        impact: 'high',
        difficulty: 'medium',
        timeframe: '3-4 weeks',
        weddingSpecific: true,
        examples: [
          '"Bohemian beach wedding at Ku De Ta Seminyak"',
          '"Intimate villa wedding in Uluwatu with ocean views"',
          '"Luxury clifftop wedding at The Edge Bali"'
        ]
      },
      {
        category: 'keywords',
        title: 'Create Seasonal Keyword Content',
        description: 'Target seasonal wedding planning and weather-related searches',
        implementation: 'Build content calendar around Bali wedding seasons and peak planning times',
        impact: 'medium',
        difficulty: 'medium',
        timeframe: '4-6 weeks',
        weddingSpecific: true,
        examples: [
          '"Best months for Bali beach wedding"',
          '"Dry season vs rainy season wedding planning"',
          '"Peak wedding season booking timeline"'
        ]
      },
      {
        category: 'keywords',
        title: 'Optimize for Wedding Budget Searches',
        description: 'Capture cost and pricing related wedding searches',
        implementation: 'Create transparent pricing content that ranks for budget-related queries',
        impact: 'high',
        difficulty: 'easy',
        timeframe: '1-2 weeks',
        weddingSpecific: true,
        examples: [
          '"Bali wedding cost breakdown"',
          '"Affordable luxury wedding packages"',
          '"All-inclusive Bali wedding pricing"'
        ]
      },
      {
        category: 'keywords',
        title: 'Build Authority for Wedding Planning Terms',
        description: 'Establish topical authority in wedding planning and coordination',
        implementation: 'Create comprehensive planning resources and establish expertise signals',
        impact: 'high',
        difficulty: 'hard',
        timeframe: '6-8 weeks',
        weddingSpecific: true,
        examples: [
          '"How to plan a destination wedding in Bali"',
          '"Wedding planner vs DIY: Bali edition"',
          '"Legal requirements for international weddings in Bali"'
        ]
      }
    ];
  }

  /**
   * Get best practices for specific content types
   */
  getBestPracticesForContentType(contentType: 'venue' | 'event' | 'package' | 'team'): SEOBestPractice[] {
    const allPractices = this.getAllBestPractices();
    
    switch (contentType) {
      case 'venue':
        return allPractices.filter(practice => 
          practice.title.includes('venue') || 
          practice.category === 'local' ||
          practice.title.includes('image') ||
          practice.title.includes('schema')
        );
        
      case 'event':
        return allPractices.filter(practice =>
          practice.title.includes('story') ||
          practice.title.includes('Event') ||
          practice.title.includes('testimonial') ||
          practice.category === 'content'
        );
        
      case 'package':
        return allPractices.filter(practice =>
          practice.title.includes('pricing') ||
          practice.title.includes('budget') ||
          practice.title.includes('conversion') ||
          practice.category === 'conversion'
        );
        
      case 'team':
        return allPractices.filter(practice =>
          practice.title.includes('authority') ||
          practice.title.includes('expertise') ||
          practice.category === 'keywords'
        );
        
      default:
        return allPractices;
    }
  }

  /**
   * Wedding industry keyword research patterns
   */
  getKeywordResearchPatterns(): {
    patterns: string[];
    modifiers: string[];
    intentTypes: Record<string, string[]>;
  } {
    return {
      patterns: [
        '[location] + wedding + [venue type]',
        '[venue name] + wedding + bali',
        '[style] + wedding + [location]',
        'bali + [service] + wedding',
        '[month/season] + wedding + bali'
      ],
      modifiers: [
        'luxury', 'affordable', 'intimate', 'grand', 'traditional',
        'modern', 'beach', 'clifftop', 'villa', 'garden',
        'sunset', 'sunrise', 'private', 'exclusive'
      ],
      intentTypes: {
        informational: [
          'how to plan', 'best time for', 'requirements for',
          'cost of', 'guide to', 'tips for'
        ],
        commercial: [
          'wedding venues', 'wedding planners', 'wedding packages',
          'wedding services', 'wedding photography'
        ],
        transactional: [
          'book wedding', 'hire planner', 'contact venue',
          'get quote', 'reserve date'
        ],
        navigational: [
          '[venue name]', '[business name]', '[planner name]'
        ]
      }
    };
  }

  /**
   * Content optimization templates for wedding pages
   */
  getContentOptimizationTemplates(): Record<string, any> {
    return {
      venue: {
        title_template: '{venue_name} - {area} {venue_type} Wedding Venue | Bali Love',
        description_template: '{venue_name} in {area}, Bali. {capacity_info} {price_info} Luxury wedding venue with professional planning. Book your dream destination wedding.',
        h1_template: '{venue_name} Wedding Venue in {area}',
        required_sections: [
          'About This Venue',
          'Wedding Packages & Pricing', 
          'Photo Gallery',
          'Getting There',
          'Real Weddings at This Venue',
          'Contact & Booking'
        ],
        keyword_targets: [
          '{venue_name} wedding',
          '{area} wedding venue',
          'luxury {venue_type} wedding bali'
        ]
      },
      
      realEvent: {
        title_template: '{bride_name} & {groom_name} {year} Wedding at {venue_name} | Real Bali Wedding',
        description_template: '{bride_name} & {groom_name}\'s {year} wedding at {venue_name} in {area}, Bali. {guest_count} guests celebrated with Bali Love planning. See photos & read their story.',
        h1_template: '{bride_name} & {groom_name}\'s {venue_name} Wedding',
        required_sections: [
          'Their Love Story',
          'Why They Chose Bali',
          'Wedding Planning Journey',
          'The Big Day',
          'Photo Highlights',
          'Their Advice for Future Couples'
        ],
        keyword_targets: [
          '{venue_name} real wedding',
          '{area} wedding story',
          '{style} wedding bali'
        ]
      },

      weddingPackage: {
        title_template: '{package_name} - Bali Wedding Package from ${price} | Bali Love',
        description_template: '{package_name} for Bali destination weddings. {guest_info} Starting from ${price}. Includes venue, planning & coordination. Book your dream wedding.',
        h1_template: '{package_name} Wedding Package',
        required_sections: [
          'Package Overview',
          'What\'s Included',
          'Venue Options',
          'Pricing & Payment Terms',
          'Add-On Services',
          'Real Wedding Examples',
          'Get Started'
        ],
        keyword_targets: [
          '{package_type} wedding package bali',
          'all inclusive bali wedding',
          'bali wedding package ${price}'
        ]
      }
    };
  }

  /**
   * Local SEO optimization strategies for Bali
   */
  getLocalSEOStrategies(): {
    areas: Array<{
      name: string;
      keywords: string[];
      characteristics: string[];
      venues: number;
      opportunity: string;
    }>;
    localOptimization: string[];
    competitorAnalysis: string[];
  } {
    return {
      areas: [
        {
          name: 'Uluwatu',
          keywords: ['uluwatu wedding', 'clifftop wedding bali', 'ocean view wedding'],
          characteristics: ['clifftop venues', 'ocean views', 'sunset ceremonies', 'dramatic backdrops'],
          venues: 25,
          opportunity: 'High - premium positioning with luxury clifftop venues'
        },
        {
          name: 'Seminyak',
          keywords: ['seminyak wedding', 'beach club wedding', 'modern wedding bali'],
          characteristics: ['beach clubs', 'modern venues', 'vibrant nightlife', 'luxury resorts'],
          venues: 20,
          opportunity: 'High - trendy area with high-end venues'
        },
        {
          name: 'Ubud',
          keywords: ['ubud wedding', 'jungle wedding bali', 'cultural wedding'],
          characteristics: ['jungle settings', 'cultural venues', 'rice paddies', 'spiritual atmosphere'],
          venues: 18,
          opportunity: 'Medium - unique positioning but lower search volume'
        },
        {
          name: 'Canggu',
          keywords: ['canggu wedding', 'surf wedding bali', 'bohemian wedding'],
          characteristics: ['surf culture', 'bohemian style', 'beach venues', 'laid-back vibe'],
          venues: 12,
          opportunity: 'Medium - growing area with emerging venues'
        }
      ],
      localOptimization: [
        'Create area-specific landing pages with venue listings',
        'Include local landmark mentions in venue descriptions',
        'Add transportation and accommodation info for each area',
        'Build local vendor directory pages',
        'Create "getting to [area]" guide content'
      ],
      competitorAnalysis: [
        'Monitor competitor venue coverage by area',
        'Track competitor keyword rankings for local terms',
        'Analyze competitor content gaps by location',
        'Identify underserved areas and venue types'
      ]
    };
  }

  /**
   * Wedding SEO content calendar suggestions
   */
  getSEOContentCalendar(): Array<{
    month: string;
    focusKeywords: string[];
    contentSuggestions: string[];
    seasonalOpportunity: string;
  }> {
    return [
      {
        month: 'January',
        focusKeywords: ['new year wedding bali', 'valentine wedding planning', '2024 wedding trends bali'],
        contentSuggestions: [
          'New Year Wedding Inspiration',
          '2024 Wedding Trends in Bali',
          'Valentine\'s Day Wedding Planning Guide'
        ],
        seasonalOpportunity: 'Post-holiday wedding planning surge'
      },
      {
        month: 'February',
        focusKeywords: ['valentine wedding bali', 'romantic wedding venues', 'february wedding weather'],
        contentSuggestions: [
          'Most Romantic Wedding Venues in Bali',
          'Valentine\'s Day Wedding Inspiration',
          'February Weather Guide for Bali Weddings'
        ],
        seasonalOpportunity: 'Romance-focused content performs well'
      },
      {
        month: 'March',
        focusKeywords: ['spring wedding bali', 'dry season wedding', 'march wedding planning'],
        contentSuggestions: [
          'Spring Wedding Season Guide',
          'Dry Season Wedding Advantages',
          'March Wedding Weather in Bali'
        ],
        seasonalOpportunity: 'Dry season planning begins'
      },
      // Continue for all 12 months...
      {
        month: 'December',
        focusKeywords: ['holiday wedding bali', 'new year wedding', 'christmas wedding'],
        contentSuggestions: [
          'Holiday Season Weddings in Bali',
          'Christmas Wedding Decoration Ideas',
          'New Year Wedding Celebration'
        ],
        seasonalOpportunity: 'Holiday wedding bookings and next year planning'
      }
    ];
  }

  /**
   * Performance benchmarks for wedding industry
   */
  getPerformanceBenchmarks(): {
    seoScores: Record<string, number>;
    conversionRates: Record<string, number>;
    pageLoadTimes: Record<string, number>;
    keywordDifficulty: Record<string, number>;
  } {
    return {
      seoScores: {
        venue_pages: 85, // Target score for venue detail pages
        package_pages: 88, // Package pages should score higher
        real_wedding_pages: 75, // Story pages can be slightly lower
        homepage: 95, // Homepage should be near perfect
        category_pages: 80 // Venue/package listing pages
      },
      conversionRates: {
        venue_detail_to_inquiry: 3.5, // Industry average 2-5%
        package_page_to_contact: 4.2,
        homepage_to_inquiry: 1.8,
        blog_to_contact: 0.8,
        testimonial_to_inquiry: 2.1
      },
      pageLoadTimes: {
        mobile_target: 2.5, // seconds
        desktop_target: 1.8,
        image_gallery_target: 3.0, // Slightly higher for image-heavy pages
        lighthouse_mobile_score: 85,
        lighthouse_desktop_score: 95
      },
      keywordDifficulty: {
        primary_brand_terms: 2, // Easy - 'bali love wedding'
        local_area_terms: 4, // Medium-easy - '[area] wedding'
        service_terms: 6, // Medium - 'bali wedding planner'
        competitive_terms: 8, // Hard - 'bali wedding'
        informational_terms: 3 // Easy-medium - 'bali wedding cost'
      }
    };
  }

  /**
   * Get SEO checklist for content review
   */
  getSEOChecklist(contentType: 'venue' | 'event' | 'package'): Array<{
    item: string;
    required: boolean;
    seoImpact: 'high' | 'medium' | 'low';
  }> {
    const baseChecklist = [
      { item: 'Title under 60 characters with primary keyword', required: true, seoImpact: 'high' as const },
      { item: 'Meta description 120-155 characters', required: true, seoImpact: 'high' as const },
      { item: 'H1 tag includes primary keyword', required: true, seoImpact: 'high' as const },
      { item: 'All images have descriptive alt text', required: true, seoImpact: 'medium' as const },
      { item: 'Content is 300+ words', required: true, seoImpact: 'medium' as const },
      { item: 'Internal links to related content', required: false, seoImpact: 'medium' as const },
      { item: 'Structured data implemented', required: false, seoImpact: 'high' as const }
    ];

    const typeSpecific: Record<string, any[]> = {
      venue: [
        { item: 'Location mentioned in title and content', required: true, seoImpact: 'high' },
        { item: 'Capacity and pricing information included', required: true, seoImpact: 'medium' },
        { item: 'Venue amenities listed with keywords', required: true, seoImpact: 'medium' },
        { item: 'Real wedding examples linked', required: false, seoImpact: 'medium' }
      ],
      event: [
        { item: 'Couple names and venue in title', required: true, seoImpact: 'high' },
        { item: 'Wedding style and guest count mentioned', required: true, seoImpact: 'medium' },
        { item: 'Venue details and area highlighted', required: true, seoImpact: 'high' },
        { item: 'Planning timeline or tips included', required: false, seoImpact: 'low' }
      ],
      package: [
        { item: 'Package type and pricing in title', required: true, seoImpact: 'high' },
        { item: 'Guest count range specified', required: true, seoImpact: 'medium' },
        { item: 'Venue options clearly listed', required: true, seoImpact: 'medium' },
        { item: 'What\'s included section detailed', required: true, seoImpact: 'medium' }
      ]
    };

    return [...baseChecklist, ...(typeSpecific[contentType] || [])];
  }

  /**
   * Competitor analysis framework for wedding industry
   */
  getCompetitorAnalysisFramework(): {
    competitorDomains: string[];
    analysisAreas: string[];
    benchmarkMetrics: string[];
    opportunityIndicators: string[];
  } {
    return {
      competitorDomains: [
        'thebaliweddingcompany.com',
        'baliwedding.com',
        'baliblissweddings.com', 
        'baliweddingorganizer.com',
        'weddingsbali.com',
        'balieventsco.com'
      ],
      analysisAreas: [
        'Keyword rankings for primary terms',
        'Content depth and quality',
        'Local SEO optimization',
        'Structured data implementation',
        'Site performance and UX',
        'Conversion optimization'
      ],
      benchmarkMetrics: [
        'Organic visibility score',
        'Average ranking position',
        'Content freshness',
        'Page load speeds',
        'Mobile optimization score',
        'Local search rankings'
      ],
      opportunityIndicators: [
        'Keyword gaps in competitor content',
        'Underoptimized venue pages',
        'Missing local area coverage',
        'Poor mobile performance',
        'Weak conversion funnels',
        'Limited real wedding content'
      ]
    };
  }

  /**
   * SEO emergency audit checklist
   */
  getEmergencyAuditChecklist(): Array<{
    check: string;
    severity: 'critical' | 'high' | 'medium';
    timeToFix: string;
  }> {
    return [
      { 
        check: 'All pages have unique titles and descriptions',
        severity: 'critical',
        timeToFix: '1-2 days'
      },
      {
        check: 'Site loads under 3 seconds on mobile',
        severity: 'critical', 
        timeToFix: '1 week'
      },
      {
        check: 'No 404 errors in navigation or content',
        severity: 'high',
        timeToFix: '1 day'
      },
      {
        check: 'XML sitemap is current and submitted',
        severity: 'high',
        timeToFix: '2-4 hours'
      },
      {
        check: 'Robots.txt is optimized',
        severity: 'medium',
        timeToFix: '1 hour'
      },
      {
        check: 'All images have alt text',
        severity: 'high',
        timeToFix: '2-3 days'
      },
      {
        check: 'Local business schema is implemented',
        severity: 'high',
        timeToFix: '4-6 hours'
      },
      {
        check: 'Core Web Vitals meet Google standards',
        severity: 'critical',
        timeToFix: '1-2 weeks'
      }
    ];
  }

  /**
   * ROI calculation for SEO improvements
   */
  calculateSEOROI(improvements: {
    trafficIncrease: number; // percentage
    conversionRateImprovement: number; // percentage  
    averageWeddingValue: number; // USD
    currentMonthlyInquiries: number;
    implementationCost: number; // hours * hourly rate
  }): {
    monthlyTrafficIncrease: number;
    monthlyConversionIncrease: number;
    monthlyRevenueIncrease: number;
    annualRevenueIncrease: number;
    roi: number; // return on investment ratio
    paybackPeriod: string; // months to break even
  } {
    
    const monthlyTrafficIncrease = Math.round(
      (improvements.currentMonthlyInquiries * improvements.trafficIncrease) / 100
    );
    
    const monthlyConversionIncrease = Math.round(
      monthlyTrafficIncrease * (improvements.conversionRateImprovement / 100)
    );
    
    const monthlyRevenueIncrease = monthlyConversionIncrease * improvements.averageWeddingValue;
    const annualRevenueIncrease = monthlyRevenueIncrease * 12;
    
    const roi = annualRevenueIncrease / improvements.implementationCost;
    const paybackMonths = Math.ceil(improvements.implementationCost / monthlyRevenueIncrease);

    return {
      monthlyTrafficIncrease,
      monthlyConversionIncrease,
      monthlyRevenueIncrease,
      annualRevenueIncrease,
      roi,
      paybackPeriod: paybackMonths <= 12 ? `${paybackMonths} months` : '12+ months'
    };
  }
}

export const weddingSEOKnowledgeBase = new WeddingSEOKnowledgeBase();