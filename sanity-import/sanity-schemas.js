// Sanity Schemas for Bali Love Website
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
      title: 'What's Included',
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
