import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: ["./app/**/*.{ts,tsx}", "./sanity/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
        cardo: ["var(--font-cardo)", "serif"],
      },
      colors: {
        'bali-cream': '#F5F3EF',
        'bali-gold': '#B29A7B',
        'bali-coral': '#D79E92',
        'bali-text': '#1F2937',
      },
      backgroundColor: {
        'bali-cream': '#F5F3EF',
      },
      textColor: {
        'bali-text': '#1F2937',
        'bali-gold': '#B29A7B',
        'bali-coral': '#D79E92',
      },
      borderColor: {
        'bali-gold': '#B29A7B',
      }
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
