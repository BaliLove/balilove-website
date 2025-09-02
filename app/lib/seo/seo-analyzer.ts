/**
 * SEO Analyzer - Advanced page analysis and optimization recommendations
 * 
 * Provides detailed SEO insights, scoring, and actionable recommendations
 * for wedding content optimization
 */

import { seoAgent } from './seo-agent';

export interface PageAnalysisResult {
  url: string;
  pageType: 'venue' | 'event' | 'package' | 'team' | 'page';
  seoScore: number;
  performanceGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  criticalIssues: number;
  warnings: number;
  suggestions: number;
  analysis: any;
  optimizations: OptimizationPlan;
  competitorInsights: CompetitorAnalysis;
}

export interface OptimizationPlan {
  immediate: OptimizationAction[];
  shortTerm: OptimizationAction[];
  longTerm: OptimizationAction[];
  estimated_impact: {
    ranking_improvement: number; // 1-10 scale
    traffic_increase: number; // percentage
    conversion_improvement: number; // percentage
  };
}

export interface OptimizationAction {
  title: string;
  description: string;
  implementation: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  timeframe: string; // e.g., "1-2 hours", "1-2 weeks"
}

export interface CompetitorAnalysis {
  topCompetitors: string[];
  keywordGaps: string[];
  contentGaps: string[];
  technicalAdvantages: string[];
  opportunityAreas: string[];
}

export class SEOAnalyzer {
  
  /**
   * Analyze a specific page for SEO optimization
   */
  async analyzePage(pageData: {
    url: string;
    title?: string;
    description?: string; 
    content: string;
    images: any[];
    type: 'venue' | 'event' | 'package' | 'team' | 'page';
    entityData?: any;
    existingMetadata?: any;
  }): Promise<PageAnalysisResult> {
    
    const analysis = await seoAgent.analyzePage({
      title: pageData.title,
      description: pageData.description,
      content: pageData.content,
      images: pageData.images,
      url: pageData.url,
      type: pageData.type,
      entityData: pageData.entityData
    });

    const optimizations = this.generateOptimizationPlan(analysis, pageData);
    const competitorInsights = this.analyzeCompetitorLandscape(pageData);
    
    return {
      url: pageData.url,
      pageType: pageData.type,
      seoScore: analysis.score,
      performanceGrade: this.calculateGrade(analysis.score),
      criticalIssues: analysis.issues.filter(i => i.type === 'critical').length,
      warnings: analysis.issues.filter(i => i.type === 'warning').length,
      suggestions: analysis.issues.filter(i => i.type === 'suggestion').length,
      analysis,
      optimizations,
      competitorInsights
    };
  }

  /**
   * Batch analyze multiple pages for site-wide SEO audit
   */
  async analyzeSite(pages: Array<{
    url: string;
    type: 'venue' | 'event' | 'package' | 'team' | 'page';
    title?: string;
    description?: string;
    content?: string;
    entityData?: any;
  }>): Promise<SiteAuditResult> {
    
    const pageResults = await Promise.all(
      pages.map(async (page) => {
        try {
          return await this.analyzePage({
            ...page,
            content: page.content || '',
            images: []
          });
        } catch (error) {
          console.error(`Failed to analyze page ${page.url}:`, error);
          return null;
        }
      })
    );

    const validResults = pageResults.filter(Boolean) as PageAnalysisResult[];
    
    return this.generateSiteAudit(validResults);
  }

