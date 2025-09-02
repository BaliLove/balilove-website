import { DocumentsIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Wishlist Template Schema
 * 
 * Curated collections of wedding products and services
 * organized by venue type and package level
 */

export default defineType({
  name: "wishlistTemplate",
  title: "Wishlist Template",
  icon: DocumentsIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Template Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly version of the template name",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "What this template includes and who it's for",
    }),
    defineField({
      name: "templateType",
      title: "Template Type",
      type: "string",
      options: {
        list: [
          { title: "Villa Wedding", value: "villa" },
          { title: "Beach Club", value: "beach-club" },
          { title: "Clifftop Venue", value: "clifftop" },
          { title: "Resort Wedding", value: "resort" },
          { title: "Glamping Experience", value: "glamping" },
          { title: "Garden Wedding", value: "garden" },
          { title: "Full Service Package", value: "full-service" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "guestCount",
      title: "Recommended Guest Count",
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
          name: "optimal",
          title: "Optimal Guest Count",
          type: "number",
          description: "Ideal number for this template",
        }),
      ],
    }),
    defineField({
      name: "products",
      title: "Template Products",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "templateProduct",
          title: "Template Product",
          fields: [
            defineField({
              name: "product",
              title: "Product",
              type: "reference",
              to: [{ type: "product" }],
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "quantity",
              title: "Quantity",
              type: "number",
              initialValue: 1,
              validation: (rule) => rule.min(1),
            }),
            defineField({
              name: "isOptional",
              title: "Optional Item",
              type: "boolean",
              description: "Can be removed from package",
              initialValue: false,
            }),
            defineField({
              name: "category",
              title: "Template Category",
              type: "string",
              options: {
                list: [
                  { title: "Essential", value: "essential" },
                  { title: "Recommended", value: "recommended" },
                  { title: "Premium Add-on", value: "premium" },
                  { title: "Optional", value: "optional" },
                ],
              },
              initialValue: "recommended",
            }),
            defineField({
              name: "notes",
              title: "Template Notes",
              type: "string",
              description: "Special instructions or context for this item in the template",
            }),
          ],
          preview: {
            select: {
              title: "product.name",
              subtitle: "product.vendorTradingName",
              quantity: "quantity",
              category: "category",
              optional: "isOptional",
            },
            prepare({ title, subtitle, quantity, category, optional }) {
              const prefix = optional ? "🔵" : "⚫";
              const qtyText = quantity > 1 ? ` (${quantity}x)` : "";
              
              return {
                title: `${prefix} ${title}${qtyText}`,
                subtitle: `${subtitle} • ${category}`,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "estimatedPricing",
      title: "Template Pricing Summary",
      type: "object",
      description: "Calculated pricing totals for this template",
      fields: [
        defineField({
          name: "totalProducts",
          title: "Total Products",
          type: "number",
          readOnly: true,
        }),
        defineField({
          name: "totalBuyPrice",
          title: "Total Buy Price (IDR)",
          type: "number",
          description: "Sum of all wholesale prices",
          readOnly: true,
        }),
        defineField({
          name: "totalSellPrice", 
          title: "Total Sell Price (IDR)",
          type: "number",
          description: "Sum of all retail prices",
          readOnly: true,
        }),
        defineField({
          name: "totalSellPriceUSD",
          title: "Total Price (USD)",
          type: "number",
          description: "Approximate USD equivalent",
          readOnly: true,
        }),
        defineField({
          name: "averageMarkup",
          title: "Average Markup %",
          type: "number",
          readOnly: true,
        }),
        defineField({
          name: "priceRange",
          title: "Price Range Category",
          type: "string",
          options: {
            list: [
              { title: "Budget ($5,000-$15,000)", value: "budget" },
              { title: "Mid-Range ($15,000-$30,000)", value: "mid-range" },
              { title: "Premium ($30,000-$50,000)", value: "premium" },
              { title: "Luxury ($50,000+)", value: "luxury" },
            ],
          },
        }),
        defineField({
          name: "pricingComplexity",
          title: "Pricing Complexity Indicators",
          type: "object",
          description: "Flags for frontend pricing calculator",
          fields: [
            defineField({
              name: "hasVariablePricing",
              title: "Has Variable Pricing",
              type: "boolean",
              description: "Contains products with per-person or per-night pricing",
              readOnly: true,
            }),
            defineField({
              name: "hasDateBasedPricing",
              title: "Has Date-Based Pricing",
              type: "boolean", 
              description: "Contains products with seasonal/date modifiers",
              readOnly: true,
            }),
            defineField({
              name: "hasAccommodation",
              title: "Has Accommodation",
              type: "boolean",
              description: "Contains multi-night accommodation products",
              readOnly: true,
            }),
            defineField({
              name: "hasCatering",
              title: "Has Per-Person Catering",
              type: "boolean",
              description: "Contains per-person menu items",
              readOnly: true,
            }),
            defineField({
              name: "requiresGuestCount",
              title: "Requires Guest Count",
              type: "boolean",
              description: "Frontend should ask for guest numbers",
              readOnly: true,
            }),
            defineField({
              name: "requiresDateSelection",
              title: "Requires Date Selection", 
              type: "boolean",
              description: "Frontend should ask for event dates",
              readOnly: true,
            }),
            defineField({
              name: "requiresNightCount",
              title: "Requires Night Count",
              type: "boolean",
              description: "Frontend should ask for number of nights",
              readOnly: true,
            }),
          ],
          options: {
            collapsible: true,
            collapsed: true,
          },
        }),
        defineField({
          name: "lastUpdated",
          title: "Pricing Last Updated",
          type: "datetime",
          readOnly: true,
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: "suitableVenues",
      title: "Suitable Venues",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "venue" }],
        },
      ],
      description: "Venues where this template works well",
    }),
    defineField({
      name: "featured",
      title: "Featured Template",
      type: "boolean",
      description: "Show in featured template listings",
      initialValue: false,
    }),
    defineField({
      name: "bubbleId",
      title: "Bubble ID",
      type: "string",
      description: "Original Bubble wishlist ID for reference",
      readOnly: true,
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
      subtitle: "templateType",
      productCount: "estimatedPricing.totalProducts",
      totalPrice: "estimatedPricing.totalSellPriceUSD",
      featured: "featured",
    },
    prepare({ title, subtitle, productCount, totalPrice, featured }) {
      const price = totalPrice ? `$${totalPrice.toLocaleString()}` : "Price TBD";
      const products = productCount ? `${productCount} products` : "No products";
      
      return {
        title: featured ? `⭐ ${title}` : title,
        subtitle: `${subtitle} • ${products} • ${price}`,
      };
    },
  },
});