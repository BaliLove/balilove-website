/**
 * SEO Expert Agent - Autonomous SEO optimization system for Bali Love
 * 
 * This agent analyzes content, provides recommendations, and optimizes
 * wedding-related content for maximum search visibility
 */

interface SEOAnalysis {
  score: number;
  issues: SEOIssue[];
  recommendations: SEORecommendation[];
  keywords: KeywordAnalysis;
  metadata: MetadataAnalysis;
  content: ContentAnalysis;
  technical: TechnicalAnalysis;
}

interface SEOIssue {
  type: 'critical' | 'warning' | 'suggestion';
  category: 'metadata' | 'content' | 'technical' | 'keywords' | 'local';
  message: string;
  fix: string;
  impact: 'high' | 'medium' | 'low';
}

interface SEORecommendation {
  title: string;
  description: string;
  implementation: string;
  priority: 'high' | 'medium' | 'low';
  estimatedImpact: number; // 1-10 scale
  category: 'content' | 'technical' | 'local' | 'keywords';
}

interface KeywordAnalysis {
  primary: string[];
  secondary: string[];
  local: string[];
  longtail: string[];
  density: { [key: string]: number };
  opportunities: string[];
}

interface MetadataAnalysis {
  title: {
    content: string;
    length: number;
    optimal: boolean;
    suggestions: string[];
  };
  description: {
    content: string;
    length: number;
    optimal: boolean;
    suggestions: string[];
  };
  missing: string[];
}

interface ContentAnalysis {
  wordCount: number;
  headingStructure: HeadingAnalysis[];
  imageOptimization: ImageAnalysis;
  readability: ReadabilityScore;
  keywordUsage: KeywordUsage;
}

interface TechnicalAnalysis {
  pageSpeed: number;
  mobileOptimized: boolean;
  structuredData: boolean;
  internalLinks: number;
  externalLinks: number;
}

interface HeadingAnalysis {
  level: number;
  text: string;
  keywordOptimized: boolean;
  suggestions: string[];
}

interface ImageAnalysis {
  total: number;
  withAlt: number;
  optimized: number;
  issues: string[];
}

interface ReadabilityScore {
  score: number;
  level: string;
  suggestions: string[];
}

interface KeywordUsage {
  primary: { keyword: string; count: number; density: number }[];
  missing: string[];
  overuse: string[];
}

export class SEOAgent {
  private readonly weddingKeywords = [
    'bali wedding', 'bali wedding planner', 'wedding venues bali',
    'destination wedding bali', 'bali wedding packages', 'luxury wedding bali',
    'beach wedding bali', 'villa wedding bali', 'clifftop wedding bali',
    'intimate wedding bali', 'elopement bali', 'traditional balinese wedding'
  ];

  private readonly localKeywords = [
    'uluwatu wedding', 'seminyak wedding', 'ubud wedding', 'canggu wedding',
    'sanur wedding', 'jimbaran wedding', 'nusa dua wedding', 'tabanan wedding'
  ];

  /**
   * Analyze a page for SEO optimization opportunities
   */
  async analyzePage(content: {
    title?: string;
    description?: string;
    content: string;
    images: { alt?: string; src: string }[];
    url: string;
    type: 'venue' | 'event' | 'package' | 'page';
    entityData?: any;
  }): Promise<SEOAnalysis> {
    
    const keywords = this.analyzeKeywords(content);
    const metadata = this.analyzeMetadata(content);
    const contentAnalysis = this.analyzeContent(content);
    const technical = this.analyzeTechnical(content);
    
    const issues = this.identifyIssues(metadata, contentAnalysis, technical, keywords);
    const recommendations = this.generateRecommendations(issues, content);
    
    const score = this.calculateSEOScore(metadata, contentAnalysis, technical, keywords);

    return {
      score,
      issues,
      recommendations,
      keywords,
      metadata,
      content: contentAnalysis,
      technical
    };
  }

