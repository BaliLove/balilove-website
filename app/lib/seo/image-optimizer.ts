/**
 * Image SEO Optimization System for Wedding Website
 * 
 * Optimizes all images for SEO with descriptive alt text,
 * proper sizing, and performance monitoring
 */

import { client } from '@/sanity/lib/client';

interface ImageOptimizationResult {
  totalImages: number;
  optimizedImages: number;
  missingAltText: number;
  oversizedImages: number;
  improvements: Array<{
    imageId: string;
    currentAlt: string;
    suggestedAlt: string;
    issue: string;
    fix: string;
  }>;
}

export class ImageSEOOptimizer {
  
  private readonly weddingKeywords = [
    'wedding', 'bali', 'ceremony', 'reception', 'bride', 'groom',
    'venue', 'celebration', 'destination', 'luxury', 'beach', 'villa'
  ];

  private readonly areaKeywords = [
    'uluwatu', 'seminyak', 'ubud', 'canggu', 'sanur', 'jimbaran', 'nusa dua'
  ];

  /**
   * Audit all images across the website for SEO optimization
   */
  async auditAllImages(): Promise<ImageOptimizationResult> {
    console.log('🖼️ Starting comprehensive image SEO audit...');
    
    const results: ImageOptimizationResult = {
      totalImages: 0,
      optimizedImages: 0,
      missingAltText: 0,
      oversizedImages: 0,
      improvements: []
    };

    try {
      // Audit venue images
      const venueResults = await this.auditVenueImages();
      this.mergeResults(results, venueResults);

      // Audit real wedding images  
      const eventResults = await this.auditEventImages();
      this.mergeResults(results, eventResults);

      // Audit package images
      const packageResults = await this.auditPackageImages();
      this.mergeResults(results, packageResults);

      // Audit team member images
      const teamResults = await this.auditTeamImages();
      this.mergeResults(results, teamResults);

      console.log(`✅ Image audit complete: ${results.optimizedImages}/${results.totalImages} optimized`);
      
      return results;

    } catch (error) {
      console.error('❌ Image audit failed:', error);
      throw error;
    }
  }

  /**
   * Audit venue images for SEO optimization
   */
  private async auditVenueImages(): Promise<Partial<ImageOptimizationResult>> {
    const venues = await client.fetch(`
      *[_type == "venue"] {
        _id,
        name,
        "area": location.area,
        "venueType": venueType[0],
        heroImage {
          asset -> { _id, url, metadata },
          alt
        },
        gallery[] {
          image {
            asset -> { _id, url, metadata },
            alt
          },
          category,
          caption
        }
      }
    `);

    const improvements: any[] = [];
    let totalImages = 0;
    let optimizedImages = 0;
    let missingAltText = 0;

    venues.forEach((venue: any) => {
      // Audit hero image
      if (venue.heroImage) {
        totalImages++;
        const heroOptimization = this.auditVenueHeroImage(venue);
        if (heroOptimization) {
          improvements.push(heroOptimization);
        } else {
          optimizedImages++;
        }
        if (!venue.heroImage.alt) missingAltText++;
      }

      // Audit gallery images
      venue.gallery?.forEach((galleryItem: any, index: number) => {
        if (galleryItem.image) {
          totalImages++;
          const galleryOptimization = this.auditVenueGalleryImage(venue, galleryItem, index);
          if (galleryOptimization) {
            improvements.push(galleryOptimization);
          } else {
            optimizedImages++;
          }
          if (!galleryItem.image.alt) missingAltText++;
        }
      });
    });

    return {
      totalImages,
      optimizedImages,
      missingAltText,
      improvements
    };
  }

