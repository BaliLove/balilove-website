import { PackageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Wedding Package Schema
 * 
 * Comprehensive packages for Bali weddings with transparent
 * pricing and detailed inclusions
 */

export default defineType({
  name: "weddingPackage",
  title: "Wedding Package",
  icon: PackageIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Package Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
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
      description: "Brief compelling description",
    }),
    defineField({
      name: "description",
      title: "Package Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed package overview for couples",
    }),
    defineField({
      name: "heroImage",
      title: "Package Image",
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
      name: "packageType",
      title: "Package Type",
      type: "string",
      options: {
        list: [
          { title: "Intimate (2-20 guests)", value: "intimate" },
          { title: "Traditional (21-80 guests)", value: "traditional" },
          { title: "Grand (81+ guests)", value: "grand" },
          { title: "Elopement (2 guests)", value: "elopement" },
          { title: "Custom", value: "custom" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guestCount",
      title: "Guest Count",
      type: "object",
      fields: [
        defineField({
          name: "min",
          title: "Minimum Guests",
          type: "number",
        }),
        defineField({
          name: "max",
          title: "Maximum Guests",
          type: "number",
        }),
        defineField({
          name: "included",
          title: "Guests Included in Base Price",
          type: "number",
        }),
        defineField({
          name: "additionalGuestCost",
          title: "Cost per Additional Guest",
          type: "number",
          description: "USD per person over included count",
        }),
      ],
    }),
    defineField({
      name: "pricing",
      title: "Package Pricing",
      type: "object",
      fields: [
        defineField({
          name: "basePrice",
          title: "Base Price",
          type: "number",
          description: "Starting price in USD",
          validation: (rule) => rule.required().min(0),
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
          name: "priceIncludes",
          title: "Base Price Includes",
          type: "string",
          description: "What's included in the base price",
        }),
        defineField({
          name: "paymentTerms",
          title: "Payment Terms",
          type: "array",
          of: [{ type: "block" }],
          description: "Payment schedule and terms",
        }),
      ],
    }),
    defineField({
      name: "inclusions",
      title: "Package Inclusions",
      type: "array",
      of: [
        defineArrayMember({
          name: "inclusionCategory",
          title: "Inclusion Category",
          type: "object",
          fields: [
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  { title: "Ceremony", value: "ceremony" },
                  { title: "Reception", value: "reception" },
                  { title: "Photography", value: "photography" },
                  { title: "Flowers & Decor", value: "flowers-decor" },
                  { title: "Music & Entertainment", value: "music" },
                  { title: "Food & Beverage", value: "food-beverage" },
                  { title: "Transportation", value: "transportation" },
                  { title: "Documentation", value: "documentation" },
                  { title: "Accommodation", value: "accommodation" },
                  { title: "Beauty & Spa", value: "beauty-spa" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "items",
              title: "Included Items",
              type: "array",
              of: [{ type: "string" }],
              description: "List all items included in this category",
            }),
            defineField({
              name: "notes",
              title: "Category Notes",
              type: "text",
              description: "Additional details or limitations",
            }),
          ],
          preview: {
            select: {
              title: "category",
              itemCount: "items.length",
            },
            prepare({ title, itemCount }) {
              return {
                title: title || "Untitled Category",
                subtitle: `${itemCount || 0} items included`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "optionalAddOns",
      title: "Optional Add-Ons",
      type: "array",
      of: [
        defineArrayMember({
          name: "addOn",
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Add-On Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "price",
              title: "Additional Cost",
              type: "number",
              description: "Cost in USD",
            }),
            defineField({
              name: "category",
              title: "Category",
              type: "string",
              options: {
                list: [
                  "Photography",
                  "Videography", 
                  "Flowers",
                  "Music",
                  "Transportation",
                  "Accommodation",
                  "Spa & Beauty",
                  "Dining",
                  "Entertainment",
                ],
              },
            }),
          ],
          preview: {
            select: {
              title: "name",
              price: "price",
              category: "category",
            },
            prepare({ title, price, category }) {
              return {
                title,
                subtitle: `$${price || 0} • ${category || "Uncategorized"}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "venueOptions",
      title: "Available Venues",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "venue" }],
        }),
      ],
      description: "Venues where this package can be hosted",
    }),
    defineField({
      name: "timeline",
      title: "Wedding Day Timeline",
      type: "array",
      of: [
        defineArrayMember({
          name: "timelineItem",
          type: "object",
          fields: [
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              description: "e.g., 2:00 PM",
            }),
            defineField({
              name: "activity",
              title: "Activity",
              type: "string",
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description: "e.g., 30 minutes",
            }),
            defineField({
              name: "notes",
              title: "Notes",
              type: "text",
            }),
          ],
          preview: {
            select: {
              time: "time",
              activity: "activity",
            },
            prepare({ time, activity }) {
              return {
                title: activity,
                subtitle: time,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "featured",
      title: "Featured Package",
      type: "boolean",
      description: "Highlight this package",
      initialValue: false,
    }),
    defineField({
      name: "popular",
      title: "Most Popular",
      type: "boolean",
      description: "Mark as most popular choice",
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
        }),
        defineField({
          name: "description",
          title: "SEO Description",
          type: "text",
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
      packageType: "packageType",
      basePrice: "pricing.basePrice",
      media: "heroImage",
      featured: "featured",
      popular: "popular",
    },
    prepare({ title, packageType, basePrice, media, featured, popular }) {
      let prefix = "";
      if (popular) prefix = "🔥 ";
      if (featured) prefix = "⭐ ";
      
      return {
        title: `${prefix}${title}`,
        subtitle: `${packageType || "Package"} • $${basePrice || 0}+`,
        media,
      };
    },
  },
});