  /**
   * Generate optimized metadata for wedding content
   */
  generateOptimizedMetadata(content: {
    type: 'venue' | 'event' | 'package' | 'team' | 'testimonial';
    data: any;
  }): { title: string; description: string } {
    
    switch (content.type) {
      case 'venue':
        return this.generateVenueMetadata(content.data);
      case 'event':
        return this.generateEventMetadata(content.data);
      case 'package':
        return this.generatePackageMetadata(content.data);
      case 'team':
        return this.generateTeamMetadata(content.data);
      case 'testimonial':
        return this.generateTestimonialMetadata(content.data);
      default:
        return { title: '', description: '' };
    }
  }

  /**
   * Generate venue-specific SEO metadata
   */
  private generateVenueMetadata(venue: any): { title: string; description: string } {
    const name = venue.name || '';
    const area = venue.area || '';
    const capacity = venue.capacity?.seated || '';
    const venueType = venue.venueType?.[0] || 'wedding venue';
    const pricing = venue.priceRange?.min ? `from $${venue.priceRange.min.toLocaleString()}` : '';

    // Optimize for local + venue specific searches
    const title = `${name} - ${this.capitalizeWords(area)} ${this.capitalizeWords(venueType.replace('-', ' '))} | Bali Wedding Venues`;
    
    const description = `${name} in ${this.capitalizeWords(area)}, Bali. ${capacity ? `Seats up to ${capacity} guests.` : ''} ${pricing} Luxury wedding venue with professional planning services. Book your dream Bali destination wedding.`.trim();

    return {
      title: this.truncateText(title, 60),
      description: this.truncateText(description, 155)
    };
  }

  /**
   * Generate real wedding event SEO metadata  
   */
  private generateEventMetadata(event: any): { title: string; description: string } {
    const brideName = event.brideName || '';
    const groomName = event.groomName || '';
    const venueName = event.venue?.name || '';
    const area = event.venue?.area || '';
    const year = event.weddingDate ? new Date(event.weddingDate).getFullYear() : '';

    const coupleNames = brideName && groomName ? `${brideName} & ${groomName}` : event.title;
    
    const title = `${coupleNames} ${year ? year + ' ' : ''}Wedding at ${venueName} | Real Bali Wedding Story`;
    
    const description = `${coupleNames}${year ? `'s ${year}` : ''} wedding at ${venueName}${area ? ` in ${this.capitalizeWords(area)}` : ''}, Bali. ${event.guestCount ? `${event.guestCount} guests celebrated` : 'A beautiful celebration'} with Bali Love wedding planning. See photos and read their story.`;

    return {
      title: this.truncateText(title, 60),
      description: this.truncateText(description, 155)
    };
  }

  /**
   * Generate package SEO metadata
   */
  private generatePackageMetadata(pkg: any): { title: string; description: string } {
    const name = pkg.name || '';
    const packageType = pkg.packageType || '';
    const basePrice = pkg.pricing?.basePrice || '';
    const guestCount = pkg.guestCount;

    const guestRange = guestCount?.min && guestCount?.max ? 
      `${guestCount.min}-${guestCount.max} guests` : 
      guestCount?.max ? `up to ${guestCount.max} guests` : '';

    const title = `${name} - Bali Wedding Package ${basePrice ? `from $${basePrice.toLocaleString()}` : ''} | Bali Love`;
    
    const description = `${name} wedding package for Bali destination weddings. ${guestRange ? `Perfect for ${guestRange}.` : ''} ${basePrice ? `Starting from $${basePrice.toLocaleString()}.` : ''} Includes venue, planning, and coordination. Book your dream Bali wedding.`;

    return {
      title: this.truncateText(title, 60),
      description: this.truncateText(description, 155)
    };
  }

  /**
   * Generate team member SEO metadata
   */
  private generateTeamMetadata(member: any): { title: string; description: string } {
    const name = member.name || '';
    const role = member.jobRole || 'Wedding Planner';
    const experience = member.experience || '';
    const specialties = member.expertise?.slice(0, 3).join(', ') || '';

    const title = `${name} - ${role} | Bali Love Wedding Planning Team`;
    
    const description = `Meet ${name}, ${role} at Bali Love. ${experience ? `${experience} years experience` : 'Expert'} in ${specialties || 'Bali wedding planning'}. Professional wedding coordination for your dream Bali destination wedding.`;

    return {
      title: this.truncateText(title, 60),
      description: this.truncateText(description, 155)
    };
  }

