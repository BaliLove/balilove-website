import VenueGallery from '@/app/components/VenueGallery'
import { sanityFetch } from '@/sanity/lib/client'
import { defineQuery } from 'next-sanity'

export const dynamic = 'force-dynamic'

const VENUE_GALLERY_QUERY = defineQuery(`*[_type == "venue" && gallery != null][0]`)

export default async function Page() {
  const venue = await sanityFetch({
    query: VENUE_GALLERY_QUERY,
    revalidate: 60
  })

  if (!venue) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl mb-4">VenueGallery Test (Sanity)</h1>
        <p className="text-red-600">No venue with gallery found</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-center text-2xl py-4">VenueGallery Test (Sanity)</h1>
      <div className="container mx-auto p-4">
        <h2 className="text-lg mb-4 text-center">{venue.name} - {venue.gallery?.length || 0} images</h2>
        <VenueGallery gallery={venue.gallery || []} venueName={venue.name || 'Test Venue'} />
      </div>
    </div>
  )
}