  /**
   * Audit real wedding event images
   */
  private async auditEventImages(): Promise<Partial<ImageOptimizationResult>> {
    const events = await client.fetch(`
      *[_type == "realEvent"] {
        _id,
        brideName,
        groomName,
        weddingDate,
        venue-> {
          name,
          "area": location.area
        },
        heroImage {
          asset -> { _id, url, metadata },
          alt
        },
        gallery[] {
          image {
            asset -> { _id, url, metadata },
            alt
          },
          category,
          caption
        }
      }
    `);

    const improvements: any[] = [];
    let totalImages = 0;
    let optimizedImages = 0;
    let missingAltText = 0;

    events.forEach((event: any) => {
      // Audit wedding hero image
      if (event.heroImage) {
        totalImages++;
        const heroOptimization = this.auditWeddingHeroImage(event);
        if (heroOptimization) {
          improvements.push(heroOptimization);
        } else {
          optimizedImages++;
        }
        if (!event.heroImage.alt) missingAltText++;
      }

      // Audit wedding gallery
      event.gallery?.forEach((galleryItem: any, index: number) => {
        if (galleryItem.image) {
          totalImages++;
          const galleryOptimization = this.auditWeddingGalleryImage(event, galleryItem, index);
          if (galleryOptimization) {
            improvements.push(galleryOptimization);
          } else {
            optimizedImages++;
          }
          if (!galleryItem.image.alt) missingAltText++;
        }
      });
    });

    return {
      totalImages,
      optimizedImages,
      missingAltText,
      improvements
    };
  }

  /**
   * Audit package and team images
   */
  private async auditPackageImages(): Promise<Partial<ImageOptimizationResult>> {
    const packages = await client.fetch(`
      *[_type == "weddingPackage"] {
        _id,
        name,
        packageType,
        heroImage {
          asset -> { _id, url, metadata },
          alt
        }
      }
    `);

    const improvements: any[] = [];
    let totalImages = packages.length;
    let optimizedImages = 0;
    let missingAltText = 0;

    packages.forEach((pkg: any) => {
      if (pkg.heroImage) {
        const optimization = this.auditPackageImage(pkg);
        if (optimization) {
          improvements.push(optimization);
        } else {
          optimizedImages++;
        }
        if (!pkg.heroImage.alt) missingAltText++;
      }
    });

    return {
      totalImages,
      optimizedImages,
      missingAltText,
      improvements
    };
  }

  /**
   * Audit team member images
   */
  private async auditTeamImages(): Promise<Partial<ImageOptimizationResult>> {
    const teamMembers = await client.fetch(`
      *[_type == "teamMember"] {
        _id,
        name,
        jobRole,
        profileImage {
          asset -> { _id, url, metadata },
          alt
        }
      }
    `);

    const improvements: any[] = [];
    let totalImages = teamMembers.length;
    let optimizedImages = 0;
    let missingAltText = 0;

    teamMembers.forEach((member: any) => {
      if (member.profileImage) {
        const optimization = this.auditTeamImage(member);
        if (optimization) {
          improvements.push(optimization);
        } else {
          optimizedImages++;
        }
        if (!member.profileImage.alt) missingAltText++;
      }
    });

    return {
      totalImages,
      optimizedImages,
      missingAltText,
      improvements
    };
  }

  /**
   * Generate optimized alt text for venue hero images
   */
  private auditVenueHeroImage(venue: any): any {
    const currentAlt = venue.heroImage.alt || '';
    const optimalAlt = this.generateVenueHeroAlt(venue);
    
    if (!currentAlt || !this.isAltTextOptimized(currentAlt, ['venue', 'wedding', venue.area])) {
      return {
        imageId: venue.heroImage.asset._id,
        currentAlt,
        suggestedAlt: optimalAlt,
        issue: currentAlt ? 'Alt text not SEO optimized' : 'Missing alt text',
        fix: `Update to: "${optimalAlt}"`
      };
    }
    
    return null;
  }

