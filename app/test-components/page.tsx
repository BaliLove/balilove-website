import Link from 'next/link'

const components = [
  { slug: 'sanity-debug', label: '🔍 Sanity Database Debug' },
  { slug: 'header', label: 'Header' },
  { slug: 'global-cta', label: 'GlobalCTA' },
  { slug: 'contact-modal', label: 'ContactModal' },
  { slug: 'real-weddings', label: 'RealWeddingsAtVenue' },
  { slug: 'airbnb-hero-gallery', label: 'AirbnbHeroGallery (mock data)' },
  { slug: 'airbnb-hero-gallery-sanity', label: 'AirbnbHeroGallery (Sanity demo)' },
  { slug: 'venue-location-map', label: 'VenueLocationMap' },
  { slug: 'venue-about-section', label: 'VenueAboutSection' },
  { slug: 'venue-info-bar', label: 'VenueInfoBar' },
  { slug: 'sticky-cta-sidebar', label: 'StickyCTASidebar' },
  { slug: 'venue-gallery', label: 'VenueGallery (mock)' },
  { slug: 'venue-gallery-sanity', label: 'VenueGallery (Sanity)' },
  { slug: 'venue-detail-client', label: 'VenueDetailClient' },
  { slug: 'similar-venues-grid', label: 'SimilarVenuesGrid' },
  { slug: 'wedding-card-gallery', label: 'WeddingCardGallery' },
  { slug: 'wedding-gallery-modal', label: 'WeddingGalleryModal' },
  { slug: 'wedding-image-carousel', label: 'WeddingImageCarousel' },
  { slug: 'venue-lightbox', label: 'VenueLightbox' },
  { slug: 'team-grid', label: 'TeamGrid' },
  { slug: 'team-member-modal', label: 'TeamMemberModal' },
]

export default function ComponentIndex() {
  return (
    <div className="min-h-screen bg-[#F5F3EF] font-cardo text-[#333333]">
      <section className="bg-[#F5F3EF] py-16 px-4 border-b border-black">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-['Cardo'] text-[#333333] text-4xl font-light tracking-tight mb-8">
            Component Test Index
          </h1>
          <p className="text-[#333]">Open each component in isolation for faster debugging.</p>
        </div>
      </section>

      <section className="py-8 px-4">
        <div className="container mx-auto max-w-3xl">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {components.map((c) => (
              <li key={c.slug}>
                <Link href={`/test-components/${c.slug}`} className="block p-4 bg-white border border-black hover:bg-[#f9f7f3]">
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