  /**
   * Generate optimization plan based on analysis
   */
  private generateOptimizationPlan(analysis: any, pageData: any): OptimizationPlan {
    const immediate: OptimizationAction[] = [];
    const shortTerm: OptimizationAction[] = [];
    const longTerm: OptimizationAction[] = [];

    // Immediate fixes (< 1 day)
    analysis.issues.forEach((issue: any) => {
      if (issue.type === 'critical' && issue.category === 'metadata') {
        immediate.push({
          title: `Fix ${issue.category}: ${issue.message}`,
          description: issue.fix,
          implementation: this.getMetadataImplementation(issue, pageData),
          effort: 'low',
          impact: issue.impact,
          timeframe: '1-2 hours'
        });
      }
    });

    // Short-term optimizations (1-2 weeks)
    if (analysis.technical.structuredData === false) {
      shortTerm.push({
        title: 'Add Structured Data Schema',
        description: 'Implement JSON-LD schema markup for better search understanding',
        implementation: this.getSchemaImplementation(pageData.type),
        effort: 'medium',
        impact: 'high',
        timeframe: '3-5 hours'
      });
    }

    if (analysis.content.wordCount < 300) {
      shortTerm.push({
        title: 'Expand Content Depth',
        description: 'Add comprehensive details to improve topical authority',
        implementation: this.getContentExpansionPlan(pageData.type, pageData.entityData),
        effort: 'medium',
        impact: 'medium',
        timeframe: '1-2 weeks'
      });
    }

    // Long-term strategy (1+ months)
    longTerm.push({
      title: 'Build Topical Authority Cluster',
      description: 'Create content cluster around this page topic',
      implementation: this.getClusterStrategy(pageData.type, pageData.entityData),
      effort: 'high',
      impact: 'high',
      timeframe: '1-2 months'
    });

    return {
      immediate,
      shortTerm,
      longTerm,
      estimated_impact: {
        ranking_improvement: this.estimateRankingImprovement(analysis),
        traffic_increase: this.estimateTrafficIncrease(analysis), 
        conversion_improvement: this.estimateConversionImprovement(analysis)
      }
    };
  }

  /**
   * Analyze competitor landscape for strategic insights
   */
  private analyzeCompetitorLandscape(pageData: any): CompetitorAnalysis {
    // Wedding planning competitor analysis for Bali market
    const topCompetitors = [
      'thebaliweddingcompany.com',
      'baliwedding.com', 
      'baliblissweddings.com',
      'baliweddingorganizer.com',
      'weddingsbali.com'
    ];

    const keywordGaps: string[] = [];
    const contentGaps: string[] = [];
    const technicalAdvantages: string[] = [];
    const opportunityAreas: string[] = [];

    // Analyze based on page type
    switch (pageData.type) {
      case 'venue':
        keywordGaps.push(
          `${pageData.entityData?.area || '[area]'} wedding photographer`,
          `${pageData.entityData?.area || '[area]'} wedding decoration`,
          `best time to marry in ${pageData.entityData?.area || '[area]'}`
        );
        contentGaps.push(
          'Virtual venue tours',
          'Seasonal pricing guides',
          'Guest accommodation recommendations'
        );
        opportunityAreas.push(
          'Local vendor partnerships',
          'Weather and seasonal information',
          'Transportation and logistics'
        );
        break;
        
      case 'event':
        keywordGaps.push(
          'real wedding reviews bali',
          'wedding timeline bali',
          'wedding budget breakdown bali'
        );
        contentGaps.push(
          'Detailed wedding timelines',
          'Vendor recommendation lists',
          'Budget breakdown transparency'
        );
        break;
        
      case 'package':
        keywordGaps.push(
          'bali wedding cost breakdown',
          'affordable bali wedding packages',
          'luxury bali wedding all inclusive'
        );
        contentGaps.push(
          'Package comparison tools',
          'Add-on pricing calculators',
          'Payment plan options'
        );
        break;
    }

    // Technical advantages we have
    technicalAdvantages.push(
      'Modern Next.js performance',
      'Sanity CMS flexibility',
      'Real-time content updates',
      'Mobile-first responsive design'
    );

    return {
      topCompetitors,
      keywordGaps,
      contentGaps, 
      technicalAdvantages,
      opportunityAreas
    };
  }

