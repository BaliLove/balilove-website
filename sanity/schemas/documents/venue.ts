import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Wedding Venue Schema
 * 
 * Designed for luxury Bali wedding venues with comprehensive
 * details for couples and wedding planners
 */

export default defineType({
  name: "venue",
  title: "Wedding Venue",
  icon: HomeIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Venue Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly version of the venue name",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "string",
      description: "Short compelling description",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed venue description for couples",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: "alt",
        },
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Important for SEO and accessibility",
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.heroImage as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      description: "Venue photo gallery with categories and display options",
      of: [
        defineArrayMember({
          type: "object",
          name: "galleryImage",
          title: "Gallery Image",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { 
                hotspot: true,
                aiAssist: {
                  imageDescriptionField: "alt",
                },
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
              description: "Important for SEO and accessibility",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption displayed with the image",
            }),
            defineField({
              name: "category",
              title: "Photo Category",
              type: "string",
              options: {
                list: [
                  { title: "Ceremony Space", value: "ceremony" },
                  { title: "Reception Area", value: "reception" },
                  { title: "Accommodation", value: "accommodation" },
                  { title: "Venue Grounds", value: "grounds" },
                  { title: "Dining Areas", value: "dining" },
                  { title: "Bridal Suite", value: "bridal-suite" },
                  { title: "Sunset Views", value: "sunset" },
                  { title: "Architecture", value: "architecture" },
                ],
              },
              initialValue: "grounds",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "featured",
              title: "Featured Image",
              type: "boolean",
              description: "Show in featured galleries and homepage",
              initialValue: false,
            }),
            defineField({
              name: "displayOrder",
              title: "Display Order",
              type: "number",
              description: "Lower numbers appear first (1, 2, 3...)",
              initialValue: 1,
            }),
          ],
          preview: {
            select: {
              title: "caption",
              subtitle: "category",
              media: "image",
              featured: "featured",
            },
            prepare({ title, subtitle, media, featured }) {
              return {
                title: featured ? `⭐ ${title || "Gallery Image"}` : (title || "Gallery Image"),
                subtitle: subtitle ? subtitle.replace("-", " ").toUpperCase() : "VENUE IMAGE",
                media,
              };
            },
          },
        }),
      ],
      options: {
        layout: "grid",
        sortable: true,
      },
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      fields: [
        defineField({
          name: "area",
          title: "Area",
          type: "string",
          description: "e.g., Uluwatu, Seminyak, Ubud",
          options: {
            list: [
              { title: "Uluwatu", value: "uluwatu" },
              { title: "Seminyak", value: "seminyak" },
              { title: "Ubud", value: "ubud" },
              { title: "Canggu", value: "canggu" },
              { title: "Sanur", value: "sanur" },
              { title: "Jimbaran", value: "jimbaran" },
              { title: "Nusa Dua", value: "nusa-dua" },
              { title: "Tabanan", value: "tabanan" },
            ],
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "address",
          title: "Full Address",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "coordinates",
          title: "GPS Coordinates",
          type: "geopoint",
          description: "For map integration",
        }),
      ],
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "object",
      fields: [
        defineField({
          name: "seated",
          title: "Seated Guests",
          type: "number",
          description: "Maximum seated reception capacity",
        }),
        defineField({
          name: "cocktail",
          title: "Cocktail Style",
          type: "number",
          description: "Standing cocktail party capacity",
        }),
        defineField({
          name: "ceremony",
          title: "Ceremony",
          type: "number",
          description: "Wedding ceremony seating capacity",
        }),
      ],
    }),
    defineField({
      name: "venueType",
      title: "Venue Type",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Beach Club", value: "beach-club" },
          { title: "Clifftop", value: "clifftop" },
          { title: "Villa", value: "villa" },
          { title: "Resort", value: "resort" },
          { title: "Garden", value: "garden" },
          { title: "Rooftop", value: "rooftop" },
          { title: "Beachfront", value: "beachfront" },
          { title: "Temple", value: "temple" },
          { title: "Restaurant", value: "restaurant" },
        ],
      },
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "object",
      fields: [
        defineField({
          name: "min",
          title: "Minimum Price",
          type: "number",
          description: "Starting price in USD",
        }),
        defineField({
          name: "max",
          title: "Maximum Price",
          type: "number",
          description: "Maximum price in USD",
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          initialValue: "USD",
          options: {
            list: ["USD", "IDR", "EUR", "GBP", "AUD"],
          },
        }),
        defineField({
          name: "priceNote",
          title: "Price Note",
          type: "string",
          description: "Additional pricing context",
        }),
      ],
    }),
    defineField({
      name: "amenities",
      title: "Amenities & Features",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Ocean View", value: "ocean-view" },
          { title: "Sunset View", value: "sunset-view" },
          { title: "Air Conditioning", value: "air-conditioning" },
          { title: "Bridal Suite", value: "bridal-suite" },
          { title: "Parking", value: "parking" },
          { title: "Sound System", value: "sound-system" },
          { title: "Dance Floor", value: "dance-floor" },
          { title: "Kitchen Access", value: "kitchen-access" },
          { title: "Photography Areas", value: "photography-areas" },
          { title: "Wheelchair Accessible", value: "wheelchair-accessible" },
          { title: "Pool Access", value: "pool-access" },
          { title: "Garden Setting", value: "garden-setting" },
        ],
      },
    }),
    defineField({
      name: "restrictions",
      title: "Restrictions & Requirements",
      type: "array",
      of: [{ type: "block" }],
      description: "Important venue rules or limitations",
    }),
    defineField({
      name: "featured",
      title: "Featured Venue",
      type: "boolean",
      description: "Show on homepage and featured listings",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO Settings",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "SEO Title",
          type: "string",
          description: "Custom page title for search engines",
        }),
        defineField({
          name: "description",
          title: "SEO Description",
          type: "text",
          description: "Meta description for search results",
          validation: (rule) => rule.max(160),
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "location.area",
      media: "heroImage",
      featured: "featured",
    },
    prepare({ title, subtitle, media, featured }) {
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: subtitle ? `${subtitle} • Bali` : "Bali",
        media,
      };
    },
  },
});