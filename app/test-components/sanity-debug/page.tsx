import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'

export const dynamic = 'force-dynamic'

// Simple query to get all venues
const ALL_VENUES_QUERY = defineQuery(`*[_type == "venue"]`)

// Simple query to get one venue with full structure  
const SAMPLE_VENUE_QUERY = defineQuery(`*[_type == "venue"][0]`)

export default async function SanityDebugPage() {
  const venues = await sanityFetch({
    query: ALL_VENUES_QUERY,
  })

  const sampleVenue = await sanityFetch({
    query: SAMPLE_VENUE_QUERY,
  })

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Sanity Database Debug</h1>
      
      {/* Venues List */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Available Venues ({venues?.length || 0})</h2>
        {venues && venues.length > 0 ? (
          <div className="space-y-4">
            {venues.map((venue: any, index: number) => (
              <div key={venue._id || index} className="border p-4 rounded bg-gray-50">
                <h3 className="text-xl font-medium">{venue.name || 'Unnamed Venue'}</h3>
                <p><strong>Slug:</strong> {venue.slug?.current || 'No slug'}</p>
                <p><strong>ID:</strong> {venue._id}</p>
                <p><strong>Hero Image:</strong> {venue.heroImage ? '✅ Has hero image' : '❌ No hero image'}</p>
                <p><strong>Gallery:</strong> {venue.gallery ? `${Array.isArray(venue.gallery) ? venue.gallery.length : 'Not array'} items` : '❌ No gallery'}</p>
                <p><strong>Updated:</strong> {venue._updatedAt}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-red-600">No venues found in Sanity database.</p>
        )}
      </section>

      {/* Sample Venue Structure */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sample Venue Structure</h2>
        {sampleVenue ? (
          <div className="bg-gray-100 p-4 rounded overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(sampleVenue, null, 2)}
            </pre>
          </div>
        ) : (
          <p className="text-red-600">No sample venue available.</p>
        )}
      </section>

      {/* Schema Analysis */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Schema Analysis</h2>
        {sampleVenue && (
          <div className="space-y-4">
            <div className="border p-4 rounded">
              <h3 className="font-semibold">Hero Image Structure:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(sampleVenue.heroImage, null, 2)}
              </pre>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-semibold">Gallery Structure:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(sampleVenue.gallery, null, 2)}
              </pre>
            </div>
            <div className="border p-4 rounded">
              <h3 className="font-semibold">Location Structure:</h3>
              <pre className="text-sm bg-gray-100 p-2 rounded mt-2">
                {JSON.stringify(sampleVenue.location, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}
