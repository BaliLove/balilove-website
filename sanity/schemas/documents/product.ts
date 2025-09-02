import { PackageIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Wedding Product Schema
 * 
 * Products and services for wedding wishlist templates
 * with complex buy/sell pricing structure
 */

export default defineType({
  name: "product",
  title: "Wedding Product",
  icon: PackageIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "URL-friendly version of the product name",
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
      description: "Detailed product description",
    }),
    defineField({
      name: "vendorTradingName",
      title: "Vendor Trading Name",
      type: "string",
      description: "Name of the vendor/supplier",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      description: "Product photo gallery",
      of: [
        defineArrayMember({
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
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "categories",
      title: "Product Categories",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Photography & Video", value: "photography" },
          { title: "Music & Entertainment", value: "entertainment" },
          { title: "Flowers & Styling", value: "styling" },
          { title: "Catering & Bar", value: "catering" },
          { title: "Transportation", value: "transportation" },
          { title: "Venue Services", value: "venue-services" },
          { title: "Beauty & Wellness", value: "beauty" },
          { title: "Décor & Rentals", value: "decor" },
          { title: "Wedding Planning", value: "planning" },
          { title: "Ceremony Services", value: "ceremony" },
        ],
      },
    }),
    defineField({
      name: "pricing",
      title: "Pricing Information",
      type: "object",
      fields: [
        defineField({
          name: "model",
          title: "Pricing Model",
          type: "string",
          options: {
            list: [
              { title: "Constant Price", value: "constant" },
              { title: "Variable Price (per person/night)", value: "variable" },
              { title: "Per Person", value: "per-person" },
              { title: "Per Night", value: "per-night" },
              { title: "Date-Based Variable", value: "date-variable" },
              { title: "Estimate Only", value: "estimate" },
              { title: "Contact for Price", value: "contact" },
              { title: "Venue Inclusion (Free)", value: "inclusion" },
            ],
          },
          initialValue: "constant",
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
          options: {
            list: ["IDR", "USD", "EUR", "GBP", "AUD"],
          },
          initialValue: "IDR",
        }),
        defineField({
          name: "constantPricing",
          title: "Constant Pricing",
          type: "object",
          hidden: ({ parent }) => parent?.model !== "constant",
          fields: [
            defineField({
              name: "buyPrice",
              title: "Buy Price (Wholesale)",
              type: "number",
              description: "Cost price in selected currency",
            }),
            defineField({
              name: "sellPrice",
              title: "Sell Price (Retail)",
              type: "number",
              description: "Client price in selected currency",
            }),
            defineField({
              name: "minQuantity",
              title: "Minimum Quantity",
              type: "number",
              initialValue: 1,
            }),
          ],
        }),
        defineField({
          name: "variablePricing",
          title: "Variable Pricing",
          type: "object",
          hidden: ({ parent }) => !["variable", "per-person", "per-night", "date-variable"].includes(parent?.model),
          fields: [
            defineField({
              name: "baseBuyPrice",
              title: "Base Buy Price",
              type: "number",
              description: "Base wholesale price per unit",
            }),
            defineField({
              name: "baseSellPrice",
              title: "Base Sell Price", 
              type: "number",
              description: "Base retail price per unit",
            }),
            defineField({
              name: "unitType",
              title: "Pricing Unit",
              type: "string",
              options: {
                list: [
                  { title: "Per Person/Guest", value: "per-person" },
                  { title: "Per Adult", value: "per-adult" },
                  { title: "Per Child", value: "per-child" },
                  { title: "Per Night", value: "per-night" },
                  { title: "Per Day", value: "per-day" },
                  { title: "Per Hour", value: "per-hour" },
                  { title: "Per Item", value: "per-item" },
                ],
              },
            }),
            defineField({
              name: "minimumUnits",
              title: "Minimum Units",
              type: "number",
              description: "Minimum nights, guests, etc.",
            }),
            defineField({
              name: "maximumUnits",
              title: "Maximum Units",
              type: "number",
              description: "Maximum nights, guests, etc.",
            }),
            defineField({
              name: "eventFees",
              title: "Additional Event Fees",
              type: "object",
              fields: [
                defineField({
                  name: "eventFeeBuy",
                  title: "Event Fee (Buy)",
                  type: "number",
                  description: "Additional wholesale event fee",
                }),
                defineField({
                  name: "eventFeeSell",
                  title: "Event Fee (Sell)",
                  type: "number", 
                  description: "Additional retail event fee",
                }),
                defineField({
                  name: "banjarFee",
                  title: "Banjar/Community Fee",
                  type: "number",
                  description: "Local community fee (common in Bali)",
                }),
              ],
            }),
            defineField({
              name: "dateModifiers",
              title: "Date-Based Price Modifiers",
              type: "array",
              description: "Different pricing for specific date ranges",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "dateModifier",
                  fields: [
                    defineField({
                      name: "startDate",
                      title: "Start Date",
                      type: "date",
                    }),
                    defineField({
                      name: "endDate", 
                      title: "End Date",
                      type: "date",
                    }),
                    defineField({
                      name: "modifier",
                      title: "Price Modifier",
                      type: "number",
                      description: "Multiplier (1.0 = normal, 1.5 = 50% increase)",
                    }),
                    defineField({
                      name: "label",
                      title: "Period Label",
                      type: "string",
                      description: "e.g., 'High Season', 'Holiday Period'",
                    }),
                  ],
                }),
              ],
            }),
            defineField({
              name: "quantityBreaks",
              title: "Quantity Break Pricing",
              type: "array",
              description: "Discounts for larger quantities",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "quantityBreak",
                  fields: [
                    defineField({
                      name: "minQuantity",
                      title: "Minimum Quantity",
                      type: "number",
                    }),
                    defineField({
                      name: "maxQuantity",
                      title: "Maximum Quantity", 
                      type: "number",
                    }),
                    defineField({
                      name: "discountPercentage",
                      title: "Discount Percentage",
                      type: "number",
                      description: "Percentage discount for this quantity range",
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
        defineField({
          name: "calculationNotes",
          title: "Pricing Calculation Notes",
          type: "text",
          description: "How to calculate final pricing (for complex products)",
        }),
        defineField({
          name: "isEstimateOnly",
          title: "Estimate Only",
          type: "boolean",
          description: "Price varies and requires custom quote",
          initialValue: false,
        }),
        defineField({
          name: "isVenueInclusion",
          title: "Venue Inclusion (Free)",
          type: "boolean",
          description: "Included with venue booking at no extra cost",
          initialValue: false,
        }),
        defineField({
          name: "priceNote",
          title: "Pricing Notes",
          type: "string",
          description: "Additional pricing context or conditions",
        }),
        defineField({
          name: "usdEquivalent",
          title: "USD Equivalent",
          type: "object",
          description: "Approximate USD conversion for reference",
          fields: [
            defineField({
              name: "basePriceUSD",
              title: "Base Price (USD)",
              type: "number",
              readOnly: true,
            }),
            defineField({
              name: "sampleCalculation",
              title: "Sample Calculation",
              type: "string",
              description: "Example: '50 guests × 3 nights = $XXX'",
              readOnly: true,
            }),
          ],
          options: {
            collapsible: true,
            collapsed: true,
          },
        }),
      ],
      options: {
        collapsible: true,
        collapsed: false,
      },
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "string",
      options: {
        list: [
          { title: "Always Available", value: "always" },
          { title: "Seasonal", value: "seasonal" },
          { title: "By Request", value: "request" },
          { title: "Limited Availability", value: "limited" },
        ],
      },
      initialValue: "always",
    }),
    defineField({
      name: "venues",
      title: "Available at Venues",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "venue" }],
        },
      ],
      description: "Venues where this product/service is available",
    }),
    defineField({
      name: "eventTypes",
      title: "Suitable Event Types",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Wedding Ceremony", value: "ceremony" },
          { title: "Reception", value: "reception" },
          { title: "Cocktail Hour", value: "cocktail" },
          { title: "Welcome Dinner", value: "welcome" },
          { title: "Rehearsal Dinner", value: "rehearsal" },
          { title: "Farewell Brunch", value: "farewell" },
        ],
      },
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Active", value: "active" },
          { title: "Archive", value: "archive" },
          { title: "Draft", value: "draft" },
        ],
      },
      initialValue: "active",
    }),
    defineField({
      name: "bubbleId",
      title: "Bubble ID",
      type: "string",
      description: "Original Bubble database ID for reference",
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
      subtitle: "vendorTradingName",
      media: "images.0",
      sellPrice: "pricing.sellPrice",
      currency: "pricing.currency",
    },
    prepare({ title, subtitle, media, sellPrice, currency }) {
      const price = sellPrice && currency ? 
        `${sellPrice.toLocaleString()} ${currency}` : 
        "Price on request";
      
      return {
        title: title,
        subtitle: `${subtitle} • ${price}`,
        media,
      };
    },
  },
});