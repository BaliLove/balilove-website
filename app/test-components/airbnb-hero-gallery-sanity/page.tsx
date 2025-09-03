import AirbnbHeroGallery from '@/app/components/AirbnbHeroGallery'
import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'

// Server Component: fetch a single venue (by slug if provided)
export const dynamic = 'force-dynamic'

const DEMO_SLUG = 'renaissance-hotel'

const VENUE_DEMO_QUERY = defineQuery(`*[_type == "venue" && slug.current == $slug][0]`)

// Client wrapper to pass a click handler (cannot pass functions from server components)
function ClientWrapper({ heroImage, gallery, venueName }: any) {
  'use client'
  const onViewAllPhotos = () => console.log('View all photos clicked')
  return (
    <div>
      <h1 className="text-center text-2xl py-4">AirbnbHeroGallery (Sanity)</h1>
      <AirbnbHeroGallery
        heroImage={heroImage}
        gallery={gallery}
        venueName={venueName}
        onViewAllPhotos={onViewAllPhotos}
      />
    </div>
  )
}

export default async function Page({ searchParams }: { searchParams?: { slug?: string } }) {
  const slug = searchParams?.slug || DEMO_SLUG

  const venue = await sanityFetch({
    query: VENUE_DEMO_QUERY,
    params: { slug },
  })

  if (!venue) {
    return (
      <div className="p-8">
        <h1 className="text-2xl mb-2">AirbnbHeroGallery (Sanity)</h1>
        <p className="text-red-600">No venue found for slug: {slug}.</p>
        <p>Try providing a different slug in the URL, e.g. /test-components/airbnb-hero-gallery-sanity?slug=your-slug</p>
      </div>
    )
  }

  const heroImage = venue.heroImage || null
  const gallery = Array.isArray(venue.gallery) ? venue.gallery : []
  const venueName = venue.name || slug

  return <ClientWrapper heroImage={heroImage} gallery={gallery} venueName={venueName} />
}