  /**
   * Generate site-wide audit summary
   */
  private generateSiteAudit(results: PageAnalysisResult[]): SiteAuditResult {
    const avgScore = results.reduce((sum, r) => sum + r.seoScore, 0) / results.length;
    const totalIssues = results.reduce((sum, r) => sum + r.criticalIssues + r.warnings, 0);
    
    const pagesByGrade = results.reduce((acc, result) => {
      acc[result.performanceGrade] = (acc[result.performanceGrade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topIssues = this.identifyTopSiteIssues(results);
    const opportunities = this.identifyTopOpportunities(results);

    return {
      overallScore: Math.round(avgScore),
      totalPages: results.length,
      pagesByGrade,
      totalIssues,
      topIssues,
      opportunities,
      priorityActions: this.generateSitePriorityActions(results)
    };
  }

  /**
   * Helper methods for implementation guidance
   */
  private getMetadataImplementation(issue: any, pageData: any): string {
    const type = pageData.type;
    
    if (issue.message.includes('title')) {
      return `Update generateMetadata() in app/${type}s/[slug]/page.tsx to use optimized title template`;
    }
    
    if (issue.message.includes('description')) {
      return `Add description field to generateMetadata() with keyword-rich content`;
    }
    
    return 'Update page metadata generation function';
  }

  private getSchemaImplementation(pageType: string): string {
    switch (pageType) {
      case 'venue':
        return 'Add LocalBusiness + Place schema with wedding venue details, pricing, reviews';
      case 'event':
        return 'Add Event schema with wedding details, location, performers';
      case 'package':
        return 'Add Product/Service schema with pricing, inclusions, reviews';
      default:
        return 'Add appropriate schema.org markup for page content type';
    }
  }

  private getContentExpansionPlan(pageType: string, entityData: any): string {
    switch (pageType) {
      case 'venue':
        return `Add sections: Getting There, What Makes It Special, Perfect For (guest count/style), Seasonal Considerations, Nearby Attractions`;
      case 'event':
        return `Expand story: Planning Process, Vendor Details, Timeline, Challenges Overcome, Couple's Advice, Photo Highlights`;
      case 'package':
        return `Add details: What's Included/Excluded, Timeline Examples, Customization Options, Real Wedding Examples, Planning Process`;
      default:
        return 'Add more comprehensive, keyword-rich content sections';
    }
  }

  private getClusterStrategy(pageType: string, entityData: any): string {
    switch (pageType) {
      case 'venue':
        const area = entityData?.area || '[area]';
        return `Create cluster: ${area} wedding guide, ${area} vendor directory, ${area} accommodation guide, ${area} weather & seasons`;
      case 'event':
        return 'Create cluster: Wedding planning timeline, vendor guides, style inspiration, real wedding series';
      case 'package':
        return 'Create cluster: Wedding budget guides, package comparison, add-on services, planning checklists';
      default:
        return 'Develop content cluster around main topic themes';
    }
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private estimateRankingImprovement(analysis: any): number {
    let improvement = 0;
    
    if (analysis.metadata.title.optimal) improvement += 2;
    if (analysis.metadata.description.optimal) improvement += 2;
    if (analysis.keywords.primary.length >= 2) improvement += 3;
    if (!analysis.technical.structuredData) improvement += 2; // Adding schema
    if (analysis.content.wordCount >= 300) improvement += 1;
    
    return Math.min(improvement, 10);
  }

  private estimateTrafficIncrease(analysis: any): number {
    const baseIncrease = analysis.score < 50 ? 40 : analysis.score < 70 ? 25 : 15;
    return Math.round(baseIncrease * (1 - analysis.score / 100));
  }

  private estimateConversionImprovement(analysis: any): number {
    // Better SEO usually improves conversion by 5-15%
    return analysis.score < 60 ? 15 : analysis.score < 80 ? 10 : 5;
  }

  private identifyTopSiteIssues(results: PageAnalysisResult[]): SiteIssue[] {
    const issueMap = new Map<string, { count: number; impact: string; pages: string[] }>();
    
    results.forEach(result => {
      result.analysis.issues.forEach((issue: any) => {
        const key = `${issue.category}-${issue.message}`;
        
        if (!issueMap.has(key)) {
          issueMap.set(key, {
            count: 0,
            impact: issue.impact,
            pages: []
          });
        }
        
        const existing = issueMap.get(key)!;
        existing.count++;
        existing.pages.push(result.url);
      });
    });

    return Array.from(issueMap.entries())
      .map(([message, data]) => ({
        issue: message,
        affectedPages: data.count,
        impact: data.impact,
        examplePages: data.pages.slice(0, 3)
      }))
      .sort((a, b) => {
        // Sort by impact and frequency
        const impactScore = { high: 3, medium: 2, low: 1 };
        return (impactScore[b.impact as keyof typeof impactScore] * b.affectedPages) - 
               (impactScore[a.impact as keyof typeof impactScore] * a.affectedPages);
      })
      .slice(0, 10);
  }

  private identifyTopOpportunities(results: PageAnalysisResult[]): OpportunityInsight[] {
    const opportunities: OpportunityInsight[] = [];
    
    // Identify pages with high potential for improvement
    const lowPerformingPages = results.filter(r => r.seoScore < 60);
    const missingMetadata = results.filter(r => 
      r.analysis.metadata.title.length === 0 || r.analysis.metadata.description.length === 0
    );
    
    if (lowPerformingPages.length > 0) {
      opportunities.push({
        title: 'Quick Wins - Low Performing Pages',
        description: `${lowPerformingPages.length} pages scoring below 60% - immediate optimization potential`,
        impact: 'high',
        effort: 'medium',
        estimatedTrafficIncrease: 30,
        pages: lowPerformingPages.slice(0, 5).map(p => p.url)
      });
    }

    if (missingMetadata.length > 0) {
      opportunities.push({
        title: 'Missing Metadata Gold Mine',
        description: `${missingMetadata.length} pages missing title/description - easy ranking improvements`,
        impact: 'high',
        effort: 'low',
        estimatedTrafficIncrease: 25,
        pages: missingMetadata.slice(0, 5).map(p => p.url)
      });
    }

    // Venue-specific opportunities
    const venuePages = results.filter(r => r.pageType === 'venue');
    if (venuePages.length > 0) {
      opportunities.push({
        title: 'Local SEO Domination',
        description: `${venuePages.length} venue pages can dominate local Bali wedding searches`,
        impact: 'high',
        effort: 'medium',
        estimatedTrafficIncrease: 50,
        pages: venuePages.slice(0, 10).map(p => p.url)
      });
    }

    // Content depth opportunities
    const thinContentPages = results.filter(r => r.analysis.content.wordCount < 200);
    if (thinContentPages.length > 0) {
      opportunities.push({
        title: 'Content Expansion Opportunities',
        description: `${thinContentPages.length} pages with thin content - expand for topical authority`,
        impact: 'medium',
        effort: 'high', 
        estimatedTrafficIncrease: 20,
        pages: thinContentPages.slice(0, 5).map(p => p.url)
      });
    }

    return opportunities;
  }

  private generateSitePriorityActions(results: PageAnalysisResult[]): PriorityAction[] {
    const actions: PriorityAction[] = [];
    
    // Aggregate critical issues
    const criticalCount = results.reduce((sum, r) => sum + r.criticalIssues, 0);
    if (criticalCount > 0) {
      actions.push({
        title: `Fix ${criticalCount} Critical SEO Issues`,
        description: 'Address missing metadata, broken functionality, and technical problems',
        impact: 'high',
        effort: 'low',
        timeframe: '1-2 days',
        affectedPages: criticalCount
      });
    }

    // Metadata implementation
    const pagesWithoutMetadata = results.filter(r => 
      r.analysis.metadata.title.length === 0 || r.analysis.metadata.description.length === 0
    );
    
    if (pagesWithoutMetadata.length > 0) {
      actions.push({
        title: `Implement Metadata for ${pagesWithoutMetadata.length} Pages`,
        description: 'Add generateMetadata functions for all content types',
        impact: 'high',
        effort: 'medium',
        timeframe: '1 week',
        affectedPages: pagesWithoutMetadata.length
      });
    }

    // Structured data implementation
    actions.push({
      title: 'Add Structured Data Across All Pages',
      description: 'Implement schema.org markup for venues, events, reviews, and business info',
      impact: 'high',
      effort: 'medium', 
      timeframe: '1-2 weeks',
      affectedPages: results.length
    });

    return actions.slice(0, 5); // Top 5 priority actions
  }
}

// Supporting interfaces
interface SiteAuditResult {
  overallScore: number;
  totalPages: number;
  pagesByGrade: Record<string, number>;
  totalIssues: number;
  topIssues: SiteIssue[];
  opportunities: OpportunityInsight[];
  priorityActions: PriorityAction[];
}

interface SiteIssue {
  issue: string;
  affectedPages: number;
  impact: string;
  examplePages: string[];
}

interface OpportunityInsight {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  estimatedTrafficIncrease: number;
  pages: string[];
}

interface PriorityAction {
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  timeframe: string;
  affectedPages: number;
}

export const seoAnalyzer = new SEOAnalyzer();