/**
 * Dynamic Robots.txt Generation for Bali Love Wedding Website
 * 
 * Optimized robots.txt for wedding business with proper crawl guidance
 * and sitemap references for search engine optimization
 */

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'https://bali.love';

export async function GET() {
  const robotsContent = `# Robots.txt for Bali Love Wedding Planners
# Optimized for wedding venue and destination wedding searches

User-agent: *
Allow: /

# Allow all main content for wedding SEO
Allow: /venues/
Allow: /packages/
Allow: /real-weddings/
Allow: /team/
Allow: /testimonials/
Allow: /tours/
Allow: /about
Allow: /contact
Allow: /planning

# Allow static assets for performance
Allow: /images/
Allow: /_next/static/
Allow: /favicon.ico

# Disallow admin and development areas
Disallow: /studio/
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /sanity/

# Disallow draft and preview content
Disallow: /preview/
Disallow: /draft/
Disallow: /*?preview=*
Disallow: /*?draft=*

# Disallow search and filter parameters to avoid duplicate content
Disallow: /*?sort=*
Disallow: /*?filter=*
Disallow: /*?page=*

# Allow important wedding industry crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot  
Allow: /
Crawl-delay: 2

# Wedding industry specific crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Block aggressive crawlers to preserve server resources
User-agent: AhrefsBot
Crawl-delay: 10

User-agent: SemrushBot
Crawl-delay: 10

User-agent: MJ12bot
Crawl-delay: 10

# Sitemap references
Sitemap: ${DOMAIN}/sitemap.xml

# Additional sitemaps for future use
# Sitemap: ${DOMAIN}/sitemap-venues.xml
# Sitemap: ${DOMAIN}/sitemap-weddings.xml
# Sitemap: ${DOMAIN}/sitemap-packages.xml

# Wedding business optimization notes:
# - All venue and package pages are prioritized for crawling
# - Real wedding stories are allowed for long-tail SEO
# - Team and testimonial pages build authority and trust
# - Preview and admin areas are properly blocked
# - Crawl delays are set to be crawler-friendly while preserving resources`;

  return new Response(robotsContent, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
}