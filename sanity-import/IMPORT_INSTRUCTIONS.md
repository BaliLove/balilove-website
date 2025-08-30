# Bali Love Sanity Import Instructions

## 📋 Migration Summary
- **8** pages transformed
- **0** wedding package pages
- **0** venue pages  
- **0** tour pages
- **94** images to import

## 🚀 Import Process

### 1. Update Sanity Schemas
Copy the schemas from `sanity-schemas.js` to your `sanity/schemas/` directory and add to your schema configuration.

### 2. Import Content
```bash
# Install Sanity CLI (if not already installed)
npm install -g @sanity/cli

# Import each content type
sanity dataset import pages.ndjson production
sanity dataset import weddingPackages.ndjson production
sanity dataset import venues.ndjson production
sanity dataset import tours.ndjson production
```

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