  /**
   * Generate optimized alt text for venue gallery images
   */
  private auditVenueGalleryImage(venue: any, galleryItem: any, index: number): any {
    const currentAlt = galleryItem.image.alt || '';
    const optimalAlt = this.generateVenueGalleryAlt(venue, galleryItem, index);
    
    if (!currentAlt || !this.isAltTextOptimized(currentAlt, ['venue', venue.area, galleryItem.category])) {
      return {
        imageId: galleryItem.image.asset._id,
        currentAlt,
        suggestedAlt: optimalAlt,
        issue: currentAlt ? 'Gallery alt text not optimized' : 'Missing gallery alt text',
        fix: `Update to: "${optimalAlt}"`
      };
    }
    
    return null;
  }

  /**
   * Generate optimized alt text for wedding hero images
   */
  private auditWeddingHeroImage(event: any): any {
    const currentAlt = event.heroImage.alt || '';
    const optimalAlt = this.generateWeddingHeroAlt(event);
    
    if (!currentAlt || !this.isAltTextOptimized(currentAlt, ['wedding', 'bali', event.venue?.name])) {
      return {
        imageId: event.heroImage.asset._id,
        currentAlt,
        suggestedAlt: optimalAlt,
        issue: currentAlt ? 'Wedding alt text could be more descriptive' : 'Missing wedding photo alt text',
        fix: `Update to: "${optimalAlt}"`
      };
    }
    
    return null;
  }

  /**
   * Generate optimized alt text for wedding gallery images
   */
  private auditWeddingGalleryImage(event: any, galleryItem: any, index: number): any {
    const currentAlt = galleryItem.image.alt || '';
    const optimalAlt = this.generateWeddingGalleryAlt(event, galleryItem, index);
    
    if (!currentAlt || !this.isAltTextOptimized(currentAlt, ['wedding', event.venue?.name, galleryItem.category])) {
      return {
        imageId: galleryItem.image.asset._id,
        currentAlt,
        suggestedAlt: optimalAlt,
        issue: 'Wedding gallery needs SEO optimization',
        fix: `Update to: "${optimalAlt}"`
      };
    }
    
    return null;
  }

  /**
   * Generate alt text templates
   */
  private generateVenueHeroAlt(venue: any): string {
    const name = venue.name;
    const area = venue.area ? venue.area.charAt(0).toUpperCase() + venue.area.slice(1) : '';
    const venueType = venue.venueType ? venue.venueType.replace('-', ' ') : 'wedding venue';
    
    return `${name} ${venueType} in ${area}, Bali - luxury destination wedding venue with ocean views`;
  }

  private generateVenueGalleryAlt(venue: any, galleryItem: any, index: number): string {
    const name = venue.name;
    const area = venue.area;
    const category = galleryItem.category || 'venue';
    
    const categoryDescriptions: Record<string, string> = {
      'ceremony': 'wedding ceremony space',
      'reception': 'wedding reception area', 
      'accommodation': 'bridal suite accommodation',
      'grounds': 'venue grounds and gardens',
      'dining': 'dining area setup',
      'sunset': 'sunset view for ceremonies'
    };

    const categoryDesc = categoryDescriptions[category] || category;
    
    return `${name} ${categoryDesc} in ${area}, Bali - luxury wedding venue photography`;
  }

  private generateWeddingHeroAlt(event: any): string {
    const coupleNames = event.brideName && event.groomName ? 
      `${event.brideName} and ${event.groomName}` : 'wedding couple';
    const venueName = event.venue?.name || 'luxury venue';
    const area = event.venue?.area || 'Bali';
    const year = event.weddingDate ? new Date(event.weddingDate).getFullYear() : '';
    
    return `${coupleNames}${year ? ` ${year}` : ''} wedding at ${venueName} in ${area}, Bali - real destination wedding photography`;
  }

