/**
 * Bali Love Sanity Migration Script
 * Transforms scraped content into Sanity CMS format
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class BaliLoveSanityMigrator {
  constructor() {
    this.sanityDocuments = {
      pages: [],
      weddingPackages: [],
      venues: [],
      tours: [],
      testimonials: [],
      images: [],
      siteSettings: {},
      navigation: []
    };
  }

  generateId(prefix, text) {
    const slug = text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `${prefix}-${slug}`;
  }

  generateImageId(src) {
    const hash = crypto.createHash('md5').update(src).digest('hex');
    return `image-${hash.substring(0, 8)}`;
  }

  createPortableText(paragraphs) {
    if (!paragraphs || !Array.isArray(paragraphs)) return [];
    
    return paragraphs.map((text, index) => ({
      _type: 'block',
      _key: `block-${index}`,
      style: this.determineBlockStyle(text),
      children: [{
        _type: 'span',
        _key: `span-${index}`,
        text: text,
        marks: []
      }]
    }));
  }

  determineBlockStyle(text) {
    if (text.includes(':') && text.length < 100) return 'h3';
    if (text.length < 60 && text.toUpperCase() === text) return 'h2';
    if (text.includes('•') || text.includes('-')) return 'normal';
    return 'normal';
  }

  async loadScrapedData() {
    console.log('📂 Loading scraped content...');
    
    const scrapedDir = path.join(__dirname, 'scraped-content');
    const pagesFile = path.join(scrapedDir, 'pages.json');
    const imagesFile = path.join(scrapedDir, 'images.json');
    
    try {
      const pagesData = await fs.readFile(pagesFile, 'utf8');
      const imagesData = await fs.readFile(imagesFile, 'utf8');
      
      this.scrapedPages = JSON.parse(pagesData);
      this.scrapedImages = JSON.parse(imagesData);
      
      console.log(`✅ Loaded ${this.scrapedPages.length} pages and ${this.scrapedImages.length} images`);
      
    } catch (error) {
      console.error('❌ Error loading scraped data:', error.message);
      throw error;
    }
  }

  transformHomepage(page) {
    console.log('🏠 Transforming homepage...');
    
    return {
      _type: 'homepage',
      _id: 'homepage',
      title: page.title || 'Bali Love - Luxury Wedding Planning',
      slug: {
        _type: 'slug',
        current: 'home'
      },
      seo: {
        _type: 'seo',
        title: page.title,
        description: page.metaDescription || 'Beautifully curated, high-quality Bali wedding packages'
      },
      hero: this.extractHeroSection(page),
      content: this.createPortableText(page.paragraphs),
      images: this.transformImages(page.images),
      headings: page.headings || []
    };
  }

  extractHeroSection(page) {
    // Look for hero content in headings and first paragraphs
    const heroHeading = page.headings?.find(h => 
      h.text.includes('CELEBRATING LOVE') || 
      h.text.includes('BEAUTIFUL ISLAND') ||
      h.level === 'h1'
    );
    
    const heroSubtext = page.paragraphs?.find(p => 
      p.includes('wedding packages') ||
      p.includes('curated') ||
      p.length < 100
    );
    
    return {
      _type: 'hero',
      headline: heroHeading?.text || 'CELEBRATING LOVE in the BEAUTIFUL ISLAND of BALI',
      subheadline: heroSubtext || 'Beautifully curated, high-quality Bali wedding packages'
    };
  }

  transformPage(page) {
    const url = page.url.toLowerCase();
    let pageType = 'page';
    let slug = 'untitled';
    
    // Determine page type and slug from URL
    if (url.includes('/packages')) {
      pageType = 'weddingPackages';
      slug = 'packages';
    } else if (url.includes('/planning')) {
      pageType = 'page';
      slug = 'wedding-planning';
    } else if (url.includes('/venues')) {
      pageType = 'venues';
      slug = 'venues';
    } else if (url.includes('/tours')) {
      pageType = 'tours';
      slug = 'tours';
    } else if (url.includes('/about')) {
      pageType = 'page';
      slug = 'about';
    } else if (url.includes('/contact')) {
      pageType = 'page';
      slug = 'contact';
    }
    
    const baseDoc = {
      _type: pageType === 'weddingPackages' || pageType === 'venues' || pageType === 'tours' ? pageType : 'page',
      _id: this.generateId(pageType, page.title || slug),
      title: page.title || 'Untitled Page',
      slug: {
        _type: 'slug',
        current: slug
      },
      seo: {
        _type: 'seo',
        title: page.title,
        description: page.metaDescription
      },
      content: this.createPortableText(page.paragraphs),
      images: this.transformImages(page.images),
      headings: page.headings || [],
      originalUrl: page.url,
      migrationDate: new Date().toISOString()
    };

    // Add specific fields based on page type
    if (pageType === 'weddingPackages') {
      baseDoc.packages = this.extractPackageInfo(page);
    } else if (pageType === 'venues') {
      baseDoc.venueList = this.extractVenueInfo(page);
    } else if (pageType === 'tours') {
      baseDoc.tourInfo = this.extractTourInfo(page);
    }

    return baseDoc;
  }

  extractPackageInfo(page) {
    // Extract package information from content
    const packages = [];
    
    page.paragraphs?.forEach(text => {
      if (text.includes('package') || text.includes('includes') || text.includes('price')) {
        packages.push({
          _type: 'packageFeature',
          description: text
        });
      }
    });
    
    return packages;
  }

  extractVenueInfo(page) {
    // Extract venue information
    const venues = [];
    
    page.headings?.forEach(heading => {
      if (heading.level === 'h2' || heading.level === 'h3') {
        venues.push({
          _type: 'venueFeature',
          name: heading.text,
          description: ''
        });
      }
    });
    
    return venues;
  }

  extractTourInfo(page) {
    // Extract tour information
    const tours = [];
    
    page.lists?.forEach(list => {
      if (list.items.length > 0) {
        tours.push({
          _type: 'tourFeature',
          items: list.items
        });
      }
    });
    
    return tours;
  }

  transformImages(images) {
    if (!images || !Array.isArray(images)) return [];
    
    return images.map(img => ({
      _type: 'image',
      _key: this.generateImageId(img.src),
      asset: {
        _type: 'reference',
        _ref: this.generateImageId(img.src)
      },
      alt: img.alt || '',
      caption: img.title || '',
      originalSrc: img.src
    }));
  }

  async processAllContent() {
    console.log('🔄 Processing all scraped content...');
    
    for (const page of this.scrapedPages) {
      const url = page.url.toLowerCase();
      
      if (url === 'https://bali.love' || url.includes('#page')) {
        // Homepage
        const homepage = this.transformHomepage(page);
        this.sanityDocuments.pages.push(homepage);
      } else {
        // Other pages
        const transformedPage = this.transformPage(page);
        
        if (transformedPage._type === 'weddingPackages') {
          this.sanityDocuments.weddingPackages.push(transformedPage);
        } else if (transformedPage._type === 'venues') {
          this.sanityDocuments.venues.push(transformedPage);
        } else if (transformedPage._type === 'tours') {
          this.sanityDocuments.tours.push(transformedPage);
        } else {
          this.sanityDocuments.pages.push(transformedPage);
        }
      }
    }

    // Process images for Sanity import
    this.scrapedImages.forEach(img => {
      this.sanityDocuments.images.push({
        _type: 'sanity.imageAsset',
        _id: this.generateImageId(img.src),
        originalFilename: this.extractFilename(img.src),
        url: img.src,
        metadata: {
          alt: img.alt || '',
          title: img.title || '',
          width: img.width || null,
          height: img.height || null
        }
      });
    });

    console.log('📊 Content transformation complete:');
    console.log(`- Pages: ${this.sanityDocuments.pages.length}`);
    console.log(`- Wedding Packages: ${this.sanityDocuments.weddingPackages.length}`);
    console.log(`- Venues: ${this.sanityDocuments.venues.length}`);
    console.log(`- Tours: ${this.sanityDocuments.tours.length}`);
    console.log(`- Images: ${this.sanityDocuments.images.length}`);
  }

  extractFilename(url) {
    try {
      return path.basename(new URL(url).pathname) || 'unknown.jpg';
    } catch {
      return 'unknown.jpg';
    }
  }

  async generateSanityImportFiles() {
    console.log('📦 Generating Sanity import files...');
    
    const outputDir = path.join(__dirname, 'sanity-import');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate NDJSON files for each content type
    const contentTypes = ['pages', 'weddingPackages', 'venues', 'tours', 'images'];
    
    for (const type of contentTypes) {
      const documents = this.sanityDocuments[type];
      if (documents && documents.length > 0) {
        const ndjson = documents.map(doc => JSON.stringify(doc)).join('\n');
        await fs.writeFile(path.join(outputDir, `${type}.ndjson`), ndjson);
        console.log(`✅ Created ${type}.ndjson (${documents.length} documents)`);
      }
    }

    // Create complete migration file
    await fs.writeFile(
      path.join(outputDir, 'complete-migration.json'),
      JSON.stringify(this.sanityDocuments, null, 2)
    );

    // Create Sanity schemas for the content
    const schemas = this.generateSanitySchemas();
    await fs.writeFile(
      path.join(outputDir, 'sanity-schemas.js'),
      schemas
    );

    console.log('📁 Import files saved to sanity-import/');
  }

  generateSanitySchemas() {
    return `// Sanity Schemas for Bali Love Website
// Add these to your sanity/schemas/ directory

export const homepage = {
  name: 'homepage',
  type: 'document',
  title: 'Homepage',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Page Title'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' }
    },
    {
      name: 'seo',
      type: 'object',
      title: 'SEO',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'Meta Description' }
      ]
    },
    {
      name: 'hero',
      type: 'object',
      title: 'Hero Section',
      fields: [
        { name: 'headline', type: 'string', title: 'Headline' },
        { name: 'subheadline', type: 'text', title: 'Subheadline' }
      ]
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{ type: 'block' }]
    },
    {
      name: 'images',
      type: 'array',
      title: 'Images',
      of: [{ type: 'image' }]
    }
  ]
};

export const weddingPackage = {
  name: 'weddingPackage',
  type: 'document',
  title: 'Wedding Package',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Package Name'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' }
    },
    {
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{ type: 'block' }]
    },
    {
      name: 'pricing',
      type: 'object',
      title: 'Pricing',
      fields: [
        { name: 'startingPrice', type: 'number', title: 'Starting Price' },
        { name: 'currency', type: 'string', title: 'Currency' },
        { name: 'priceNote', type: 'text', title: 'Pricing Notes' }
      ]
    },
    {
      name: 'inclusions',
      type: 'array',
      title: 'What\'s Included',
      of: [{ type: 'string' }]
    },
    {
      name: 'images',
      type: 'array',
      title: 'Gallery',
      of: [{ type: 'image' }]
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured Package'
    }
  ]
};

export const venue = {
  name: 'venue',
  type: 'document',
  title: 'Wedding Venue',
  fields: [
    {
      name: 'name',
      type: 'string',
      title: 'Venue Name'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'name' }
    },
    {
      name: 'location',
      type: 'string',
      title: 'Location'
    },
    {
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{ type: 'block' }]
    },
    {
      name: 'amenities',
      type: 'array',
      title: 'Amenities',
      of: [{ type: 'string' }]
    },
    {
      name: 'capacity',
      type: 'object',
      title: 'Capacity',
      fields: [
        { name: 'ceremony', type: 'number', title: 'Ceremony Guests' },
        { name: 'reception', type: 'number', title: 'Reception Guests' }
      ]
    },
    {
      name: 'images',
      type: 'array',
      title: 'Gallery',
      of: [{ type: 'image' }]
    },
    {
      name: 'priceRange',
      type: 'string',
      title: 'Price Range'
    },
    {
      name: 'featured',
      type: 'boolean',
      title: 'Featured Venue'
    }
  ]
};

export const tour = {
  name: 'tour',
  type: 'document',
  title: 'Wedding Tour',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Tour Name'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' }
    },
    {
      name: 'description',
      type: 'array',
      title: 'Description',
      of: [{ type: 'block' }]
    },
    {
      name: 'duration',
      type: 'string',
      title: 'Duration'
    },
    {
      name: 'highlights',
      type: 'array',
      title: 'Tour Highlights',
      of: [{ type: 'string' }]
    },
    {
      name: 'images',
      type: 'array',
      title: 'Gallery',
      of: [{ type: 'image' }]
    },
    {
      name: 'pricing',
      type: 'object',
      title: 'Pricing',
      fields: [
        { name: 'price', type: 'number', title: 'Price' },
        { name: 'currency', type: 'string', title: 'Currency' },
        { name: 'notes', type: 'text', title: 'Pricing Notes' }
      ]
    }
  ]
};

export const page = {
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Page Title'
    },
    {
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      options: { source: 'title' }
    },
    {
      name: 'seo',
      type: 'object',
      title: 'SEO',
      fields: [
        { name: 'title', type: 'string', title: 'SEO Title' },
        { name: 'description', type: 'text', title: 'Meta Description' }
      ]
    },
    {
      name: 'content',
      type: 'array',
      title: 'Content',
      of: [{ type: 'block' }, { type: 'image' }]
    },
    {
      name: 'images',
      type: 'array',
      title: 'Gallery',
      of: [{ type: 'image' }]
    }
  ]
};

// Export all schemas
export const schemaTypes = [homepage, weddingPackage, venue, tour, page];
`;
  }

  async migrate() {
    try {
      await this.loadScrapedData();
      
      console.log('🔄 Transforming content to Sanity format...');
      
      // Process each page
      for (const page of this.scrapedPages) {
        const url = page.url.toLowerCase();
        
        if (url === 'https://bali.love' || url.includes('#page')) {
          // Homepage
          const homepage = this.transformHomepage(page);
          this.sanityDocuments.pages.push(homepage);
        } else if (!url.includes('app.bali.love')) {
          // Regular pages (skip login app)
          const transformedPage = this.transformPage(page);
          
          switch (transformedPage._type) {
            case 'weddingPackages':
              this.sanityDocuments.weddingPackages.push(transformedPage);
              break;
            case 'venues':
              this.sanityDocuments.venues.push(transformedPage);
              break;
            case 'tours':
              this.sanityDocuments.tours.push(transformedPage);
              break;
            default:
              this.sanityDocuments.pages.push(transformedPage);
          }
        }
      }

      // Process images
      this.scrapedImages.forEach(img => {
        this.sanityDocuments.images.push({
          _type: 'sanity.imageAsset',
          _id: this.generateImageId(img.src),
          originalFilename: this.extractFilename(img.src),
          url: img.src,
          metadata: {
            alt: img.alt || '',
            width: img.width || null,
            height: img.height || null
          }
        });
      });

      await this.generateSanityImportFiles();
      await this.createImportInstructions();
      
      console.log('🎉 Migration completed successfully!');
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      throw error;
    }
  }

  extractFilename(url) {
    try {
      return path.basename(new URL(url).pathname) || 'image.jpg';
    } catch {
      return 'image.jpg';
    }
  }

  async createImportInstructions() {
    const instructions = `# Bali Love Sanity Import Instructions

## 📋 Migration Summary
- **${this.sanityDocuments.pages.length}** pages transformed
- **${this.sanityDocuments.weddingPackages.length}** wedding package pages
- **${this.sanityDocuments.venues.length}** venue pages  
- **${this.sanityDocuments.tours.length}** tour pages
- **${this.sanityDocuments.images.length}** images to import

## 🚀 Import Process

### 1. Update Sanity Schemas
Copy the schemas from \`sanity-schemas.js\` to your \`sanity/schemas/\` directory and add to your schema configuration.

### 2. Import Content
\`\`\`bash
# Install Sanity CLI (if not already installed)
npm install -g @sanity/cli

# Import each content type
sanity dataset import pages.ndjson production
sanity dataset import weddingPackages.ndjson production
sanity dataset import venues.ndjson production
sanity dataset import tours.ndjson production
\`\`\`

### 3. Image Migration
Images will need to be uploaded to Sanity's CDN. You can:
- Use Sanity's image upload API
- Upload manually through Sanity Studio
- Use the migration script with asset upload functionality

### 4. Content Review
After import:
- ✅ Review content formatting in Sanity Studio
- ✅ Verify image references
- ✅ Check SEO metadata
- ✅ Test content relationships
- ✅ Validate slugs and URLs

## 🎯 Next Steps
1. Configure Sanity project with these schemas
2. Import content using the NDJSON files
3. Upload and link image assets
4. Begin frontend development with migrated content

## 📊 Content Types Created
- **Homepage**: Hero section + main content
- **Wedding Packages**: Package information and pricing
- **Venues**: Venue details and galleries
- **Tours**: Tour information and highlights  
- **Pages**: About, Contact, and other static pages

Your complete bali.love website is now ready for Sanity import! 🏝️✨
`;

    await fs.writeFile(
      path.join(__dirname, 'sanity-import', 'IMPORT_INSTRUCTIONS.md'),
      instructions
    );

    console.log('📖 Import instructions created');
  }
}

// Run migration
if (require.main === module) {
  const migrator = new BaliLoveSanityMigrator();
  migrator.migrate();
}

module.exports = { BaliLoveSanityMigrator };