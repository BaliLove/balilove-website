/**
 * Keyword Research System - Bali Wedding SEO Keywords
 * 
 * Comprehensive keyword research and strategy for dominating
 * Bali wedding search results across all intent types
 */

export interface KeywordData {
  keyword: string;
  searchVolume: number; // Estimated monthly searches
  competition: 'low' | 'medium' | 'high';
  difficulty: number; // 1-10 scale
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  category: 'primary' | 'secondary' | 'local' | 'longtail';
  seasonality?: 'peak' | 'off-peak' | 'year-round';
  cpc?: number; // Cost per click for reference
}

export interface KeywordStrategy {
  primary: KeywordData[];
  secondary: KeywordData[];
  local: KeywordData[];
  longtail: KeywordData[];
  contentGaps: KeywordOpportunity[];
  competitorKeywords: string[];
  seasonalTrends: SeasonalKeyword[];
}

export interface KeywordOpportunity {
  keyword: string;
  opportunity: 'high' | 'medium' | 'low';
  reason: string;
  suggestedContent: string;
  estimatedTraffic: number;
}

export interface SeasonalKeyword {
  keyword: string;
  peakMonths: string[];
  strategy: string;
}

export class KeywordResearcher {
  
  // Core Bali wedding keyword database
  private readonly keywordDatabase: Record<string, KeywordData> = {
    // Primary wedding keywords
    'bali wedding': {
      keyword: 'bali wedding',
      searchVolume: 8100,
      competition: 'high',
      difficulty: 8,
      intent: 'commercial',
      category: 'primary',
      seasonality: 'year-round',
      cpc: 2.50
    },
    'bali wedding planner': {
      keyword: 'bali wedding planner',
      searchVolume: 1900,
      competition: 'high',
      difficulty: 7,
      intent: 'commercial',
      category: 'primary',
      seasonality: 'year-round',
      cpc: 3.20
    },
    'wedding venues bali': {
      keyword: 'wedding venues bali',
      searchVolume: 1600,
      competition: 'medium',
      difficulty: 6,
      intent: 'commercial',
      category: 'primary',
      seasonality: 'year-round',
      cpc: 2.80
    },
    'destination wedding bali': {
      keyword: 'destination wedding bali',
      searchVolume: 1300,
      competition: 'medium',
      difficulty: 6,
      intent: 'commercial',
      category: 'primary',
      seasonality: 'year-round',
      cpc: 3.50
    },
    'bali wedding packages': {
      keyword: 'bali wedding packages',
      searchVolume: 720,
      competition: 'medium',
      difficulty: 5,
      intent: 'commercial',
      category: 'secondary',
      seasonality: 'year-round',
      cpc: 2.90
    },

    // Local area keywords
    'uluwatu wedding': {
      keyword: 'uluwatu wedding',
      searchVolume: 590,
      competition: 'low',
      difficulty: 4,
      intent: 'commercial',
      category: 'local',
      seasonality: 'peak',
      cpc: 2.10
    },
    'seminyak wedding': {
      keyword: 'seminyak wedding', 
      searchVolume: 480,
      competition: 'low',
      difficulty: 4,
      intent: 'commercial',
      category: 'local',
      seasonality: 'year-round',
      cpc: 2.40
    },
    'ubud wedding': {
      keyword: 'ubud wedding',
      searchVolume: 390,
      competition: 'low',
      difficulty: 3,
      intent: 'commercial',
      category: 'local',
      seasonality: 'year-round',
      cpc: 1.90
    },
    'canggu wedding': {
      keyword: 'canggu wedding',
      searchVolume: 260,
      competition: 'low',
      difficulty: 3,
      intent: 'commercial',
      category: 'local',
      seasonality: 'peak',
      cpc: 1.80
    },

    // Wedding type keywords
    'beach wedding bali': {
      keyword: 'beach wedding bali',
      searchVolume: 1200,
      competition: 'medium',
      difficulty: 5,
      intent: 'commercial', 
      category: 'secondary',
      seasonality: 'peak',
      cpc: 2.60
    },
    'villa wedding bali': {
      keyword: 'villa wedding bali',
      searchVolume: 880,
      competition: 'medium',
      difficulty: 5,
      intent: 'commercial',
      category: 'secondary',
      seasonality: 'year-round',
      cpc: 3.10
    },
    'clifftop wedding bali': {
      keyword: 'clifftop wedding bali',
      searchVolume: 320,
      competition: 'low',
      difficulty: 3,
      intent: 'commercial',
      category: 'secondary',
      seasonality: 'peak',
      cpc: 2.20
    },

    // Long-tail informational
    'bali wedding cost': {
      keyword: 'bali wedding cost',
      searchVolume: 1600,
      competition: 'medium',
      difficulty: 4,
      intent: 'informational',
      category: 'longtail',
      seasonality: 'year-round',
      cpc: 1.50
    },
    'best time to get married in bali': {
      keyword: 'best time to get married in bali',
      searchVolume: 390,
      competition: 'low',
      difficulty: 2,
      intent: 'informational',
      category: 'longtail',
      seasonality: 'year-round',
      cpc: 0.80
    },
    'bali wedding requirements': {
      keyword: 'bali wedding requirements',
      searchVolume: 480,
      competition: 'low',
      difficulty: 3,
      intent: 'informational',
      category: 'longtail',
      seasonality: 'year-round',
      cpc: 1.20
    },

    // Competitor and service keywords
    'bali wedding photographer': {
      keyword: 'bali wedding photographer',
      searchVolume: 1100,
      competition: 'high',
      difficulty: 7,
      intent: 'commercial',
      category: 'secondary',
      seasonality: 'year-round',
      cpc: 4.20
    },
    'bali wedding decoration': {
      keyword: 'bali wedding decoration',
      searchVolume: 650,
      competition: 'medium',
      difficulty: 5,
      intent: 'commercial',
      category: 'secondary',
      seasonality: 'year-round',
      cpc: 2.70
    }
  };