  /**
   * Generate testimonial SEO metadata
   */
  private generateTestimonialMetadata(testimonial: any): { title: string; description: string } {
    const coupleName = testimonial.coupleName || '';
    const venueName = testimonial.weddingDetails?.venue?.name || '';
    const rating = testimonial.rating || 5;
    const year = testimonial.weddingDetails?.weddingDate ? 
      new Date(testimonial.weddingDetails.weddingDate).getFullYear() : '';

    const title = `${coupleName} ${year ? year + ' ' : ''}Wedding Review | ${rating}/5 Stars | Bali Love`;
    
    const description = `${rating}/5 stars: "${this.truncateText(testimonial.testimonialText || '', 80)}" ${coupleName}${venueName ? ` wedding at ${venueName}` : ''}, Bali. Read real reviews of Bali Love wedding planning services.`;

    return {
      title: this.truncateText(title, 60),
      description: this.truncateText(description, 155)
    };
  }

  /**
   * Analyze keyword optimization opportunities
   */
  private analyzeKeywords(content: any): KeywordAnalysis {
    const text = `${content.title || ''} ${content.description || ''} ${content.content || ''}`.toLowerCase();
    
    const primary: string[] = [];
    const secondary: string[] = [];
    const local: string[] = [];
    const longtail: string[] = [];
    const density: { [key: string]: number } = {};
    const opportunities: string[] = [];

    // Analyze primary wedding keywords
    this.weddingKeywords.forEach(keyword => {
      const count = this.countKeywordOccurrences(text, keyword);
      const wordCount = text.split(' ').length;
      const keywordDensity = (count / wordCount) * 100;
      
      density[keyword] = keywordDensity;
      
      if (count > 0) {
        if (keywordDensity >= 0.5) primary.push(keyword);
        else secondary.push(keyword);
      } else {
        opportunities.push(keyword);
      }
    });

    // Analyze local Bali area keywords
    this.localKeywords.forEach(keyword => {
      const count = this.countKeywordOccurrences(text, keyword);
      if (count > 0) {
        local.push(keyword);
      } else if (content.type === 'venue' && content.entityData?.area) {
        // Suggest area-specific keywords for venues
        const areaKeyword = `${content.entityData.area} wedding`;
        if (keyword.includes(content.entityData.area)) {
          opportunities.push(keyword);
        }
      }
    });

    // Generate long-tail opportunities based on content type
    if (content.type === 'venue' && content.entityData) {
      const venue = content.entityData;
      const venueType = venue.venueType?.[0] || '';
      const area = venue.area || '';
      
      longtail.push(
        `${venue.name.toLowerCase()} bali wedding`,
        `${area} ${venueType.replace('-', ' ')} wedding bali`,
        `luxury ${venueType.replace('-', ' ')} wedding ${area}`,
        `bali destination wedding ${area}`
      );
    }

    return {
      primary,
      secondary, 
      local,
      longtail,
      density,
      opportunities
    };
  }

  /**
   * Analyze metadata optimization
   */
  private analyzeMetadata(content: any): MetadataAnalysis {
    const title = content.title || '';
    const description = content.description || '';
    
    return {
      title: {
        content: title,
        length: title.length,
        optimal: title.length >= 30 && title.length <= 60,
        suggestions: this.getTitleSuggestions(title, content)
      },
      description: {
        content: description,
        length: description.length,
        optimal: description.length >= 120 && description.length <= 155,
        suggestions: this.getDescriptionSuggestions(description, content)
      },
      missing: this.getMissingMetadata(content)
    };
  }

  /**
   * Analyze content quality and structure
   */
  private analyzeContent(content: any): ContentAnalysis {
    const text = content.content || '';
    const wordCount = text.split(' ').length;
    
    return {
      wordCount,
      headingStructure: this.analyzeHeadings(text),
      imageOptimization: this.analyzeImages(content.images || []),
      readability: this.calculateReadability(text),
      keywordUsage: this.analyzeKeywordUsage(text)
    };
  }

