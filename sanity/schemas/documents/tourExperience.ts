import { CalendarIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Tour & Experience Schema
 * 
 * Venue tours and wedding experiences offered to couples
 * to help them choose their perfect wedding location
 */

export default defineType({
  name: "tourExperience",
  title: "Tour & Experience",
  icon: CalendarIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Tour/Experience Name",
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
      name: "type",
      title: "Experience Type",
      type: "string",
      options: {
        list: [
          { title: "Venue Tour", value: "venue-tour" },
          { title: "Wedding Site Visit", value: "site-visit" },
          { title: "Consultation Meeting", value: "consultation" },
          { title: "Tasting Experience", value: "tasting" },
          { title: "Photography Session", value: "photo-session" },
          { title: "Cultural Experience", value: "cultural" },
          { title: "Spa & Wellness", value: "spa-wellness" },
          { title: "Adventure Activity", value: "adventure" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "array",
      of: [{ type: "block" }],
      description: "Detailed description of the tour or experience",
    }),
    defineField({
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      description: "Brief summary for cards and listings",
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: "heroImage",
      title: "Featured Image",
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
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
            }),
          ],
        }),
      ],
      options: {
        layout: "grid",
      },
    }),
    defineField({
      name: "duration",
      title: "Duration",
      type: "object",
      fields: [
        defineField({
          name: "hours",
          title: "Hours",
          type: "number",
        }),
        defineField({
          name: "minutes",
          title: "Minutes",
          type: "number",
        }),
        defineField({
          name: "fullDay",
          title: "Full Day Experience",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "multiDay",
          title: "Multi-Day Experience",
          type: "boolean",
          initialValue: false,
        }),
        defineField({
          name: "days",
          title: "Number of Days",
          type: "number",
          hidden: ({ document }) => !(document as any)?.duration?.multiDay,
        }),
      ],
    }),
    defineField({
      name: "itinerary",
      title: "Itinerary",
      type: "array",
      of: [
        defineArrayMember({
          name: "itineraryItem",
          type: "object",
          fields: [
            defineField({
              name: "time",
              title: "Time",
              type: "string",
              description: "e.g., 10:00 AM",
            }),
            defineField({
              name: "activity",
              title: "Activity",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "location",
              title: "Location",
              type: "string",
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description: "e.g., 45 minutes",
            }),
          ],
          preview: {
            select: {
              title: "activity",
              subtitle: "time",
              location: "location",
            },
            prepare({ title, subtitle, location }) {
              return {
                title,
                subtitle: `${subtitle || ""}${location ? ` at ${location}` : ""}`,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "venues",
      title: "Venues Included",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "venue" }],
        }),
      ],
      description: "Which venues are visited in this tour",
    }),
    defineField({
      name: "pricing",
      title: "Pricing",
      type: "object",
      fields: [
        defineField({
          name: "price",
          title: "Price",
          type: "number",
          description: "Price in USD",
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
          name: "priceType",
          title: "Price Type",
          type: "string",
          options: {
            list: [
              { title: "Per Person", value: "per-person" },
              { title: "Per Couple", value: "per-couple" },
              { title: "Flat Rate", value: "flat-rate" },
              { title: "Free", value: "free" },
            ],
          },
        }),
        defineField({
          name: "includes",
          title: "Price Includes",
          type: "array",
          of: [{ type: "string" }],
          description: "What's included in the price",
        }),
        defineField({
          name: "excludes",
          title: "Price Excludes",
          type: "array",
          of: [{ type: "string" }],
          description: "What's not included",
        }),
      ],
    }),
    defineField({
      name: "requirements",
      title: "Requirements",
      type: "object",
      fields: [
        defineField({
          name: "minimumPeople",
          title: "Minimum People",
          type: "number",
        }),
        defineField({
          name: "maximumPeople",
          title: "Maximum People",
          type: "number",
        }),
        defineField({
          name: "ageRestriction",
          title: "Age Restrictions",
          type: "string",
        }),
        defineField({
          name: "fitnessLevel",
          title: "Required Fitness Level",
          type: "string",
          options: {
            list: [
              { title: "Easy - Suitable for all", value: "easy" },
              { title: "Moderate - Some walking required", value: "moderate" },
              { title: "Challenging - Good fitness required", value: "challenging" },
            ],
          },
        }),
        defineField({
          name: "whatToBring",
          title: "What to Bring",
          type: "array",
          of: [{ type: "string" }],
        }),
        defineField({
          name: "dresscode",
          title: "Dress Code",
          type: "string",
          options: {
            list: [
              { title: "Casual", value: "casual" },
              { title: "Smart Casual", value: "smart-casual" },
              { title: "Formal", value: "formal" },
              { title: "Traditional Attire", value: "traditional" },
              { title: "Active Wear", value: "active-wear" },
            ],
          },
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "availability",
      title: "Availability",
      type: "object",
      fields: [
        defineField({
          name: "daysOfWeek",
          title: "Days of Week",
          type: "array",
          of: [{ type: "string" }],
          options: {
            list: [
              { title: "Monday", value: "monday" },
              { title: "Tuesday", value: "tuesday" },
              { title: "Wednesday", value: "wednesday" },
              { title: "Thursday", value: "thursday" },
              { title: "Friday", value: "friday" },
              { title: "Saturday", value: "saturday" },
              { title: "Sunday", value: "sunday" },
            ],
          },
        }),
        defineField({
          name: "timeSlots",
          title: "Available Time Slots",
          type: "array",
          of: [{ type: "string" }],
          description: "e.g., 9:00 AM, 2:00 PM, 4:30 PM",
        }),
        defineField({
          name: "seasonalAvailability",
          title: "Seasonal Notes",
          type: "text",
          description: "Any seasonal restrictions or recommendations",
        }),
        defineField({
          name: "advanceBooking",
          title: "Advance Booking Required",
          type: "string",
          description: "How far in advance to book",
          options: {
            list: [
              { title: "Same Day OK", value: "same-day" },
              { title: "24 hours", value: "24-hours" },
              { title: "48 hours", value: "48-hours" },
              { title: "1 week", value: "1-week" },
              { title: "2 weeks", value: "2-weeks" },
              { title: "1 month", value: "1-month" },
            ],
          },
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "contactInfo",
      title: "Booking Contact",
      type: "object",
      fields: [
        defineField({
          name: "bookingEmail",
          title: "Booking Email",
          type: "email",
        }),
        defineField({
          name: "bookingPhone",
          title: "Booking Phone",
          type: "string",
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp",
          type: "string",
        }),
        defineField({
          name: "onlineBooking",
          title: "Online Booking URL",
          type: "url",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "featured",
      title: "Featured Experience",
      type: "boolean",
      description: "Highlight this experience",
      initialValue: false,
    }),
    defineField({
      name: "popular",
      title: "Popular Choice",
      type: "boolean",
      description: "Mark as popular",
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
      type: "type",
      price: "pricing.price",
      currency: "pricing.currency",
      media: "heroImage",
      featured: "featured",
      popular: "popular",
    },
    prepare({ title, type, price, currency, media, featured, popular }) {
      let prefix = "";
      if (popular) prefix = "🔥 ";
      if (featured) prefix = "⭐ ";

      const priceText = price ? `${currency || "USD"} ${price}` : "Free";
      
      return {
        title: `${prefix}${title}`,
        subtitle: `${type || "Experience"} • ${priceText}`,
        media,
      };
    },
  },
});