  /**
   * Get comprehensive keyword strategy for page type
   */
  getKeywordStrategy(pageType: 'venue' | 'event' | 'package' | 'general', entityData?: any): KeywordStrategy {
    const allKeywords = Object.values(this.keywordDatabase);
    
    const primary = allKeywords.filter(k => k.category === 'primary');
    const secondary = allKeywords.filter(k => k.category === 'secondary'); 
    const local = allKeywords.filter(k => k.category === 'local');
    const longtail = allKeywords.filter(k => k.category === 'longtail');

    // Generate content-specific keywords
    const contentGaps = this.identifyContentGaps(pageType, entityData);
    const competitorKeywords = this.getCompetitorKeywords();
    const seasonalTrends = this.getSeasonalTrends();

    return {
      primary,
      secondary,
      local,
      longtail,
      contentGaps,
      competitorKeywords,
      seasonalTrends
    };
  }

  /**
   * Generate venue-specific keyword opportunities
   */
  generateVenueKeywords(venue: {
    name: string;
    area: string;
    venueType: string[];
    capacity?: number;
    amenities?: string[];
  }): KeywordData[] {
    const keywords: KeywordData[] = [];
    const venueName = venue.name.toLowerCase();
    const area = venue.area.toLowerCase();
    const mainType = venue.venueType[0]?.replace('-', ' ') || 'wedding venue';

    // Venue-specific branded keywords
    keywords.push({
      keyword: `${venueName} wedding`,
      searchVolume: this.estimateVenueSearchVolume(venue.name),
      competition: 'low',
      difficulty: 2,
      intent: 'commercial',
      category: 'longtail'
    });

    keywords.push({
      keyword: `${venueName} bali`,
      searchVolume: Math.floor(this.estimateVenueSearchVolume(venue.name) * 0.7),
      competition: 'low',
      difficulty: 2,
      intent: 'commercial',
      category: 'longtail'
    });

    // Area + venue type combinations
    keywords.push({
      keyword: `${area} ${mainType} wedding`,
      searchVolume: this.estimateAreaTypeSearchVolume(area, mainType),
      competition: 'low',
      difficulty: 3,
      intent: 'commercial',
      category: 'local'
    });

    keywords.push({
      keyword: `luxury ${mainType} ${area}`,
      searchVolume: Math.floor(this.estimateAreaTypeSearchVolume(area, mainType) * 0.5),
      competition: 'low',
      difficulty: 3,
      intent: 'commercial',
      category: 'local'
    });

    // Capacity-based keywords
    if (venue.capacity) {
      const capacityRange = this.getCapacityRange(venue.capacity);
      keywords.push({
        keyword: `${capacityRange} wedding bali`,
        searchVolume: this.estimateCapacitySearchVolume(capacityRange),
        competition: 'low',
        difficulty: 3,
        intent: 'commercial',
        category: 'longtail'
      });
    }

    // Amenity-based keywords
    venue.amenities?.forEach(amenity => {
      const cleanAmenity = amenity.replace('-', ' ');
      keywords.push({
        keyword: `${cleanAmenity} wedding venue bali`,
        searchVolume: this.estimateAmenitySearchVolume(cleanAmenity),
        competition: 'low',
        difficulty: 2,
        intent: 'commercial',
        category: 'longtail'
      });
    });

    return keywords;
  }

