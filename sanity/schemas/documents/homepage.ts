import { HomeIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Homepage Content Schema
 * 
 * Structured content for the main landing page
 * with hero sections, features, and social proof
 */

export default defineType({
  name: "homepage",
  title: "Homepage Content",
  icon: HomeIcon,
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Page Title",
      type: "string",
      description: "Internal reference only",
      initialValue: "Homepage Content",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSection",
      title: "Hero Section",
      type: "object",
      fields: [
        defineField({
          name: "headline",
          title: "Main Headline",
          type: "string",
          initialValue: "CELEBRATING LOVE in the BEAUTIFUL ISLAND of BALI",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "subheadline",
          title: "Subheadline",
          type: "text",
          description: "Supporting text under the main headline",
        }),
        defineField({
          name: "heroImage",
          title: "Hero Background Image",
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
          ],
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "ctaButton",
          title: "Call-to-Action Button",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Button Text",
              type: "string",
              initialValue: "Start Planning Your Dream Wedding",
            }),
            defineField({
              name: "link",
              title: "Button Link",
              type: "string",
              initialValue: "/contact",
            }),
            defineField({
              name: "style",
              title: "Button Style",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Outline", value: "outline" },
                ],
              },
              initialValue: "primary",
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "trustIndicators",
      title: "Trust & Credibility Section",
      type: "object",
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Section Title",
          type: "string",
          initialValue: "BALI WEDDING PLANNERS YOU CAN TRUST",
        }),
        defineField({
          name: "yearsExperience",
          title: "Years of Experience",
          type: "number",
          initialValue: 30,
        }),
        defineField({
          name: "weddingsPlanned",
          title: "Total Weddings Planned",
          type: "number",
          initialValue: 2000,
        }),
        defineField({
          name: "yearlyLimit",
          title: "Yearly Wedding Limit",
          type: "number",
          initialValue: 100,
          description: "Maximum weddings per year for quality",
        }),
        defineField({
          name: "features",
          title: "Key Features",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Feature Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Feature Description",
                  type: "text",
                }),
                defineField({
                  name: "icon",
                  title: "Icon Name",
                  type: "string",
                  description: "Icon identifier for frontend",
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "description",
                },
              },
            }),
          ],
          initialValue: [
            {
              title: "Transparent Pricing",
              description: "No hidden fees or high-pressure sales",
              icon: "transparency",
            },
            {
              title: "Genuine Care",
              description: "Personal attention to every detail",
              icon: "heart",
            },
            {
              title: "Prompt Communication",
              description: "Quick responses and regular updates",
              icon: "communication",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "servicesOverview",
      title: "Services Overview Section",
      type: "object",
      fields: [
        defineField({
          name: "sectionTitle",
          title: "Section Title",
          type: "string",
          initialValue: "WHAT WE DO",
        }),
        defineField({
          name: "description",
          title: "Section Description",
          type: "array",
          of: [{ type: "block" }],
        }),
        defineField({
          name: "services",
          title: "Featured Services",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "title",
                  title: "Service Title",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "description",
                  title: "Service Description",
                  type: "text",
                }),
                defineField({
                  name: "image",
                  title: "Service Image",
                  type: "image",
                  options: { hotspot: true },
                  fields: [
                    defineField({
                      name: "alt",
                      type: "string",
                      title: "Alternative text",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                }),
                defineField({
                  name: "link",
                  title: "Service Page Link",
                  type: "string",
                }),
              ],
              preview: {
                select: {
                  title: "title",
                  subtitle: "description",
                  media: "image",
                },
              },
            }),
          ],
          initialValue: [
            {
              title: "PACKAGES",
              description: "All-inclusive wedding packages for every budget",
              link: "/packages",
            },
            {
              title: "PLANNING",
              description: "Expert wedding planning and coordination",
              link: "/planning",
            },
            {
              title: "VENUES",
              description: "Bali's most beautiful wedding locations",
              link: "/venues",
            },
          ],
        }),
      ],
    }),
    defineField({
      name: "featuredTestimonials",
      title: "Featured Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "testimonial" }],
        }),
      ],
      validation: (rule) => rule.max(3),
      description: "Select up to 3 testimonials for the homepage",
    }),
    defineField({
      name: "featuredVenues",
      title: "Featured Venues",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "venue" }],
        }),
      ],
      validation: (rule) => rule.max(6),
      description: "Select up to 6 venues to showcase",
    }),
    defineField({
      name: "ctaSection",
      title: "Bottom Call-to-Action Section",
      type: "object",
      fields: [
        defineField({
          name: "headline",
          title: "CTA Headline",
          type: "string",
          initialValue: "Ready to Start Planning Your Dream Wedding?",
        }),
        defineField({
          name: "description",
          title: "CTA Description",
          type: "text",
          initialValue: "Contact us today for a personalized consultation and let's create your perfect Bali wedding together.",
        }),
        defineField({
          name: "primaryButton",
          title: "Primary Button",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Button Text",
              type: "string",
              initialValue: "Get Your Free Consultation",
            }),
            defineField({
              name: "link",
              title: "Button Link",
              type: "string",
              initialValue: "/contact",
            }),
          ],
        }),
        defineField({
          name: "secondaryButton",
          title: "Secondary Button",
          type: "object",
          fields: [
            defineField({
              name: "text",
              title: "Button Text",
              type: "string",
              initialValue: "View Our Packages",
            }),
            defineField({
              name: "link",
              title: "Button Link",
              type: "string",
              initialValue: "/packages",
            }),
          ],
        }),
        defineField({
          name: "backgroundImage",
          title: "Background Image",
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alternative text",
            }),
          ],
        }),
      ],
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
        defineField({
          name: "keywords",
          title: "Focus Keywords",
          type: "array",
          of: [{ type: "string" }],
          description: "Main keywords for this page",
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
      headline: "heroSection.headline",
    },
    prepare({ title, headline }) {
      return {
        title,
        subtitle: headline || "Homepage content",
      };
    },
  },
});