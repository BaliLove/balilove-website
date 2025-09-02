import { UserIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

/**
 * Team Member Schema
 * 
 * Wedding planners and team members with their expertise
 * and credentials for building trust with couples
 */

export default defineType({
  name: "teamMember",
  title: "Team Member",
  icon: UserIcon,
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Full Name",
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
      name: "jobRole",
      title: "Job Role",
      type: "string",
      description: "Job role from Bubble (e.g. 'Founder & CEO', 'Wedding Planner')",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "profileImage",
      title: "Profile Photo",
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
              if ((context.document?.profileImage as any)?.asset?._ref && !alt) {
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
      name: "bio",
      title: "Biography",
      type: "array",
      of: [{ type: "block" }],
      description: "Professional background and personality",
    }),
    defineField({
      name: "expertise",
      title: "Areas of Expertise",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Luxury Villa Weddings", value: "luxury-villas" },
          { title: "Beach Ceremonies", value: "beach-weddings" },
          { title: "Clifftop Venues", value: "clifftop-venues" },
          { title: "Traditional Balinese Ceremonies", value: "balinese-ceremonies" },
          { title: "International Couples", value: "international-couples" },
          { title: "Photography Coordination", value: "photography" },
          { title: "Floral Design", value: "floral-design" },
          { title: "Event Styling", value: "event-styling" },
          { title: "Vendor Management", value: "vendor-management" },
          { title: "Day-of Coordination", value: "day-of-coordination" },
          { title: "Budget Planning", value: "budget-planning" },
          { title: "Timeline Management", value: "timeline-management" },
        ],
      },
    }),
    defineField({
      name: "experience",
      title: "Years of Experience",
      type: "number",
      description: "Years in wedding planning",
    }),
    defineField({
      name: "weddingsPlanned",
      title: "Weddings Planned",
      type: "number",
      description: "Total number of weddings coordinated",
    }),
    defineField({
      name: "languages",
      title: "Languages Spoken",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "English", value: "english" },
          { title: "Indonesian", value: "indonesian" },
          { title: "Balinese", value: "balinese" },
          { title: "Mandarin", value: "mandarin" },
          { title: "Japanese", value: "japanese" },
          { title: "Korean", value: "korean" },
          { title: "French", value: "french" },
          { title: "German", value: "german" },
          { title: "Dutch", value: "dutch" },
          { title: "Spanish", value: "spanish" },
          { title: "Italian", value: "italian" },
          { title: "Russian", value: "russian" },
        ],
      },
    }),
    defineField({
      name: "certifications",
      title: "Certifications & Education",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Certification/Degree Title",
              type: "string",
            }),
            defineField({
              name: "institution",
              title: "Institution",
              type: "string",
            }),
            defineField({
              name: "year",
              title: "Year Obtained",
              type: "number",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "personalQuote",
      title: "Personal Quote",
      type: "text",
      description: "Inspiring quote or personal mission statement",
    }),
    defineField({
      name: "contactInfo",
      title: "Contact Information",
      type: "object",
      fields: [
        defineField({
          name: "email",
          title: "Email",
          type: "email",
        }),
        defineField({
          name: "phone",
          title: "Phone",
          type: "string",
        }),
        defineField({
          name: "whatsapp",
          title: "WhatsApp",
          type: "string",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
    defineField({
      name: "socialMedia",
      title: "Social Media",
      type: "object",
      fields: [
        defineField({
          name: "instagram",
          title: "Instagram",
          type: "url",
        }),
        defineField({
          name: "linkedin",
          title: "LinkedIn",
          type: "url",
        }),
        defineField({
          name: "facebook",
          title: "Facebook",
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
      title: "Featured Team Member",
      type: "boolean",
      description: "Show on homepage and about page",
      initialValue: false,
    }),
    defineField({
      name: "teamOrder",
      title: "Team Order",
      type: "number",
      description: "Team order from Bubble (lower numbers first, leadership priority)",
    }),
    defineField({
      name: "isPublished",
      title: "Published",
      type: "boolean",
      description: "Show on team page (from Bubble visibleInPlanning)",
      initialValue: true,
    }),
    defineField({
      name: "bubbleData",
      title: "Bubble Metadata",
      type: "object",
      fields: [
        defineField({
          name: "userId",
          title: "Bubble User ID",
          type: "string",
        }),
        defineField({
          name: "satelliteId",
          title: "Bubble Satellite ID", 
          type: "string",
        }),
        defineField({
          name: "userType",
          title: "User Type",
          type: "string",
        }),
        defineField({
          name: "isSalesPerson",
          title: "Sales Person",
          type: "boolean",
        }),
        defineField({
          name: "workingHours",
          title: "Weekly Working Hours",
          type: "number",
        }),
        defineField({
          name: "currency",
          title: "Currency",
          type: "string",
        }),
      ],
      options: {
        collapsible: true,
        collapsed: true,
      },
    }),
  ],
  orderings: [
    {
      title: "Team Order",
      name: "teamOrderAsc",
      by: [{ field: "teamOrder", direction: "asc" }],
    },
    {
      title: "Job Role",
      name: "jobRoleAsc", 
      by: [{ field: "jobRole", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "name",
      jobRole: "jobRole",
      teamOrder: "teamOrder",
      media: "profileImage",
      featured: "featured",
      isPublished: "isPublished",
    },
    prepare({ title, jobRole, teamOrder, media, featured, isPublished }) {
      const prefix = featured ? "⭐ " : (isPublished === false ? "🚫 " : "");
      const orderSuffix = teamOrder ? ` (#${teamOrder})` : "";
      return {
        title: `${prefix}${title}`,
        subtitle: `${jobRole || "Team Member"}${orderSuffix}`,
        media,
      };
    },
  },
});