  /**
   * Generate event/wedding story keywords
   */
  generateEventKeywords(event: {
    brideName?: string;
    groomName?: string;
    venue?: { name: string; area: string };
    weddingDate?: string;
    weddingStyle?: string[];
    guestCount?: number;
  }): KeywordData[] {
    const keywords: KeywordData[] = [];
    
    if (event.brideName && event.groomName && event.venue) {
      const coupleNames = `${event.brideName} ${event.groomName}`.toLowerCase();
      const venueName = event.venue.name.toLowerCase();
      const area = event.venue.area.toLowerCase();
      const year = event.weddingDate ? new Date(event.weddingDate).getFullYear() : '';

      // Specific wedding story keywords
      keywords.push({
        keyword: `${coupleNames} wedding ${venueName}`,
        searchVolume: 50,
        competition: 'low',
        difficulty: 1,
        intent: 'informational',
        category: 'longtail'
      });

      if (year) {
        keywords.push({
          keyword: `${coupleNames} ${year} wedding bali`,
          searchVolume: 30,
          competition: 'low', 
          difficulty: 1,
          intent: 'informational',
          category: 'longtail'
        });
      }

      // Venue + area combination
      keywords.push({
        keyword: `${venueName} ${area} wedding`,
        searchVolume: 120,
        competition: 'low',
        difficulty: 2,
        intent: 'commercial',
        category: 'longtail'
      });
    }

    // Style-based keywords
    event.weddingStyle?.forEach(style => {
      keywords.push({
        keyword: `${style.replace('-', ' ')} wedding bali`,
        searchVolume: this.estimateStyleSearchVolume(style),
        competition: 'low',
        difficulty: 3,
        intent: 'commercial',
        category: 'secondary'
      });
    });

    return keywords;
  }

  /**
   * Get seasonal keyword opportunities
   */
  getSeasonalOpportunities(): SeasonalKeyword[] {
    return [
      {
        keyword: 'dry season wedding bali',
        peakMonths: ['April', 'May', 'June', 'July', 'August', 'September'],
        strategy: 'Target peak wedding season planning searches'
      },
      {
        keyword: 'rainy season wedding bali',
        peakMonths: ['October', 'November', 'December', 'January', 'February', 'March'],
        strategy: 'Position indoor venues and covered ceremony options'
      },
      {
        keyword: 'june wedding bali',
        peakMonths: ['February', 'March', 'April', 'May'],
        strategy: 'Target couples planning for peak season'
      },
      {
        keyword: 'december wedding bali',
        peakMonths: ['September', 'October', 'November'],
        strategy: 'Holiday season weddings and year-end celebrations'
      }
    ];
  }

