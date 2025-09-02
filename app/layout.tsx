import "./globals.css";

import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import {
  VisualEditing,
  toPlainText,
  type PortableTextBlock,
} from "next-sanity";
import { draftMode } from "next/headers";
import { Cardo } from "next/font/google";
import { PHProvider } from "./providers/PostHogProvider";

import { sanityFetch } from "@/sanity/lib/fetch";
import { defineQuery } from "next-sanity";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

// Load Cardo font exactly as used on current bali.love site
const cardo = Cardo({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cardo',
  display: 'swap',
});

const SETTINGS_QUERY = defineQuery(`*[_type == "settings"][0]`);

export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityFetch({
    query: SETTINGS_QUERY,
    revalidate: false,
  });
  
  const title = settings?.title || "Bali Love - Luxury Wedding Planners";
  const description = settings?.description 
    ? toPlainText(settings.description)
    : "Bali Love creates unforgettable wedding experiences with over 30 years of expertise in luxury Bali wedding planning.";

  const ogImage = resolveOpenGraphImage(settings?.ogImage);
  let metadataBase: URL | undefined = undefined;
  
  try {
    metadataBase = settings?.ogImage?.metadataBase
      ? new URL(settings.ogImage.metadataBase)
      : undefined;
  } catch {
    // ignore
  }
  
  return {
    metadataBase,
    title: {
      template: `%s | ${title}`,
      default: title,
    },
    description,
    openGraph: {
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isEnabled: isDraftMode } = await draftMode();

  return (
    <html lang="en" className={`${cardo.variable} bg-white text-bali-text`}>
      <body className="font-cardo">
        <PHProvider>
          <div className="min-h-screen">
            {isDraftMode && (
              <div className="bg-yellow-100 border-b border-yellow-200 p-2 text-center text-sm">
                <strong>Draft Mode:</strong> Previewing draft content.{" "}
                <a href="/api/draft-mode/disable" className="underline">
                  Exit Preview
                </a>
              </div>
            )}
            <main>{children}</main>
          </div>
          {isDraftMode && <VisualEditing />}
          <SpeedInsights />
        </PHProvider>
      </body>
    </html>
  );
}