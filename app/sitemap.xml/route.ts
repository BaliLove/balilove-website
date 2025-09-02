/**
 * Dynamic Sitemap Generation for Bali Love Wedding Website
 * 
 * Generates comprehensive XML sitemap including all venues, real weddings,
 * packages, team members, and static pages with proper SEO prioritization
 */

import { client } from '@/sanity/lib/client';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://bali.love';

interface SitemapEntry {
  url: string;
  lastModified: Date;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export async function GET() {
  try {
    // Fetch all content from Sanity for sitemap
    const [venues, realEvents, packages, teamMembers, testimonials] = await Promise.all([
      // Venues with modification dates
      client.fetch(`
        *[_type == "venue" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt,
          featured,
          "area": location.area
        }
      `),
      
      // Real events/weddings
      client.fetch(`
        *[_type == "realEvent" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt,
          featured,
          weddingDate
        }
      `),
      
      // Wedding packages
      client.fetch(`
        *[_type == "weddingPackage" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt,
          featured,
          popular
        }
      `),
      
      // Team members
      client.fetch(`
        *[_type == "teamMember" && defined(slug.current) && isPublished == true] {
          "slug": slug.current,
          _updatedAt,
          featured
        }
      `),
      
      // Testimonials  
      client.fetch(`
        *[_type == "testimonial" && defined(slug.current)] {
          "slug": slug.current,
          _updatedAt,
          featured
        }
      `)
    ]);

    const sitemap: SitemapEntry[] = [];

    // Static pages with high priority
    const staticPages = [
      { url: '/', priority: 1.0, changeFreq: 'daily' as const },
      { url: '/venues', priority: 0.9, changeFreq: 'weekly' as const },
      { url: '/packages', priority: 0.9, changeFreq: 'weekly' as const },
      { url: '/about', priority: 0.8, changeFreq: 'monthly' as const },
      { url: '/contact', priority: 0.9, changeFreq: 'monthly' as const },
      { url: '/tours', priority: 0.7, changeFreq: 'monthly' as const },
      { url: '/real-weddings', priority: 0.8, changeFreq: 'weekly' as const },
      { url: '/planning', priority: 0.8, changeFreq: 'monthly' as const },
    ];

    staticPages.forEach(page => {
      sitemap.push({
        url: `${DOMAIN}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority
      });
    });

    // Venue pages (high commercial intent)
    venues.forEach((venue: any) => {
      sitemap.push({
        url: `${DOMAIN}/venues/${venue.slug}`,
        lastModified: new Date(venue._updatedAt),
        changeFrequency: 'weekly',
        priority: venue.featured ? 0.9 : 0.8 // Featured venues get higher priority
      });
    });

    // Real wedding pages (content marketing)
    realEvents.forEach((event: any) => {
      sitemap.push({
        url: `${DOMAIN}/real-weddings/${event.slug}`,
        lastModified: new Date(event._updatedAt),
        changeFrequency: 'monthly',
        priority: event.featured ? 0.7 : 0.6
      });
    });

    // Package pages (high commercial intent)
    packages.forEach((pkg: any) => {
      sitemap.push({
        url: `${DOMAIN}/packages/${pkg.slug}`,
        lastModified: new Date(pkg._updatedAt),
        changeFrequency: 'weekly',
        priority: pkg.popular ? 0.95 : pkg.featured ? 0.9 : 0.85
      });
    });

    // Team member pages (authority building)
    teamMembers.forEach((member: any) => {
      sitemap.push({
        url: `${DOMAIN}/team/${member.slug}`,
        lastModified: new Date(member._updatedAt),
        changeFrequency: 'monthly',
        priority: member.featured ? 0.6 : 0.5
      });
    });

    // Testimonial pages (social proof)
    testimonials.forEach((testimonial: any) => {
      sitemap.push({
        url: `${DOMAIN}/testimonials/${testimonial.slug}`,
        lastModified: new Date(testimonial._updatedAt),
        changeFrequency: 'yearly',
        priority: testimonial.featured ? 0.5 : 0.4
      });
    });

    // Area-specific landing pages (local SEO)
    const baliAreas = ['uluwatu', 'seminyak', 'ubud', 'canggu', 'sanur', 'jimbaran', 'nusa-dua'];
    baliAreas.forEach(area => {
      sitemap.push({
        url: `${DOMAIN}/venues/area/${area}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.75
      });
    });

    // Generate XML sitemap
    const xmlContent = generateSitemapXML(sitemap);

    return new Response(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap on error
    const basicSitemap = generateSitemapXML([
      {
        url: `${DOMAIN}/`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1.0
      }
    ]);

    return new Response(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
}

function generateSitemapXML(entries: SitemapEntry[]): string {
  const urlEntries = entries.map(entry => `
    <url>
      <loc>${entry.url}</loc>
      <lastmod>${entry.lastModified.toISOString()}</lastmod>
      <changefreq>${entry.changeFrequency}</changefreq>
      <priority>${entry.priority}</priority>
    </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urlEntries}
</urlset>`;
}