  /**
   * Analyze keyword opportunities for existing content
   */
  analyzeKeywordOpportunities(content: {
    title?: string;
    description?: string;
    text: string;
    pageType: string;
    entityData?: any;
  }): KeywordOpportunity[] {
    const opportunities: KeywordOpportunity[] = [];
    const currentText = `${content.title || ''} ${content.description || ''} ${content.text}`.toLowerCase();

    // Check for missing high-value keywords
    Object.values(this.keywordDatabase).forEach(keywordData => {
      const isPresent = currentText.includes(keywordData.keyword.toLowerCase());
      
      if (!isPresent && this.isRelevantForContent(keywordData, content)) {
        const opportunity = this.assessKeywordOpportunity(keywordData, content);
        if (opportunity) {
          opportunities.push(opportunity);
        }
      }
    });

    // Generate dynamic keyword opportunities based on entity data
    if (content.entityData && content.pageType === 'venue') {
      const dynamicKeywords = this.generateVenueKeywords(content.entityData);
      dynamicKeywords.forEach(keyword => {
        if (!currentText.includes(keyword.keyword.toLowerCase())) {
          opportunities.push({
            keyword: keyword.keyword,
            opportunity: 'high',
            reason: 'Venue-specific keyword with low competition',
            suggestedContent: `Add section about ${keyword.keyword} highlighting unique venue features`,
            estimatedTraffic: keyword.searchVolume
          });
        }
      });
    }

    return opportunities.sort((a, b) => b.estimatedTraffic - a.estimatedTraffic).slice(0, 10);
  }

  /**
   * Get keyword suggestions for content creation
   */
  getContentKeywordSuggestions(contentType: 'blog' | 'venue' | 'package' | 'guide'): string[] {
    const suggestions: string[] = [];

    switch (contentType) {
      case 'blog':
        suggestions.push(
          'bali wedding planning guide',
          'best bali wedding venues 2024',
          'bali wedding cost breakdown',
          'destination wedding bali tips',
          'bali wedding legal requirements',
          'wedding season bali weather',
          'bali honeymoon after wedding'
        );
        break;

      case 'venue':
        suggestions.push(
          '[venue] wedding reviews',
          '[venue] ceremony options',
          '[venue] reception capacity',
          '[venue] accommodation nearby',
          '[venue] transportation access',
          '[venue] photo locations',
          '[venue] catering options'
        );
        break;

      case 'package':
        suggestions.push(
          'all inclusive bali wedding',
          'small wedding package bali',
          'luxury wedding package bali',
          'budget wedding package bali',
          'elopement package bali',
          'custom wedding package bali'
        );
        break;

      case 'guide':
        suggestions.push(
          'bali wedding timeline planning',
          'bali wedding vendor directory',
          'bali wedding photography styles',
          'bali wedding decoration ideas',
          'bali wedding flower options',
          'bali wedding music traditions'
        );
        break;
    }

    return suggestions;
  }

  /**
   * Get competitor keyword analysis
   */
  private getCompetitorKeywords(): string[] {
    // Keywords competitors are ranking for that we should target
    return [
      'bali wedding organizer',
      'bali event planner',
      'bali destination wedding cost',
      'bali wedding venues prices',
      'luxury bali wedding',
      'intimate bali wedding',
      'traditional balinese wedding',
      'bali beach ceremony',
      'bali wedding photography package',
      'bali wedding decoration services'
    ];
  }

  /**
   * Identify content gaps based on keyword analysis
   */
  private identifyContentGaps(pageType: string, entityData?: any): KeywordOpportunity[] {
    const gaps: KeywordOpportunity[] = [];

    // Universal gaps for wedding website
    gaps.push(
      {
        keyword: 'bali wedding planning timeline',
        opportunity: 'high',
        reason: 'High-intent informational keyword with commercial potential',
        suggestedContent: 'Comprehensive wedding planning timeline guide for Bali weddings',
        estimatedTraffic: 780
      },
      {
        keyword: 'bali wedding vendor directory', 
        opportunity: 'high',
        reason: 'Establishes authority and captures service searches',
        suggestedContent: 'Complete directory of trusted Bali wedding vendors',
        estimatedTraffic: 560
      },
      {
        keyword: 'bali wedding legal requirements',
        opportunity: 'medium',
        reason: 'Essential information that builds trust and authority',
        suggestedContent: 'Guide to legal requirements for getting married in Bali',
        estimatedTraffic: 420
      }
    );

    // Page type specific gaps
    if (pageType === 'venue') {
      gaps.push({
        keyword: `${entityData?.area || '[area]'} wedding venues comparison`,
        opportunity: 'medium',
        reason: 'Comparison content drives decision-making traffic',
        suggestedContent: 'Detailed comparison of venues in the same area',
        estimatedTraffic: 340
      });
    }

    return gaps;
  }

