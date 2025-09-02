import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Wedding Venue Tours & Experiences in Bali | Bali Love',
  description: 'Explore Bali\'s most stunning wedding venues with our guided tours and experiences. Perfect for couples planning their destination wedding.',
  keywords: 'Bali venue tours, wedding venue visits, Bali wedding experiences, venue selection tours',
}

const tours = [
  {
    id: 'luxury-villa',
    name: 'Luxury Villa Tour',
    duration: 'Full Day (8 hours)',
    venues: '4-5 exclusive villas',
    price: '$150 per couple',
    description: 'Discover Bali\'s most exclusive private villa venues, perfect for intimate luxury weddings.',
    highlights: [
      'Private cliff-top villas with ocean views',
      'Luxury jungle retreats',
      'Traditional Balinese architecture',
      'Professional photography opportunities',
      'Gourmet lunch at featured venue'
    ],
    includes: [
      'Private transportation',
      'Professional tour guide',
      'Venue coordination',
      'Lunch at premium venue',
      'Venue brochures & pricing'
    ]
  },
  {
    id: 'beachfront',
    name: 'Beachfront Venue Experience',
    duration: 'Half Day (4 hours)',
    venues: '3-4 beach venues',
    price: '$100 per couple',
    description: 'Experience the magic of beachfront wedding venues along Bali\'s most beautiful coastlines.',
    highlights: [
      'Sunset ceremony locations',
      'Private beach access',
      'Traditional fishing villages',
      'Clifftop ocean views',
      'Cultural temple visits'
    ],
    includes: [
      'Beachfront transportation',
      'Local guide expertise',
      'Sunset viewing time',
      'Refreshments',
      'Venue contact information'
    ]
  },
  {
    id: 'cultural',
    name: 'Cultural Heritage Tour',
    duration: 'Full Day (6 hours)',
    venues: '3-4 traditional venues',
    price: '$120 per couple',
    description: 'Immerse yourself in authentic Balinese culture with traditional venue experiences.',
    highlights: [
      'Ancient temple ceremonies',
      'Royal palace venues',
      'Traditional Balinese gardens',
      'Cultural performances',
      'Local artisan workshops'
    ],
    includes: [
      'Cultural guide',
      'Traditional lunch',
      'Ceremony demonstrations',
      'Artisan interactions',
      'Cultural souvenirs'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Venue Journey',
    duration: 'Flexible timing',
    venues: 'Your preferred selection',
    price: 'Custom pricing',
    description: 'Personalized venue tour based on your specific preferences, style, and requirements.',
    highlights: [
      'Tailored venue selection',
      'Flexible scheduling',
      'Personal preferences focus',
      'Budget-conscious options',
      'Extended consultation time'
    ],
    includes: [
      'Custom itinerary',
      'Personal wedding consultant',
      'Flexible transportation',
      'Venue negotiations',
      'Follow-up planning session'
    ]
  }
]

const experiences = [
  {
    name: 'Vendor Showcase Experience',
    duration: '3 hours',
    description: 'Meet Bali\'s top wedding vendors including photographers, florists, and musicians.',
    price: '$75 per couple'
  },
  {
    name: 'Cuisine Tasting Journey',
    duration: '4 hours',
    description: 'Sample authentic Balinese and international cuisine from our preferred caterers.',
    price: '$90 per couple'
  },
  {
    name: 'Photography Location Scout',
    duration: '2 hours',
    description: 'Discover the most Instagram-worthy spots for your wedding photography.',
    price: '$60 per couple'
  },
  {
    name: 'Spa & Wellness Preview',
    duration: '3 hours',
    description: 'Experience relaxation options for you and your wedding party.',
    price: '$80 per couple'
  }
]

export default function ToursPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-section">
        <div className="container-luxury">
          <div className="split-panel">
            <div>
              <h1 className="heading-luxury mb-6">
                Wedding Venue Tours & Experiences
              </h1>
              <p className="subheading-luxury mb-8">
                Discover your perfect wedding venue with guided tours
              </p>
              <div className="body-luxury max-w-lg">
                <p className="mb-6">
                  Nothing beats seeing venues in person. Our carefully curated tours 
                  showcase Bali's most beautiful wedding locations, allowing you to 
                  experience the magic firsthand.
                </p>
                <p>
                  Each tour is designed to help you understand the unique character 
                  and possibilities of different venue types, making your decision easier.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white p-8 luxury-card">
                <div className="text-center">
                  <div className="text-4xl font-light text-bali-gold mb-2">111</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Venues Available</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">4</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Tour Types</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">100%</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Satisfaction Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tours */}
      <section className="section-padding">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">Choose Your Venue Tour</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {tours.map((tour) => (
              <div key={tour.id} className="luxury-card overflow-hidden">
                <div className="p-8">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-light text-gray-800 mb-2">
                        {tour.name}
                      </h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>⏰ {tour.duration}</p>
                        <p>🏛️ {tour.venues}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-light text-bali-gold">
                        {tour.price}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {tour.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-light text-gray-800 mb-3">Tour Highlights:</h4>
                    <ul className="space-y-2">
                      {tour.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-bali-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-gray-600 text-sm">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-light text-gray-800 mb-3">Includes:</h4>
                    <ul className="space-y-2">
                      {tour.includes.map((include, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-gray-600 text-sm">{include}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <button className="enquire-button w-full">
                      BOOK THIS TOUR
                    </button>
                    <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
                      GET MORE DETAILS
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Experiences */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Additional Wedding Experiences
          </h2>
          
          <div className="four-across-grid">
            {experiences.map((experience, index) => (
              <div key={index} className="luxury-card p-6 text-center">
                <h3 className="text-lg font-light text-gray-800 mb-3">
                  {experience.name}
                </h3>
                <div className="text-bali-gold font-light mb-2">
                  {experience.duration}
                </div>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {experience.description}
                </p>
                <div className="text-lg font-light text-gray-800 mb-4">
                  {experience.price}
                </div>
                <button className="nav-item text-xs">
                  LEARN MORE →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Booking Process */}
      <section className="section-padding">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-bali-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-light">1</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Choose Your Tour
              </h3>
              <p className="text-gray-600 text-sm">
                Select the venue tour that matches your wedding style and preferences.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bali-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-light">2</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Schedule & Book
              </h3>
              <p className="text-gray-600 text-sm">
                We'll coordinate with venues and arrange your tour at the perfect time.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bali-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-light">3</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Enjoy Your Tour
              </h3>
              <p className="text-gray-600 text-sm">
                Experience venues with our expert guide and get all your questions answered.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-bali-gold rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl font-light">4</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Make Your Choice
              </h3>
              <p className="text-gray-600 text-sm">
                With detailed venue information, make your confident decision and book.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tour Benefits */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Why Take a Venue Tour?
          </h2>
          
          <div className="four-across-grid">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">👀</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                See the Reality
              </h3>
              <p className="text-gray-600 text-sm">
                Photos can't capture everything. Experience the actual space, 
                lighting, and atmosphere in person.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Save Money
              </h3>
              <p className="text-gray-600 text-sm">
                Avoid costly mistakes by seeing exactly what you're booking 
                before making your final decision.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Efficient Planning
              </h3>
              <p className="text-gray-600 text-sm">
                See multiple venues in one day with expert guidance, 
                making your selection process much faster.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Perfect Match
              </h3>
              <p className="text-gray-600 text-sm">
                Find the venue that truly matches your vision and feels 
                right for your special celebration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury text-center">
          <h2 className="heading-luxury mb-6">
            Ready to Explore Bali's Best Venues?
          </h2>
          <p className="subheading-luxury mb-8 max-w-2xl mx-auto">
            Book your venue tour today and discover the perfect location for your dream wedding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="enquire-button">
              BOOK YOUR VENUE TOUR
            </Link>
            <Link href="/venues" className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
              BROWSE ALL VENUES
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}