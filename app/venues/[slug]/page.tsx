import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import AirbnbHeroGallery from '../../components/AirbnbHeroGallery'
import { sanityFetch } from '@/sanity/lib/fetch'
import { defineQuery } from 'next-sanity'
import { PortableText } from 'next-sanity'

interface PageProps {
  params: { slug: string }
}

const VENUE_QUERY = defineQuery(`
  *[_type == "venue" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    shortDescription,
    description,
    location,
    capacity,
    venueType,
    priceRange,
    features,
    amenities,
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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const venue = await sanityFetch({
    query: VENUE_QUERY,
    params: { slug: params.slug },
    revalidate: 3600,
  })

  if (!venue) {
    return {
      title: 'Venue Not Found | Bali Love',
    }
  }

  return {
    title: `${venue.name} - Wedding Venue in Bali | Bali Love`,
    description: venue.shortDescription || `Discover ${venue.name}, a stunning wedding venue in ${venue.location || 'Bali'}. Perfect for luxury destination weddings with exceptional service.`,
    keywords: `${venue.name}, Bali wedding venue, ${venue.location} wedding, luxury venue Bali, destination wedding ${venue.location}`,
  }
}

interface Venue {
  _id: string
  name: string
  slug: { current: string }
  shortDescription?: string
  description?: any[] // Portable Text
  location?: string
  capacity?: number
  venueType?: string
  priceRange?: string
  features?: string[]
  amenities?: string[]
  heroImage?: {
    asset?: { url: string }
    alt?: string
  }
  gallery?: Array<{
    asset?: { url: string }
    alt?: string
  }>
}

export default async function VenueDetailPage({ params }: PageProps) {
  const venue: Venue = await sanityFetch({
    query: VENUE_QUERY,
    params: { slug: params.slug },
    revalidate: 3600,
  })

  if (!venue) {
    notFound()
  }

  const handleViewAllPhotos = () => {
    // In a real implementation, this would open a gallery modal
    console.log('Open photo gallery')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="pt-16">
        {/* Hero Gallery */}
        <AirbnbHeroGallery
          heroImage={venue.heroImage}
          gallery={venue.gallery || []}
          venueName={venue.name}
          onViewAllPhotos={handleViewAllPhotos}
        />

        {/* Venue Details */}
        <div className="container-luxury py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="mb-8">
                <h1 className="heading-luxury mb-4">{venue.name}</h1>
                {venue.location && (
                  <p className="subheading-luxury text-gray-600 mb-6">
                    📍 {venue.location}
                  </p>
                )}
                
                {venue.shortDescription && (
                  <p className="body-luxury text-lg mb-6">
                    {venue.shortDescription}
                  </p>
                )}
              </div>

              {/* Venue Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 p-6 bg-gray-50 rounded-lg">
                {venue.capacity && (
                  <div className="text-center">
                    <div className="text-2xl font-light text-bali-gold mb-1">{venue.capacity}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-600">Max Guests</div>
                  </div>
                )}
                {venue.venueType && (
                  <div className="text-center">
                    <div className="text-sm font-light text-bali-gold mb-1">{venue.venueType}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-600">Venue Type</div>
                  </div>
                )}
                {venue.priceRange && (
                  <div className="text-center">
                    <div className="text-sm font-light text-bali-gold mb-1">{venue.priceRange}</div>
                    <div className="text-xs uppercase tracking-wider text-gray-600">Price Range</div>
                  </div>
                )}
                <div className="text-center">
                  <div className="text-sm font-light text-bali-gold mb-1">Available</div>
                  <div className="text-xs uppercase tracking-wider text-gray-600">Status</div>
                </div>
              </div>

              {/* Description */}
              {venue.description && (
                <div className="mb-12">
                  <h2 className="text-2xl font-light text-gray-800 mb-6">About This Venue</h2>
                  <div className="prose prose-lg max-w-none">
                    <PortableText value={venue.description} />
                  </div>
                </div>
              )}

              {/* Features */}
              {venue.features && venue.features.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-light text-gray-800 mb-6">Venue Features</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.features.map((feature, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-bali-gold rounded-full mr-3"></span>
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Amenities */}
              {venue.amenities && venue.amenities.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-light text-gray-800 mb-6">Amenities</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {venue.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-bali-gold rounded-full mr-3"></span>
                        <span className="text-gray-700">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="luxury-card p-6 sticky top-24">
                <h3 className="text-xl font-light text-gray-800 mb-6 text-center">
                  Interested in This Venue?
                </h3>
                
                <div className="space-y-4 mb-6 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-medium">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Planning Support:</span>
                    <span className="font-medium">Included</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Site Visit:</span>
                    <span className="font-medium">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pricing:</span>
                    <span className="font-medium">Transparent</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button className="enquire-button w-full">
                    GET VENUE PRICING
                  </button>
                  <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
                    SCHEDULE SITE VISIT
                  </button>
                  <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
                    ASK A QUESTION
                  </button>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <p className="text-sm text-gray-600 mb-2">
                    Need help choosing?
                  </p>
                  <p className="text-xs text-gray-500">
                    Our venue specialists are here to help you find the perfect location for your dream wedding.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Venues */}
        <section className="section-padding bg-gray-50">
          <div className="container-luxury">
            <h2 className="heading-luxury text-center mb-12">
              Other Venues You Might Love
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Placeholder for related venues - would be populated from CMS */}
              {[1, 2, 3].map((i) => (
                <div key={i} className="luxury-card overflow-hidden">
                  <div className="aspect-[4/3] bg-gray-200"></div>
                  <div className="p-6">
                    <h3 className="font-light text-gray-800 mb-2">Similar Venue {i}</h3>
                    <p className="text-sm text-gray-600 mb-4">Beautiful location for weddings</p>
                    <span className="nav-item text-xs">VIEW DETAILS →</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}