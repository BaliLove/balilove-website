/**
 * Structured Data Schema Generation for Wedding Business
 * 
 * Generates JSON-LD schema markup for venues, events, packages,
 * and business information to enhance search engine understanding
 */

interface BusinessSchema {
  '@context': string;
  '@type': string;
  name: string;
  description: string;
  url: string;
  telephone?: string;
  email?: string;
  address?: any;
  geo?: any;
  openingHours?: string[];
  priceRange?: string;
  servesCuisine?: string[];
  acceptsReservations?: boolean;
  aggregateRating?: any;
  review?: any[];
}

export class StructuredDataGenerator {
  
  private readonly baseUrl = process.env.NEXT_PUBLIC_DOMAIN || 'https://bali.love';
  
  /**
   * Generate LocalBusiness schema for main wedding planning business
   */
  generateBusinessSchema(businessData: {
    name: string;
    description: string;
    phone?: string;
    email?: string;
    address?: string;
    totalWeddings?: number;
    averageRating?: number;
    reviewCount?: number;
  }): string {
    const schema: BusinessSchema = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: businessData.name,
      description: businessData.description,
      url: this.baseUrl,
      telephone: businessData.phone,
      email: businessData.email,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: 'Bali',
        addressLocality: 'Seminyak',
        streetAddress: businessData.address || 'Seminyak, Bali'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: -8.6905,
        longitude: 115.1654
      },
      priceRange: '$$$$',
      servesCuisine: ['Indonesian', 'International'],
      acceptsReservations: true
    };

    // Add aggregate rating if available
    if (businessData.averageRating && businessData.reviewCount) {
      schema.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: businessData.averageRating,
        reviewCount: businessData.reviewCount,
        bestRating: 5,
        worstRating: 1
      };
    }

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate venue schema for wedding venue pages
   */
  generateVenueSchema(venue: {
    name: string;
    description?: string;
    area: string;
    address?: string;
    coordinates?: { lat: number; lng: number };
    capacity?: { seated?: number; cocktail?: number };
    amenities?: string[];
    priceRange?: { min?: number; max?: number };
    images?: Array<{ url: string; alt?: string }>;
    reviews?: Array<{
      author: string;
      rating: number;
      text: string;
      date: string;
    }>;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': ['Place', 'EventVenue'],
      name: venue.name,
      description: venue.description || `Luxury wedding venue in ${venue.area}, Bali`,
      url: `${this.baseUrl}/venues/${venue.name.toLowerCase().replace(/\s+/g, '-')}`,
      
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: 'Bali',
        addressLocality: venue.area,
        streetAddress: venue.address || `${venue.area}, Bali, Indonesia`
      },

      geo: venue.coordinates ? {
        '@type': 'GeoCoordinates',
        latitude: venue.coordinates.lat,
        longitude: venue.coordinates.lng
      } : {
        '@type': 'GeoCoordinates',
        latitude: -8.6905, // Default Bali coordinates
        longitude: 115.1654
      },

      maximumAttendeeCapacity: venue.capacity?.seated || venue.capacity?.cocktail,

      amenityFeature: venue.amenities?.map(amenity => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.replace('-', ' '),
        value: true
      })) || [],

      priceRange: venue.priceRange?.min ? 
        `$${venue.priceRange.min}${venue.priceRange.max ? `-$${venue.priceRange.max}` : '+'}` : 
        'Contact for pricing',

      image: venue.images?.map(img => ({
        '@type': 'ImageObject',
        url: img.url,
        description: img.alt || `${venue.name} wedding venue`
      })) || [],

      review: venue.reviews?.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.text,
        datePublished: review.date
      })) || [],

      aggregateRating: venue.reviews?.length ? {
        '@type': 'AggregateRating',
        ratingValue: venue.reviews.reduce((sum, r) => sum + r.rating, 0) / venue.reviews.length,
        reviewCount: venue.reviews.length,
        bestRating: 5,
        worstRating: 1
      } : undefined
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate Event schema for real wedding pages
   */
  generateWeddingEventSchema(wedding: {
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    venue?: {
      name: string;
      area: string;
      address?: string;
    };
    guestCount?: number;
    weddingStyle?: string[];
    images?: Array<{ url: string; alt?: string }>;
    testimonial?: string;
    planner?: string;
  }): string {
    const eventName = wedding.brideName && wedding.groomName ? 
      `${wedding.brideName} & ${wedding.groomName} Wedding` :
      'Beautiful Bali Wedding';

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: eventName,
      description: `${eventName} at ${wedding.venue?.name || 'luxury Bali venue'} - A beautiful destination wedding in ${wedding.venue?.area || 'Bali'} planned by Bali Love wedding planners.`,
      
      startDate: wedding.weddingDate,
      eventStatus: 'https://schema.org/EventCompleted',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      
      location: {
        '@type': 'Place',
        name: wedding.venue?.name || 'Bali Wedding Venue',
        address: {
          '@type': 'PostalAddress',
          addressCountry: 'ID',
          addressRegion: 'Bali',
          addressLocality: wedding.venue?.area || 'Bali',
          streetAddress: wedding.venue?.address || `${wedding.venue?.area || 'Bali'}, Indonesia`
        }
      },

      organizer: {
        '@type': 'Organization',
        name: 'Bali Love Wedding Planners',
        url: this.baseUrl,
        telephone: '+62 8113 8314 997',
        email: 'hello@bali.love'
      },

      maximumAttendeeCapacity: wedding.guestCount,

      offers: {
        '@type': 'Offer',
        description: 'Luxury wedding planning services in Bali',
        seller: {
          '@type': 'Organization',
          name: 'Bali Love Wedding Planners'
        }
      },

      image: wedding.images?.map(img => ({
        '@type': 'ImageObject', 
        url: img.url,
        description: img.alt || `${eventName} photo`
      })) || [],

      review: wedding.testimonial ? [{
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: wedding.brideName && wedding.groomName ? 
            `${wedding.brideName} & ${wedding.groomName}` : 'Wedding Couple'
        },
        reviewBody: wedding.testimonial,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1
        }
      }] : []
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate Product schema for wedding packages
   */
  generatePackageSchema(weddingPackage: {
    name: string;
    description?: string;
    basePrice?: number;
    currency?: string;
    guestCount?: { min?: number; max?: number };
    inclusions?: Array<{ category: string; items: string[] }>;
    venueOptions?: string[];
    reviews?: Array<{
      author: string;
      rating: number;
      text: string;
    }>;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: weddingPackage.name,
      description: weddingPackage.description || `${weddingPackage.name} - Comprehensive Bali wedding package with planning services`,
      
      category: 'Wedding Planning Services',
      brand: {
        '@type': 'Brand',
        name: 'Bali Love Wedding Planners'
      },

      offers: {
        '@type': 'Offer',
        price: weddingPackage.basePrice || 0,
        priceCurrency: weddingPackage.currency || 'USD',
        availability: 'https://schema.org/InStock',
        priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 year
        seller: {
          '@type': 'Organization',
          name: 'Bali Love Wedding Planners',
          url: this.baseUrl
        },
        description: weddingPackage.guestCount?.min && weddingPackage.guestCount?.max ? 
          `Wedding package for ${weddingPackage.guestCount.min}-${weddingPackage.guestCount.max} guests` :
          'Luxury Bali wedding package'
      },

      additionalProperty: weddingPackage.inclusions?.map(inclusion => ({
        '@type': 'PropertyValue',
        name: inclusion.category,
        value: inclusion.items.join(', ')
      })) || [],

      serviceArea: {
        '@type': 'Place',
        name: 'Bali, Indonesia'
      },

      review: weddingPackage.reviews?.map(review => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: review.author
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: review.rating,
          bestRating: 5,
          worstRating: 1
        },
        reviewBody: review.text
      })) || [],

      aggregateRating: weddingPackage.reviews?.length ? {
        '@type': 'AggregateRating',
        ratingValue: weddingPackage.reviews.reduce((sum, r) => sum + r.rating, 0) / weddingPackage.reviews.length,
        reviewCount: weddingPackage.reviews.length,
        bestRating: 5,
        worstRating: 1
      } : undefined
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate Review schema for testimonials
   */
  generateTestimonialSchema(testimonial: {
    coupleName: string;
    rating: number;
    text: string;
    date: string;
    venue?: { name: string; area: string };
    weddingPackage?: string;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Review',
      
      author: {
        '@type': 'Person',
        name: testimonial.coupleName
      },

      reviewRating: {
        '@type': 'Rating',
        ratingValue: testimonial.rating,
        bestRating: 5,
        worstRating: 1
      },

      reviewBody: testimonial.text,
      datePublished: testimonial.date,

      itemReviewed: {
        '@type': 'Service',
        name: 'Bali Wedding Planning Services',
        provider: {
          '@type': 'Organization',
          name: 'Bali Love Wedding Planners',
          url: this.baseUrl
        },
        serviceType: 'Wedding Planning',
        areaServed: 'Bali, Indonesia'
      }
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate Organization schema for company pages
   */
  generateOrganizationSchema(company: {
    name: string;
    description: string;
    foundedYear?: number;
    totalWeddings?: number;
    yearsExperience?: number;
    contactInfo?: {
      email?: string;
      phone?: string;
      whatsapp?: string;
      address?: string;
    };
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      youtube?: string;
    };
    teamMembers?: Array<{
      name: string;
      jobRole: string;
      image?: string;
    }>;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      '@id': `${this.baseUrl}#organization`,
      
      name: company.name,
      alternateName: 'Bali Love',
      description: company.description,
      url: this.baseUrl,
      
      foundingDate: company.foundedYear ? `${company.foundedYear}-01-01` : undefined,
      
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: company.contactInfo?.phone,
        email: company.contactInfo?.email,
        contactType: 'customer service',
        areaServed: 'Bali, Indonesia',
        availableLanguage: ['English', 'Indonesian']
      },

      address: {
        '@type': 'PostalAddress',
        addressCountry: 'ID',
        addressRegion: 'Bali',
        addressLocality: 'Seminyak',
        streetAddress: company.contactInfo?.address || 'Seminyak, Bali, Indonesia'
      },

      sameAs: Object.values(company.socialMedia || {}).filter(Boolean),

      employee: company.teamMembers?.map(member => ({
        '@type': 'Person',
        name: member.name,
        jobTitle: member.jobRole,
        worksFor: {
          '@type': 'Organization',
          name: company.name
        },
        image: member.image
      })) || [],

      serviceArea: {
        '@type': 'Place',
        name: 'Bali, Indonesia'
      },

      makesOffer: {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: 'Wedding Planning Services',
          description: 'Luxury destination wedding planning in Bali'
        }
      }
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate FAQ schema for common wedding questions
   */
  generateWeddingFAQSchema(faqs: Array<{
    question: string;
    answer: string;
  }>): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate BreadcrumbList schema for navigation
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{
    name: string;
    url: string;
    position: number;
  }>): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map(crumb => ({
        '@type': 'ListItem',
        position: crumb.position,
        name: crumb.name,
        item: `${this.baseUrl}${crumb.url}`
      }))
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate WebSite schema with search functionality
   */
  generateWebsiteSchema(website: {
    name: string;
    description: string;
    hasSearchAction?: boolean;
  }): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${this.baseUrl}#website`,
      
      name: website.name,
      description: website.description,
      url: this.baseUrl,
      
      publisher: {
        '@type': 'Organization',
        '@id': `${this.baseUrl}#organization`,
        name: website.name
      },

      potentialAction: website.hasSearchAction ? {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.baseUrl}/search?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      } : undefined
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Generate rich snippet data for wedding packages
   */
  generatePriceRangeSchema(packages: Array<{
    name: string;
    minPrice: number;
    maxPrice: number;
    currency: string;
    guestCount: number;
  }>): string {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Bali Wedding Package Pricing',
      description: 'Complete pricing guide for Bali destination wedding packages',
      
      itemListElement: packages.map((pkg, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Product',
          name: pkg.name,
          offers: {
            '@type': 'Offer',
            price: pkg.minPrice,
            highPrice: pkg.maxPrice,
            priceCurrency: pkg.currency,
            description: `Wedding package for ${pkg.guestCount} guests`
          }
        }
      }))
    };

    return JSON.stringify(schema, null, 2);
  }

  /**
   * Comprehensive schema generator for different page types
   */
  generatePageSchema(pageData: {
    type: 'venue' | 'event' | 'package' | 'business' | 'testimonial';
    data: any;
    breadcrumbs?: Array<{ name: string; url: string; position: number }>;
  }): string {
    switch (pageData.type) {
      case 'venue':
        return this.generateVenueSchema(pageData.data);
      case 'event':
        return this.generateWeddingEventSchema(pageData.data);
      case 'package':
        return this.generatePackageSchema(pageData.data);
      case 'business':
        return this.generateOrganizationSchema(pageData.data);
      case 'testimonial':
        return this.generateTestimonialSchema(pageData.data);
      default:
        return '{}';
    }
  }

  /**
   * Generate combined schema for complex pages
   */
  generateCombinedSchema(schemas: string[]): string {
    const validSchemas = schemas.filter(schema => schema !== '{}');
    
    if (validSchemas.length === 0) {
      return '{}';
    }

    if (validSchemas.length === 1) {
      return validSchemas[0];
    }

    // Combine multiple schemas into graph
    const parsedSchemas = validSchemas.map(schema => JSON.parse(schema));
    
    const combined = {
      '@context': 'https://schema.org',
      '@graph': parsedSchemas
    };

    return JSON.stringify(combined, null, 2);
  }

  /**
   * Validate schema markup
   */
  validateSchema(schema: string): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
  } {
    const errors: string[] = [];
    const warnings: string[] = [];

    try {
      const parsed = JSON.parse(schema);
      
      // Basic validation
      if (!parsed['@context']) {
        errors.push('Missing @context');
      }
      if (!parsed['@type']) {
        errors.push('Missing @type');
      }
      
      // Check for required fields based on type
      if (parsed['@type'] === 'LocalBusiness') {
        if (!parsed.name) errors.push('LocalBusiness missing name');
        if (!parsed.address) warnings.push('LocalBusiness missing address');
      }

      if (parsed['@type'] === 'Event') {
        if (!parsed.name) errors.push('Event missing name');
        if (!parsed.startDate) warnings.push('Event missing startDate');
        if (!parsed.location) errors.push('Event missing location');
      }

      return {
        isValid: errors.length === 0,
        errors,
        warnings
      };

    } catch (e) {
      return {
        isValid: false,
        errors: ['Invalid JSON structure'],
        warnings: []
      };
    }
  }

  /**
   * Get schema recommendations for page
   */
  getSchemaRecommendations(pageType: string, hasExistingSchema: boolean): Array<{
    schemaType: string;
    priority: 'high' | 'medium' | 'low';
    benefit: string;
    implementation: string;
  }> {
    const recommendations = [];

    if (pageType === 'venue') {
      recommendations.push(
        {
          schemaType: 'Place + EventVenue',
          priority: 'high' as const,
          benefit: 'Venue appears in local search and maps',
          implementation: 'Add location data, capacity, amenities, and reviews'
        },
        {
          schemaType: 'AggregateRating',
          priority: 'high' as const,
          benefit: 'Star ratings appear in search results',
          implementation: 'Include customer review ratings and counts'
        }
      );
    }

    if (pageType === 'event') {
      recommendations.push(
        {
          schemaType: 'Event',
          priority: 'medium' as const,
          benefit: 'Wedding stories appear in event searches',
          implementation: 'Add wedding date, location, and couple information'
        }
      );
    }

    if (pageType === 'package') {
      recommendations.push(
        {
          schemaType: 'Product + Offer',
          priority: 'high' as const,
          benefit: 'Pricing appears in search results',
          implementation: 'Include package pricing, inclusions, and availability'
        }
      );
    }

    return recommendations;
  }
}

export const structuredDataGenerator = new StructuredDataGenerator();