  /**
   * Get seasonal trending keywords
   */
  private getSeasonalTrends(): SeasonalKeyword[] {
    return [
      {
        keyword: 'bali wedding dry season',
        peakMonths: ['December', 'January', 'February'],
        strategy: 'Content about best weather months for ceremonies'
      },
      {
        keyword: 'bali wedding rain season backup',
        peakMonths: ['September', 'October', 'November'],
        strategy: 'Indoor venue options and weather contingency planning'
      },
      {
        keyword: 'new year wedding bali',
        peakMonths: ['October', 'November', 'December'],
        strategy: 'Holiday season wedding positioning'
      },
      {
        keyword: 'valentine wedding bali',
        peakMonths: ['December', 'January'],
        strategy: 'Romantic February wedding positioning'
      }
    ];
  }

  /**
   * Utility methods for keyword analysis
   */
  private isRelevantForContent(keywordData: KeywordData, content: any): boolean {
    // Check if keyword is relevant for the specific content type
    if (content.pageType === 'venue') {
      return keywordData.category === 'local' || 
             keywordData.category === 'primary' ||
             (keywordData.category === 'secondary' && keywordData.intent === 'commercial');
    }
    
    if (content.pageType === 'event') {
      return keywordData.intent === 'informational' || 
             keywordData.category === 'longtail';
    }

    return true;
  }

  private assessKeywordOpportunity(keywordData: KeywordData, content: any): KeywordOpportunity | null {
    // Only suggest high-impact, relevant keywords
    if (keywordData.searchVolume < 100 && keywordData.difficulty > 5) {
      return null; // Low volume, high difficulty = skip
    }

    return {
      keyword: keywordData.keyword,
      opportunity: keywordData.competition === 'low' ? 'high' : 'medium',
      reason: `${keywordData.searchVolume} monthly searches, ${keywordData.competition} competition`,
      suggestedContent: this.getSuggestedContentForKeyword(keywordData, content),
      estimatedTraffic: Math.floor(keywordData.searchVolume * 0.1) // 10% capture estimate
    };
  }

  private getSuggestedContentForKeyword(keywordData: KeywordData, content: any): string {
    if (keywordData.intent === 'informational') {
      return `Create informational section about ${keywordData.keyword}`;
    }
    
    if (keywordData.intent === 'commercial') {
      return `Include ${keywordData.keyword} in headings and service descriptions`;
    }

    return `Naturally incorporate "${keywordData.keyword}" in content`;
  }

  private estimateVenueSearchVolume(venueName: string): number {
    // Estimate based on venue popularity indicators
    const baseVolume = 80;
    const nameLength = venueName.length;
    
    // Shorter, more memorable names tend to have higher search volume
    if (nameLength <= 10) return baseVolume + 40;
    if (nameLength <= 15) return baseVolume + 20;
    return baseVolume;
  }

  private estimateAreaTypeSearchVolume(area: string, venueType: string): number {
    const areaMultipliers: Record<string, number> = {
      'uluwatu': 1.4,
      'seminyak': 1.2,
      'ubud': 1.1,
      'canggu': 0.9,
      'sanur': 0.7,
      'jimbaran': 0.8,
      'nusa-dua': 0.6
    };

    const typeMultipliers: Record<string, number> = {
      'villa': 1.3,
      'beach club': 1.1,
      'clifftop': 0.9,
      'resort': 1.0,
      'garden': 0.7
    };

    const baseVolume = 200;
    const areaMultiplier = areaMultipliers[area] || 1.0;
    const typeMultiplier = typeMultipliers[venueType] || 1.0;

    return Math.floor(baseVolume * areaMultiplier * typeMultiplier);
  }

