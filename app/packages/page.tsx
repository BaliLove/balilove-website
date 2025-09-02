import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Wedding Packages in Bali | All-Inclusive Destination Wedding Planning',
  description: 'Discover our curated Bali wedding packages. From intimate ceremonies to grand celebrations, we offer transparent pricing and personalized planning for your dream wedding.',
  keywords: 'Bali wedding packages, destination wedding packages, all-inclusive wedding Bali, wedding planning packages, luxury wedding Bali',
}

const packages = [
  {
    id: 'intimate',
    name: 'Intimate Ceremony',
    price: 'From $8,500',
    guests: 'Up to 30 guests',
    description: 'Perfect for couples seeking an intimate celebration with close family and friends.',
    features: [
      'Ceremony venue coordination',
      'Professional photography (4 hours)',
      'Bridal bouquet & boutonniere',
      'Welcome drinks for guests',
      'Ceremonial decorations',
      'Wedding coordinator',
      'Legal ceremony assistance',
      'Sunset cocktails'
    ],
    popular: false
  },
  {
    id: 'signature',
    name: 'Signature Celebration',
    price: 'From $15,000',
    guests: 'Up to 60 guests',
    description: 'Our most popular package combining ceremony and reception in stunning locations.',
    features: [
      'Ceremony & reception venue',
      'Professional photography (8 hours)',
      'Videography highlights',
      'Bridal flowers & decorations',
      'Welcome dinner for guests',
      '3-course wedding dinner',
      'Open bar (4 hours)',
      'Wedding coordinator',
      'Hair & makeup trial',
      'Spa treatment for couple'
    ],
    popular: true
  },
  {
    id: 'luxury',
    name: 'Luxury Experience',
    price: 'From $25,000',
    guests: 'Up to 100 guests',
    description: 'The ultimate luxury wedding experience with premium venues and services.',
    features: [
      'Exclusive venue buyout',
      'Professional photography (full day)',
      'Cinematic videography',
      'Premium floral arrangements',
      'Welcome party',
      'Rehearsal dinner',
      '5-course gourmet dinner',
      'Premium bar service',
      'Live entertainment',
      'Dedicated planning team',
      'Spa day for couple',
      'Guest transportation'
    ],
    popular: false
  },
  {
    id: 'bespoke',
    name: 'Bespoke Wedding',
    price: 'Custom Quote',
    guests: '100+ guests',
    description: 'Completely customized wedding designed specifically for your vision and preferences.',
    features: [
      'Fully customized design',
      'Multiple venue options',
      'Extended photography/videography',
      'Custom floral concepts',
      'Multi-day celebrations',
      'Guest experience curation',
      'Custom entertainment',
      'Gourmet catering options',
      'Premium accommodation packages',
      'Personal concierge service',
      'Cultural experiences',
      'Post-wedding activities'
    ],
    popular: false
  }
]

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-section">
        <div className="container-luxury">
          <div className="split-panel">
            <div>
              <h1 className="heading-luxury mb-6">
                Wedding Packages
              </h1>
              <p className="subheading-luxury mb-8">
                Transparent pricing for your dream Bali wedding
              </p>
              <div className="body-luxury max-w-lg">
                <p className="mb-6">
                  Our carefully curated wedding packages are designed to take the stress out of 
                  planning your destination wedding while ensuring every detail reflects your 
                  personal style and vision.
                </p>
                <p>
                  All packages include our signature transparent pricing promise - no hidden costs, 
                  no surprise fees, just honest pricing for exceptional service.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white p-8 luxury-card">
                <div className="text-center">
                  <div className="text-4xl font-light text-bali-gold mb-2">100%</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Transparent Pricing</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">0</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Hidden Fees</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">24hr</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Response Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg) => (
              <div 
                key={pkg.id} 
                className={`luxury-card overflow-hidden ${pkg.popular ? 'ring-2 ring-bali-gold' : ''}`}
              >
                {pkg.popular && (
                  <div className="bg-bali-gold text-white text-center py-2 text-sm font-medium uppercase tracking-wider">
                    Most Popular Choice
                  </div>
                )}
                
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-light text-gray-800 mb-2">
                      {pkg.name}
                    </h3>
                    <div className="text-3xl font-light text-bali-gold mb-2">
                      {pkg.price}
                    </div>
                    <div className="text-sm text-gray-600 mb-4">
                      {pkg.guests}
                    </div>
                    <p className="text-gray-600 leading-relaxed">
                      {pkg.description}
                    </p>
                  </div>

                  <div className="mb-8">
                    <h4 className="text-lg font-light text-gray-800 mb-4">Included:</h4>
                    <ul className="space-y-3">
                      {pkg.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-bali-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                          <span className="text-gray-600 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <button className="enquire-button w-full">
                      GET DETAILED QUOTE
                    </button>
                    <button className="w-full px-6 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
                      CUSTOMIZE PACKAGE
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Packages */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Why Choose Our Wedding Packages?
          </h2>
          
          <div className="four-across-grid">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Transparent Pricing
              </h3>
              <p className="text-gray-600 text-sm">
                No hidden costs or surprise fees. Everything is clearly outlined upfront 
                so you can plan with confidence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Fully Customizable
              </h3>
              <p className="text-gray-600 text-sm">
                Every package can be tailored to your specific needs, preferences, 
                and budget. Your wedding, your way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Expert Planning
              </h3>
              <p className="text-gray-600 text-sm">
                40+ years of combined experience ensures every detail is perfectly 
                executed by our local wedding specialists.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Vendor Relationships
              </h3>
              <p className="text-gray-600 text-sm">
                Our established relationships with Bali's best vendors ensure 
                quality service and preferred pricing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Package Comparison */}
      <section className="section-padding">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Compare Our Packages
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full min-w-4xl">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 pr-4 font-light text-gray-800">Features</th>
                  <th className="text-center py-4 px-4 font-light text-gray-800">Intimate</th>
                  <th className="text-center py-4 px-4 font-light text-gray-800">Signature</th>
                  <th className="text-center py-4 px-4 font-light text-gray-800">Luxury</th>
                  <th className="text-center py-4 pl-4 font-light text-gray-800">Bespoke</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-600">Professional Photography</td>
                  <td className="text-center py-3 px-4">4 hours</td>
                  <td className="text-center py-3 px-4">8 hours</td>
                  <td className="text-center py-3 px-4">Full day</td>
                  <td className="text-center py-3 pl-4">Extended</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-600">Videography</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">Highlights</td>
                  <td className="text-center py-3 px-4">Cinematic</td>
                  <td className="text-center py-3 pl-4">Custom</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-600">Floral Arrangements</td>
                  <td className="text-center py-3 px-4">Basic</td>
                  <td className="text-center py-3 px-4">Enhanced</td>
                  <td className="text-center py-3 px-4">Premium</td>
                  <td className="text-center py-3 pl-4">Bespoke</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-600">Reception Dinner</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">3-course</td>
                  <td className="text-center py-3 px-4">5-course</td>
                  <td className="text-center py-3 pl-4">Gourmet</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-3 pr-4 text-gray-600">Entertainment</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">-</td>
                  <td className="text-center py-3 px-4">Live music</td>
                  <td className="text-center py-3 pl-4">Custom</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury text-center">
          <h2 className="heading-luxury mb-6">
            Ready to Start Planning?
          </h2>
          <p className="subheading-luxury mb-8 max-w-2xl mx-auto">
            Get a detailed quote for your chosen package or schedule a consultation 
            to discuss your custom wedding vision.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="enquire-button">
              GET YOUR QUOTE
            </Link>
            <button className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
              SCHEDULE CONSULTATION
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}