import { HeartIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Real Wedding Event Schema
 * 
 * Showcases actual weddings planned by Bali Love with testimonials,
 * photo galleries, and venue relationships for SEO and social proof
 */

export default defineType({
  name: "realEvent",
  title: "Real Wedding",
  icon: HeartIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Wedding Title",
      type: "string",
      description: "e.g., 'Sarah & James - Villa Vedas Wedding'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly version for SEO",
      options: {
        source: "title",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "brideName",
      title: "Bride's Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "groomName",
      title: "Groom's Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "weddingDate",
      title: "Wedding Date",
      type: "date",
      description: "Actual wedding date",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "venue",
      title: "Wedding Venue",
      type: "reference",
      to: [{ type: "venue" }],
      description: "Link to the venue where this wedding took place",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      description: "Main wedding photo",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          description: "Include couple names and venue for SEO",
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
      title: "Wedding Photo Gallery",
      type: "array",
      description: "Additional wedding photos beyond the hero image",
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
                  { title: "Ceremony", value: "ceremony" },
                  { title: "Reception", value: "reception" },
                  { title: "Couple Portrait", value: "portrait" },
                  { title: "Details", value: "details" },
                  { title: "Venue", value: "grounds" },
                  { title: "Family & Friends", value: "guests" },
                ],
              },
              initialValue: "ceremony",
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
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title || "Wedding Photo",
                subtitle: subtitle || "Photo",
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "testimonialWritten",
      title: "Written Testimonial",
      type: "array",
      of: [{ type: "block" }],
      description: "Complete written testimonial from the couple",
    }),
    defineField({
      name: "highlightQuote",
      title: "Highlight Quote",
      type: "text",
      rows: 3,
      description: "Short memorable quote for cards and previews",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "guestCount",
      title: "Number of Guests",
      type: "number",
      description: "Total wedding guests",
    }),
    defineField({
      name: "weddingStyle",
      title: "Wedding Style/Theme",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Bohemian", value: "bohemian" },
          { title: "Classic Elegance", value: "classic-elegance" },
          { title: "Beach Chic", value: "beach-chic" },
          { title: "Tropical Paradise", value: "tropical-paradise" },
          { title: "Minimalist Modern", value: "minimalist-modern" },
          { title: "Romantic Garden", value: "romantic-garden" },
          { title: "Luxury Glamour", value: "luxury-glamour" },
          { title: "Cultural Fusion", value: "cultural-fusion" },
        ],
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Wedding",
      type: "boolean",
      description: "Show on homepage and featured sections",
      initialValue: false,
    }),
    defineField({
      name: "bubbleData",
      title: "Bubble Import Data",
      type: "object",
      description: "Original data from Bubble import for reference",
      fields: [
        defineField({
          name: "bubbleId",
          title: "Bubble ID",
          type: "string",
          description: "Original Bubble database ID",
        }),
        defineField({
          name: "eventCode",
          title: "Event Code",
          type: "string",
          description: "Original event code from Bubble",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
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
          description: "Custom page title",
          validation: (rule) => rule.max(60),
        }),
        defineField({
          name: "description",
          title: "SEO Description",
          type: "text",
          description: "Meta description including couple, venue, and highlights",
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
      title: "title",
      bride: "brideName",
      groom: "groomName",
      venue: "venue.name",
      media: "heroImage",
      featured: "featured",
      date: "weddingDate",
    },
    prepare({ title, bride, groom, venue, media, featured, date }) {
      const coupleNames = bride && groom ? `${bride} & ${groom}` : title;
      const subtitle = venue ? `${venue}${date ? ` • ${new Date(date).getFullYear()}` : ''}` : 'Real Wedding';
      
      return {
        title: featured ? `⭐ ${coupleNames}` : coupleNames,
        subtitle,
        media,
      };
    },
  },
});