  private estimateCapacitySearchVolume(capacityRange: string): number {
    const volumeMap: Record<string, number> = {
      'intimate': 340,
      'small': 280,
      'medium': 180,
      'large': 150,
      'grand': 120
    };

    return volumeMap[capacityRange] || 100;
  }

  private estimateAmenitySearchVolume(amenity: string): number {
    const amenityVolumes: Record<string, number> = {
      'ocean view': 180,
      'sunset view': 150,
      'beach access': 140,
      'pool': 120,
      'garden': 100,
      'bridal suite': 80,
      'air conditioning': 60
    };

    return amenityVolumes[amenity] || 50;
  }

  private estimateStyleSearchVolume(style: string): number {
    const styleVolumes: Record<string, number> = {
      'beach-chic': 290,
      'bohemian': 250,
      'classic-elegance': 180,
      'tropical-paradise': 160,
      'luxury-glamour': 140,
      'minimalist-modern': 120,
      'romantic-garden': 100,
      'cultural-fusion': 80
    };

    return styleVolumes[style] || 60;
  }

  private getCapacityRange(capacity: number): string {
    if (capacity <= 20) return 'intimate';
    if (capacity <= 50) return 'small';
    if (capacity <= 100) return 'medium';
    if (capacity <= 200) return 'large';
    return 'grand';
  }

  /**
   * Generate keyword tracking list for PostHog
   */
  getKeywordsToTrack(): { keyword: string; priority: 'high' | 'medium' | 'low' }[] {
    const trackingKeywords: { keyword: string; priority: 'high' | 'medium' | 'low' }[] = [];

    // High priority - primary business keywords
    ['bali wedding', 'bali wedding planner', 'wedding venues bali', 'destination wedding bali'].forEach(keyword => {
      trackingKeywords.push({ keyword, priority: 'high' });
    });

    // Medium priority - local and service keywords
    ['uluwatu wedding', 'seminyak wedding', 'villa wedding bali', 'beach wedding bali'].forEach(keyword => {
      trackingKeywords.push({ keyword, priority: 'medium' });
    });

    // Low priority - long-tail and informational
    ['bali wedding cost', 'bali wedding requirements', 'best time to get married in bali'].forEach(keyword => {
      trackingKeywords.push({ keyword, priority: 'low' });
    });

    return trackingKeywords;
  }

  /**
   * Get keyword recommendations for specific Sanity entity
   */
  getEntityKeywordRecommendations(entityType: 'venue' | 'realEvent' | 'weddingPackage' | 'teamMember', data: any): string[] {
    switch (entityType) {
      case 'venue':
        return [
          `${data.name} wedding bali`,
          `${data.area} ${data.venueType?.[0]?.replace('-', ' ') || 'venue'} wedding`,
          `luxury wedding venue ${data.area}`,
          data.capacity?.seated ? `${this.getCapacityRange(data.capacity.seated)} wedding venue bali` : 'wedding venue bali'
        ].filter(Boolean);

      case 'realEvent':
        return [
          `${data.venue?.name} real wedding`,
          `${data.venue?.area} wedding story`,
          `${data.weddingStyle?.[0]?.replace('-', ' ') || ''} wedding bali`,
          data.weddingDate ? `${new Date(data.weddingDate).getFullYear()} bali wedding` : ''
        ].filter(Boolean);

      case 'weddingPackage':
        return [
          `${data.packageType} wedding package bali`,
          `bali wedding package ${data.pricing?.basePrice ? `$${data.pricing.basePrice}` : ''}`,
          'all inclusive bali wedding',
          data.guestCount?.max ? `${this.getCapacityRange(data.guestCount.max)} wedding package bali` : ''
        ].filter(Boolean);

      case 'teamMember':
        return [
          `bali wedding planner ${data.jobRole?.toLowerCase() || ''}`,
          `experienced wedding coordinator bali`,
          data.expertise?.[0] ? `${data.expertise[0].replace('-', ' ')} bali` : '',
          data.languages?.includes('english') ? 'english speaking wedding planner bali' : ''
        ].filter(Boolean);

      default:
        return [];
    }
  }
}

export const keywordResearcher = new KeywordResearcher();