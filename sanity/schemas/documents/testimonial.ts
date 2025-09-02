import { HeartIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Testimonial Schema
 * 
 * Client testimonials and reviews for social proof
 * and building trust with prospective couples
 */

export default defineType({
  name: "testimonial",
  title: "Testimonial",
  icon: HeartIcon,
  type: "document",
  fields: [
    defineField({
      name: "coupleName",
      title: "Couple Names",
      type: "string",
      description: "e.g., 'Sarah & James' or 'The Smiths'",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "coupleName",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "testimonialText",
      title: "Testimonial",
      type: "text",
      description: "The testimonial quote",
      validation: (rule) => rule.required().min(50),
    }),
    defineField({
      name: "rating",
      title: "Star Rating",
      type: "number",
      validation: (rule) => rule.required().min(1).max(5).integer(),
      initialValue: 5,
    }),
    defineField({
      name: "couplePhoto",
      title: "Couple Photo",
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
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.couplePhoto as any)?.asset?._ref && !alt) {
                return "Required";
              }
              return true;
            });
          },
        }),
      ],
    }),
    defineField({
      name: "weddingDetails",
      title: "Wedding Details",
      type: "object",
      fields: [
        defineField({
          name: "weddingDate",
          title: "Wedding Date",
          type: "date",
        }),
        defineField({
          name: "venue",
          title: "Wedding Venue",
          type: "reference",
          to: [{ type: "venue" }],
        }),
        defineField({
          name: "guestCount",
          title: "Number of Guests",
          type: "number",
        }),
        defineField({
          name: "packageUsed",
          title: "Package Used",
          type: "reference",
          to: [{ type: "weddingPackage" }],
        }),
        defineField({
          name: "weddingStyle",
          title: "Wedding Style",
          type: "string",
          options: {
            list: [
              { title: "Beach Wedding", value: "beach" },
              { title: "Clifftop Ceremony", value: "clifftop" },
              { title: "Villa Wedding", value: "villa" },
              { title: "Garden Wedding", value: "garden" },
              { title: "Traditional Balinese", value: "traditional-balinese" },
              { title: "Modern Luxury", value: "modern-luxury" },
              { title: "Intimate Elopement", value: "elopement" },
              { title: "Resort Wedding", value: "resort" },
            ],
          },
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: "coupleLocation",
      title: "Couple's Location",
      type: "string",
      description: "Where the couple is from, e.g., 'Sydney, Australia'",
    }),
    defineField({
      name: "plannerAssigned",
      title: "Wedding Planner",
      type: "reference",
      to: [{ type: "teamMember" }],
      description: "Who was their main planner",
    }),
    defineField({
      name: "highlights",
      title: "Wedding Highlights",
      type: "array",
      of: [{ type: "string" }],
      description: "What made their wedding special",
      options: {
        list: [
          { title: "Sunset Ceremony", value: "sunset-ceremony" },
          { title: "Traditional Blessing", value: "traditional-blessing" },
          { title: "Fire Dancing", value: "fire-dancing" },
          { title: "Live Band", value: "live-band" },
          { title: "Floating Breakfast", value: "floating-breakfast" },
          { title: "Helicopter Entrance", value: "helicopter-entrance" },
          { title: "Beach Reception", value: "beach-reception" },
          { title: "Fireworks Display", value: "fireworks" },
          { title: "Traditional Dancers", value: "traditional-dancers" },
          { title: "Flower Petals Ceremony", value: "flower-petals" },
        ],
      },
    }),
    defineField({
      name: "videoTestimonial",
      title: "Video Testimonial",
      type: "url",
      description: "Link to video testimonial (YouTube, Vimeo, etc.)",
    }),
    defineField({
      name: "featured",
      title: "Featured Testimonial",
      type: "boolean",
      description: "Show on homepage and key pages",
      initialValue: false,
    }),
    defineField({
      name: "publishedDate",
      title: "Published Date",
      type: "date",
      description: "When this testimonial was received",
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: "platform",
      title: "Review Platform",
      type: "string",
      options: {
        list: [
          { title: "Google Reviews", value: "google" },
          { title: "TripAdvisor", value: "tripadvisor" },
          { title: "Wedding Wire", value: "wedding-wire" },
          { title: "The Knot", value: "the-knot" },
          { title: "Facebook", value: "facebook" },
          { title: "Instagram", value: "instagram" },
          { title: "Direct Feedback", value: "direct" },
          { title: "Email", value: "email" },
        ],
      },
    }),
    defineField({
      name: "reviewUrl",
      title: "Original Review URL",
      type: "url",
      description: "Link to the original review",
    }),
  ],
  orderings: [
    {
      title: "Newest First",
      name: "publishedDateDesc",
      by: [{ field: "publishedDate", direction: "desc" }],
    },
    {
      title: "Highest Rating",
      name: "ratingDesc",
      by: [{ field: "rating", direction: "desc" }],
    },
    {
      title: "Featured First",
      name: "featuredFirst",
      by: [
        { field: "featured", direction: "desc" },
        { field: "publishedDate", direction: "desc" },
      ],
    },
  ],
  preview: {
    select: {
      title: "coupleName",
      rating: "rating",
      venue: "weddingDetails.venue.name",
      date: "weddingDetails.weddingDate",
      media: "couplePhoto",
      featured: "featured",
    },
    prepare({ title, rating, venue, date, media, featured }) {
      const stars = "⭐".repeat(rating || 5);
      
      return {
        title: featured ? `💎 ${title}` : title,
        subtitle: `${stars} • ${venue || "Venue TBD"}${date ? ` • ${date}` : ""}`,
        media,
      };
    },
  },
});