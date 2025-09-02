import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'
import { getImageUrl } from '@/sanity/lib/image'

export const metadata: Metadata = {
  title: 'Wedding Venues in Bali | Luxury Villa & Beachfront Locations',
  description: 'Discover Bali\'s most stunning wedding venues. From luxury villas to beachfront locations, we offer access to over 111 exclusive venues across the island.',
  keywords: 'Bali wedding venues, luxury villa wedding, beachfront wedding Bali, wedding locations Bali, destination wedding venues',
}

const VENUES_QUERY = defineQuery(`
  *[_type == "venue"] | order(name asc) {
    _id,
    name,
    slug,
    shortDescription,
    location,
    capacity,
    venueType,
    heroImage {
      asset->{
        _id,
        url
      },
      alt
    },
    gallery[] {
      asset->{
        _id,
        url
      },
      alt
    }
  }
`)

interface Venue {
  _id: string
  name: string
  slug: { current: string }
  shortDescription?: string
  location?: string
  capacity?: number
  venueType?: string
  heroImage?: {
    asset?: { url: string }
    alt?: string
  }
  gallery?: Array<{
    asset?: { url: string }
    alt?: string
  }>
}

export default async function VenuesPage() {
  const venues: Venue[] = await sanityFetch({
    query: VENUES_QUERY,
    revalidate: 3600, // Revalidate every hour
  })

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-section">
        <div className="container-luxury">
          <div className="split-panel">
            <div>
              <h1 className="heading-luxury mb-6">
                Exclusive Wedding Venues
              </h1>
              <p className="subheading-luxury mb-8">
                Discover Bali's most stunning locations for your dream wedding
              </p>
              <div className="body-luxury max-w-lg">
                <p className="mb-6">
                  From luxury cliff-top villas overlooking the ocean to intimate beachfront locations 
                  and traditional Balinese settings, we offer access to over 111 exclusive venues 
                  across the island.
                </p>
                <p>
                  Each venue has been carefully selected for its beauty, service quality, and ability 
                  to create unforgettable wedding experiences.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white p-8 luxury-card">
                <div className="text-center">
                  <div className="text-4xl font-light text-bali-gold mb-2">111</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Exclusive Venues</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">8</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Regions Covered</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">40+</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Venue Categories Filter */}
      <section className="py-8 border-b border-gray-200">
        <div className="container-luxury">
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="nav-item px-4 py-2 text-bali-gold border-b-2 border-bali-gold">
              All Venues
            </button>
            <button className="nav-item px-4 py-2 hover:text-bali-gold">
              Luxury Villas
            </button>
            <button className="nav-item px-4 py-2 hover:text-bali-gold">
              Beachfront
            </button>
            <button className="nav-item px-4 py-2 hover:text-bali-gold">
              Garden & Jungle
            </button>
            <button className="nav-item px-4 py-2 hover:text-bali-gold">
              Cliff Top
            </button>
            <button className="nav-item px-4 py-2 hover:text-bali-gold">
              Traditional
            </button>
          </div>
        </div>
      </section>

      {/* Venues Grid */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="four-across-grid">
            {venues.map((venue) => (
              <Link 
                key={venue._id}
                href={`/venues/${venue.slug?.current}`}
                className="luxury-card group overflow-hidden"
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
                  {venue.heroImage?.asset?.url ? (
                    <Image
                      src={getImageUrl(venue.heroImage, { width: 400, height: 300 })}
                      alt={venue.heroImage.alt || venue.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gray-400">{venue.name}</span>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-light text-gray-800 mb-2">
                    {venue.name}
                  </h3>
                  
                  <div className="space-y-1 text-sm text-gray-600 mb-4">
                    {venue.location && (
                      <p className="flex items-center">
                        <span className="w-4 h-4 mr-2">📍</span>
                        {venue.location}
                      </p>
                    )}
                    {venue.capacity && (
                      <p className="flex items-center">
                        <span className="w-4 h-4 mr-2">👥</span>
                        Up to {venue.capacity} guests
                      </p>
                    )}
                    {venue.venueType && (
                      <p className="flex items-center">
                        <span className="w-4 h-4 mr-2">🏛️</span>
                        {venue.venueType}
                      </p>
                    )}
                  </div>
                  
                  {venue.shortDescription && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {venue.shortDescription}
                    </p>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="nav-item text-xs">
                      VIEW DETAILS →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {venues.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No venues found.</p>
              <p className="text-sm text-gray-500">
                Our venues are being updated. Please contact us for the latest availability.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury text-center">
          <h2 className="heading-luxury mb-6">
            Can't Find the Perfect Venue?
          </h2>
          <p className="subheading-luxury mb-8 max-w-2xl mx-auto">
            Our venue specialists know every hidden gem in Bali. Let us help you discover 
            the perfect location for your dream wedding.
          </p>
          <Link href="/contact" className="enquire-button">
            SPEAK WITH OUR VENUE EXPERT
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}