  private generateWeddingGalleryAlt(event: any, galleryItem: any, index: number): string {
    const coupleNames = event.brideName && event.groomName ? 
      `${event.brideName} and ${event.groomName}` : 'wedding couple';
    const venueName = event.venue?.name || '';
    const category = galleryItem.category || 'wedding';
    
    const categoryMoments: Record<string, string> = {
      'ceremony': 'wedding ceremony moment',
      'reception': 'wedding reception celebration',
      'portrait': 'couple portrait session',
      'details': 'wedding detail photography',
      'grounds': 'venue and setting photos',
      'guests': 'family and friends celebration'
    };

    const moment = categoryMoments[category] || 'wedding photography';
    
    return `${coupleNames} ${moment}${venueName ? ` at ${venueName}` : ''} - real Bali wedding photo`;
  }

  private auditPackageImage(pkg: any): any {
    const currentAlt = pkg.heroImage.alt || '';
    const optimalAlt = `${pkg.name} - ${pkg.packageType || 'wedding'} package for Bali destination weddings`;
    
    if (!currentAlt || !this.isAltTextOptimized(currentAlt, ['package', 'wedding', 'bali'])) {
      return {
        imageId: pkg.heroImage.asset._id,
        currentAlt,
        suggestedAlt: optimalAlt,
        issue: 'Package image needs SEO optimization',
        fix: `Update to: "${optimalAlt}"`
      };
    }
    
    return null;
  }

  private auditTeamImage(member: any): any {
    const currentAlt = member.profileImage.alt || '';
    const optimalAlt = `${member.name} - ${member.jobRole} at Bali Love wedding planners`;
    
    if (!currentAlt || !this.isAltTextOptimized(currentAlt, ['wedding planner', 'bali', member.name.toLowerCase()])) {
      return {
        imageId: member.profileImage.asset._id,
        currentAlt,
        suggestedAlt: optimalAlt,
        issue: 'Team photo needs professional description',
        fix: `Update to: "${optimalAlt}"`
      };
    }
    
    return null;
  }

  /**
   * Check if alt text is SEO optimized
   */
  private isAltTextOptimized(altText: string, requiredKeywords: string[]): boolean {
    const lowerAlt = altText.toLowerCase();
    
    // Must contain at least 2 of the required keywords
    const keywordCount = requiredKeywords.filter(keyword => 
      lowerAlt.includes(keyword.toLowerCase())
    ).length;
    
    return keywordCount >= 2 && 
           altText.length >= 10 && 
           altText.length <= 125 &&
           !altText.includes('image') && // Avoid generic "image" terms
           !altText.includes('photo');   // Avoid generic "photo" terms
  }

  /**
   * Generate bulk alt text updates for Sanity
   */
  async generateBulkAltTextUpdates(): Promise<Array<{
    documentId: string;
    documentType: string;
    fieldPath: string;
    currentValue: string;
    newValue: string;
    seoKeywords: string[];
  }>> {
    const updates: any[] = [];
    const auditResult = await this.auditAllImages();
    
    auditResult.improvements.forEach(improvement => {
      // Determine document type and field path based on image ID
      // This would need to be implemented based on your Sanity data structure
      updates.push({
        documentId: improvement.imageId,
        documentType: 'venue', // Would be determined dynamically
        fieldPath: 'heroImage.alt',
        currentValue: improvement.currentAlt,
        newValue: improvement.suggestedAlt,
        seoKeywords: this.extractKeywords(improvement.suggestedAlt)
      });
    });

    return updates;
  }

  /**
   * Performance optimization recommendations for images
   */
  getImagePerformanceOptimizations(): {
    immediate: string[];
    advanced: string[];
    weddingSpecific: string[];
  } {
    return {
      immediate: [
        'Add priority loading to venue hero images',
        'Implement lazy loading for gallery images', 
        'Add explicit width/height to prevent layout shift',
        'Use Next.js Image component for automatic optimization'
      ],
      advanced: [
        'Convert images to WebP format for better compression',
        'Implement responsive image sizes for different devices',
        'Add image preloading for critical above-fold content',
        'Use blur-up technique for smooth image loading'
      ],
      weddingSpecific: [
        'Optimize venue gallery images for mobile viewing',
        'Implement image compression for wedding photo galleries',
        'Add thumbnail generation for faster gallery browsing',
        'Optimize team photos for professional presentation'
      ]
    };
  }