  /**
   * Analyze technical SEO factors
   */
  private analyzeTechnical(content: any): TechnicalAnalysis {
    return {
      pageSpeed: 85, // Would integrate with real performance API
      mobileOptimized: true, // Based on responsive design
      structuredData: false, // Check if schema markup exists
      internalLinks: this.countInternalLinks(content.content || ''),
      externalLinks: this.countExternalLinks(content.content || '')
    };
  }

  /**
   * Calculate overall SEO score (0-100)
   */
  private calculateSEOScore(
    metadata: MetadataAnalysis,
    content: ContentAnalysis,
    technical: TechnicalAnalysis,
    keywords: KeywordAnalysis
  ): number {
    let score = 0;
    
    // Metadata scoring (30 points)
    if (metadata.title.optimal) score += 15;
    else if (metadata.title.length > 0) score += 8;
    
    if (metadata.description.optimal) score += 15;
    else if (metadata.description.length > 0) score += 8;

    // Content scoring (30 points)  
    if (content.wordCount >= 300) score += 10;
    else if (content.wordCount >= 150) score += 6;
    
    if (content.imageOptimization.withAlt === content.imageOptimization.total) score += 10;
    else score += (content.imageOptimization.withAlt / content.imageOptimization.total) * 10;
    
    if (content.readability.score >= 70) score += 10;
    else score += (content.readability.score / 70) * 10;

    // Technical scoring (25 points)
    score += (technical.pageSpeed / 100) * 10;
    if (technical.mobileOptimized) score += 5;
    if (technical.structuredData) score += 10;

    // Keyword scoring (15 points)
    if (keywords.primary.length >= 2) score += 10;
    else score += keywords.primary.length * 5;
    
    if (keywords.local.length > 0) score += 5;

    return Math.round(score);
  }

  /**
   * Identify specific SEO issues
   */
  private identifyIssues(
    metadata: MetadataAnalysis,
    content: ContentAnalysis,
    technical: TechnicalAnalysis,
    keywords: KeywordAnalysis
  ): SEOIssue[] {
    const issues: SEOIssue[] = [];

    // Metadata issues
    if (!metadata.title.optimal) {
      issues.push({
        type: metadata.title.length === 0 ? 'critical' : 'warning',
        category: 'metadata',
        message: metadata.title.length === 0 ? 'Missing page title' : 
                metadata.title.length > 60 ? 'Title too long' : 'Title too short',
        fix: metadata.title.suggestions[0] || 'Optimize title length to 30-60 characters',
        impact: 'high'
      });
    }

    if (!metadata.description.optimal) {
      issues.push({
        type: metadata.description.length === 0 ? 'critical' : 'warning', 
        category: 'metadata',
        message: metadata.description.length === 0 ? 'Missing meta description' :
                metadata.description.length > 155 ? 'Description too long' : 'Description too short',
        fix: metadata.description.suggestions[0] || 'Optimize description to 120-155 characters',
        impact: 'high'
      });
    }

    // Content issues
    if (content.wordCount < 150) {
      issues.push({
        type: 'warning',
        category: 'content',
        message: 'Content too short for good SEO',
        fix: 'Add more detailed content (aim for 300+ words)',
        impact: 'medium'
      });
    }

    if (content.imageOptimization.withAlt < content.imageOptimization.total) {
      issues.push({
        type: 'warning',
        category: 'content', 
        message: `${content.imageOptimization.total - content.imageOptimization.withAlt} images missing alt text`,
        fix: 'Add descriptive alt text to all images',
        impact: 'medium'
      });
    }

    // Keyword issues
    if (keywords.primary.length === 0) {
      issues.push({
        type: 'critical',
        category: 'keywords',
        message: 'No primary keywords found',
        fix: 'Include target keywords naturally in title and content',
        impact: 'high'
      });
    }

    if (keywords.local.length === 0) {
      issues.push({
        type: 'suggestion',
        category: 'local',
        message: 'Missing local Bali keywords',
        fix: 'Include location-specific terms for local SEO',
        impact: 'medium'
      });
    }

    // Technical issues
    if (!technical.structuredData) {
      issues.push({
        type: 'warning',
        category: 'technical',
        message: 'Missing structured data',
        fix: 'Add schema.org markup for better search understanding',
        impact: 'medium'
      });
    }

    return issues;
  }