  /**
   * Monitor image loading performance in real-time
   */
  setupImagePerformanceTracking(): void {
    if (typeof window === 'undefined') return;

    // Track when images load slowly
    const imageObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (entry.name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
          const loadTime = entry.responseEnd - entry.startTime;
          const size = (entry as any).transferSize || 0;
          
          // Alert for images that hurt performance
          if (loadTime > 1500 || size > 750000) { // 1.5s or 750KB
            console.warn(`🖼️ Performance impact: ${entry.name} took ${loadTime.toFixed(0)}ms (${(size/1024).toFixed(0)}KB)`);
            
            // Track in PostHog
            if (window.posthog) {
              window.posthog.capture('seo_image_performance_issue', {
                image_url: entry.name,
                load_time: loadTime,
                file_size: size,
                page_url: window.location.pathname,
                issue_type: loadTime > 1500 ? 'slow-loading' : 'large-file',
                timestamp: new Date().toISOString()
              });
            }
          }
        }
      });
    });

    try {
      observer.observe({ type: 'resource', buffered: true });
    } catch (e) {
      console.warn('Image performance tracking not available');
    }
  }

  /**
   * Utility methods
   */
  private mergeResults(target: ImageOptimizationResult, source: Partial<ImageOptimizationResult>): void {
    target.totalImages += source.totalImages || 0;
    target.optimizedImages += source.optimizedImages || 0;
    target.missingAltText += source.missingAltText || 0;
    target.oversizedImages += source.oversizedImages || 0;
    if (source.improvements) {
      target.improvements.push(...source.improvements);
    }
  }

  private extractKeywords(altText: string): string[] {
    const keywords: string[] = [];
    const lowerText = altText.toLowerCase();
    
    this.weddingKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        keywords.push(keyword);
      }
    });
    
    this.areaKeywords.forEach(area => {
      if (lowerText.includes(area)) {
        keywords.push(area);
      }
    });
    
    return keywords;
  }
}

/**
 * Image optimization utilities for components
 */
export class ImageOptimizationUtils {
  
  /**
   * Get optimized image props for Next.js Image component
   */
  static getOptimizedImageProps(image: any, context: {
    type: 'hero' | 'gallery' | 'profile' | 'package';
    entityName?: string;
    category?: string;
    area?: string;
  }) {
    const sizes = this.getResponsiveSizes(context.type);
    const alt = this.generateContextualAlt(image, context);
    const priority = context.type === 'hero';
    
    return {
      alt,
      sizes,
      priority,
      placeholder: 'blur' as const,
      blurDataURL: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k='
    };
  }

  /**
   * Get responsive image sizes for different contexts
   */
  private static getResponsiveSizes(type: string): string {
    switch (type) {
      case 'hero':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
      case 'gallery':
        return '(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw';
      case 'profile':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px';
      case 'package':
        return '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px';
      default:
        return '100vw';
    }
  }

  /**
   * Generate contextual alt text
   */
  private static generateContextualAlt(image: any, context: any): string {
    if (image.alt && image.alt.length > 10) {
      return image.alt; // Use existing if good
    }

    // Generate based on context
    switch (context.type) {
      case 'hero':
        return `${context.entityName || 'Wedding venue'} in ${context.area || 'Bali'} - luxury destination wedding location`;
      case 'gallery':
        return `${context.entityName || 'Wedding venue'} ${context.category || 'photography'} - ${context.area || 'Bali'} wedding venue details`;
      case 'profile':
        return `${context.entityName} - professional wedding planner at Bali Love`;
      case 'package':
        return `${context.entityName} - all-inclusive Bali wedding package photography`;
      default:
        return `${context.entityName || 'Wedding'} photography in Bali`;
    }
  }
}

export const imageSEOOptimizer = new ImageSEOOptimizer();