  /**
   * Generate actionable SEO recommendations
   */
  private generateRecommendations(issues: SEOIssue[], content: any): SEORecommendation[] {
    const recommendations: SEORecommendation[] = [];

    // High-impact recommendations based on content type
    if (content.type === 'venue') {
      recommendations.push({
        title: 'Optimize for Local Wedding Searches',
        description: 'Target location + wedding type combinations',
        implementation: `Include keywords like "${content.entityData?.area || '[area]'} wedding venue", "luxury ${content.entityData?.venueType?.[0]?.replace('-', ' ') || 'wedding'} bali"`,
        priority: 'high',
        estimatedImpact: 8,
        category: 'local'
      });

      if (content.entityData?.capacity?.seated) {
        recommendations.push({
          title: 'Highlight Capacity for Search Intent',
          description: 'Optimize for guest count searches',
          implementation: `Add phrases like "seats ${content.entityData.capacity.seated} guests", "intimate wedding" or "grand celebration"`,
          priority: 'medium',
          estimatedImpact: 6,
          category: 'keywords'
        });
      }
    }

    if (content.type === 'event') {
      recommendations.push({
        title: 'Leverage Couple Story for Long-tail Keywords',
        description: 'Target specific wedding story searches',
        implementation: 'Include couple names, venue, year, and wedding style in content',
        priority: 'high',
        estimatedImpact: 7,
        category: 'content'
      });
    }

    // Universal recommendations
    recommendations.push({
      title: 'Add Structured Data Schema',
      description: 'Help search engines understand your content',
      implementation: 'Add JSON-LD schema for LocalBusiness, Event, or Product',
      priority: 'high', 
      estimatedImpact: 8,
      category: 'technical'
    });

    return recommendations;
  }

  /**
   * Utility functions
   */
  private countKeywordOccurrences(text: string, keyword: string): number {
    const regex = new RegExp(`\\b${keyword.replace(/\s+/g, '\\s+')}\\b`, 'gi');
    return (text.match(regex) || []).length;
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase());
  }

  private truncateText(text: string, maxLength: number): string {
    return text.length <= maxLength ? text : text.substring(0, maxLength - 3) + '...';
  }

  private getTitleSuggestions(title: string, content: any): string[] {
    const suggestions: string[] = [];
    
    if (title.length === 0) {
      suggestions.push('Add a descriptive title with location and service type');
    }
    if (title.length > 60) {
      suggestions.push('Shorten title to under 60 characters');
    }
    if (title.length < 30) {
      suggestions.push('Expand title to include more descriptive keywords');
    }
    if (!title.toLowerCase().includes('bali')) {
      suggestions.push('Include "Bali" in title for local SEO');
    }
    
    return suggestions;
  }

  private getDescriptionSuggestions(description: string, content: any): string[] {
    const suggestions: string[] = [];
    
    if (description.length === 0) {
      suggestions.push('Add meta description with value proposition and call-to-action');
    }
    if (description.length > 155) {
      suggestions.push('Shorten description to under 155 characters');  
    }
    if (description.length < 120) {
      suggestions.push('Expand description to 120-155 characters for better visibility');
    }
    
    return suggestions;
  }

  private getMissingMetadata(content: any): string[] {
    const missing: string[] = [];
    
    if (!content.title) missing.push('title');
    if (!content.description) missing.push('description');
    if (!content.images?.length) missing.push('og:image');
    
    return missing;
  }

  private analyzeHeadings(text: string): HeadingAnalysis[] {
    // Simplified heading analysis
    const headings: HeadingAnalysis[] = [];
    
    const h1Matches = text.match(/<h1[^>]*>([^<]+)<\/h1>/gi) || [];
    const h2Matches = text.match(/<h2[^>]*>([^<]+)<\/h2>/gi) || [];
    
    h1Matches.forEach(match => {
      const text = match.replace(/<[^>]*>/g, '').trim();
      headings.push({
        level: 1,
        text,
        keywordOptimized: this.weddingKeywords.some(k => 
          text.toLowerCase().includes(k.toLowerCase())
        ),
        suggestions: []
      });
    });

    return headings;
  }

  private analyzeImages(images: any[]): ImageAnalysis {
    const total = images.length;
    const withAlt = images.filter(img => img.alt && img.alt.trim()).length;
    const optimized = images.filter(img => 
      img.alt && 
      img.alt.trim() && 
      img.alt.toLowerCase().includes('wedding')
    ).length;
    
    const issues: string[] = [];
    if (withAlt < total) {
      issues.push(`${total - withAlt} images missing alt text`);
    }
    if (optimized < withAlt) {
      issues.push(`${withAlt - optimized} images could include wedding keywords in alt text`);
    }

    return { total, withAlt, optimized, issues };
  }

  private calculateReadability(text: string): ReadabilityScore {
    // Simplified readability calculation
    const sentences = text.split(/[.!?]+/).length - 1;
    const words = text.split(' ').length;
    const avgWordsPerSentence = words / (sentences || 1);
    
    let score = 100;
    if (avgWordsPerSentence > 20) score -= 20;
    if (avgWordsPerSentence > 25) score -= 20;
    
    return {
      score: Math.max(0, score),
      level: score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : 'Needs Improvement',
      suggestions: avgWordsPerSentence > 20 ? ['Break up long sentences'] : []
    };
  }

  private analyzeKeywordUsage(text: string): KeywordUsage {
    const primary: { keyword: string; count: number; density: number }[] = [];
    const missing: string[] = [];
    const overuse: string[] = [];
    
    const wordCount = text.split(' ').length;
    
    this.weddingKeywords.forEach(keyword => {
      const count = this.countKeywordOccurrences(text, keyword);
      const density = (count / wordCount) * 100;
      
      if (count > 0) {
        primary.push({ keyword, count, density });
        if (density > 3) overuse.push(keyword);
      } else {
        missing.push(keyword);
      }
    });

    return { primary, missing, overuse };
  }

  private countInternalLinks(text: string): number {
    const matches = text.match(/href=["'][^"']*(?:bali\.love|\/[^"']*)/gi) || [];
    return matches.length;
  }

  private countExternalLinks(text: string): number {
    const matches = text.match(/href=["']https?:\/\/(?!.*bali\.love)[^"']*/gi) || [];
    return matches.length;
  }

  /**
   * Generate SEO performance report
   */
  async generateReport(url: string): Promise<{
    analysis: SEOAnalysis;
    actionPlan: string[];
    priorityFixes: SEOIssue[];
  }> {
    // This would be implemented to fetch page content and analyze
    // For now, returning structure for development
    
    const mockAnalysis: SEOAnalysis = {
      score: 0,
      issues: [],
      recommendations: [],
      keywords: {
        primary: [],
        secondary: [],
        local: [],
        longtail: [],
        density: {},
        opportunities: []
      },
      metadata: {
        title: { content: '', length: 0, optimal: false, suggestions: [] },
        description: { content: '', length: 0, optimal: false, suggestions: [] },
        missing: []
      },
      content: {
        wordCount: 0,
        headingStructure: [],
        imageOptimization: { total: 0, withAlt: 0, optimized: 0, issues: [] },
        readability: { score: 0, level: '', suggestions: [] },
        keywordUsage: { primary: [], missing: [], overuse: [] }
      },
      technical: {
        pageSpeed: 0,
        mobileOptimized: false,
        structuredData: false,
        internalLinks: 0,
        externalLinks: 0
      }
    };

    return {
      analysis: mockAnalysis,
      actionPlan: [],
      priorityFixes: []
    };
  }
}

export const seoAgent = new SEOAgent();