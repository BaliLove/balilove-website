import { Metadata } from 'next'
import Link from 'next/link'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Wedding Planning Services in Bali | Expert Destination Wedding Planners',
  description: 'Professional wedding planning services in Bali. From venue selection to day-of coordination, our experienced team creates unforgettable destination weddings.',
  keywords: 'Bali wedding planning, destination wedding planner, wedding coordinator Bali, wedding planning services',
}

const planningServices = [
  {
    name: 'Complete Wedding Planning',
    description: 'Full-service planning from engagement to wedding day',
    features: [
      'Initial consultation & vision development',
      'Budget planning & management',
      'Venue selection & booking',
      'Vendor sourcing & coordination',
      'Timeline creation & management',
      'Design & styling consultation',
      'Guest logistics coordination',
      'Day-of wedding coordination'
    ],
    ideal: 'Couples who want a stress-free planning experience with expert guidance every step of the way.'
  },
  {
    name: 'Partial Planning & Coordination',
    description: 'Support with specific aspects of your wedding planning',
    features: [
      'Venue consultation & selection',
      'Vendor recommendations & booking',
      'Design concept development',
      'Timeline & logistics planning',
      'Month-of coordination',
      'Day-of coordination & management',
      'Vendor payment coordination',
      'Emergency day-of support'
    ],
    ideal: 'Couples who have started planning but need professional expertise for specific areas.'
  },
  {
    name: 'Day-of Coordination',
    description: 'Professional coordination for your wedding day',
    features: [
      'Final timeline confirmation',
      'Vendor coordination & management',
      'Setup supervision',
      'Guest assistance & direction',
      'Ceremony coordination',
      'Reception management',
      'Problem-solving & contingencies',
      'Cleanup coordination'
    ],
    ideal: 'Couples who have planned their wedding but want professional day-of support.'
  },
  {
    name: 'Destination Wedding Specialist',
    description: 'Expert guidance for international couples',
    features: [
      'Legal requirements guidance',
      'Document preparation assistance',
      'Guest travel coordination',
      'Accommodation recommendations',
      'Cultural integration consulting',
      'Language barrier assistance',
      'Local customs education',
      'Extended celebration planning'
    ],
    ideal: 'International couples needing specialized support for destination wedding logistics.'
  }
]

const planningProcess = [
  {
    phase: 'Discovery & Vision',
    timeline: '12-18 months before',
    description: 'We start by understanding your dream wedding vision, style preferences, and budget.',
    activities: [
      'Initial consultation call',
      'Vision board creation',
      'Style preference assessment',
      'Budget establishment',
      'Timeline development'
    ]
  },
  {
    phase: 'Venue & Vendor Selection',
    timeline: '10-12 months before',
    description: 'Together we select your perfect venue and curate a team of exceptional vendors.',
    activities: [
      'Venue tours & selection',
      'Vendor interviews & selection',
      'Contract negotiations',
      'Initial design concepts',
      'Save the date planning'
    ]
  },
  {
    phase: 'Design & Details',
    timeline: '6-10 months before',
    description: 'We bring your vision to life with detailed design planning and coordination.',
    activities: [
      'Detailed design development',
      'Menu planning & tastings',
      'Floral design & selection',
      'Entertainment booking',
      'Invitation suite creation'
    ]
  },
  {
    phase: 'Final Coordination',
    timeline: '1-3 months before',
    description: 'We finalize all details and ensure everything is perfectly coordinated.',
    activities: [
      'Final headcount confirmation',
      'Timeline finalization',
      'Vendor final confirmations',
      'Rehearsal coordination',
      'Emergency planning'
    ]
  },
  {
    phase: 'Wedding Day Magic',
    timeline: 'Your special day',
    description: 'We coordinate every detail so you can focus on celebrating your love.',
    activities: [
      'Day-of coordination',
      'Vendor management',
      'Guest assistance',
      'Timeline execution',
      'Problem resolution'
    ]
  }
]

export default function PlanningPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-section">
        <div className="container-luxury">
          <div className="split-panel">
            <div>
              <h1 className="heading-luxury mb-6">
                Wedding Planning Services
              </h1>
              <p className="subheading-luxury mb-8">
                Expert guidance for your perfect Bali wedding
              </p>
              <div className="body-luxury max-w-lg">
                <p className="mb-6">
                  With over 40 years of combined experience, our wedding planning team 
                  brings unmatched expertise to creating extraordinary celebrations in Bali.
                </p>
                <p>
                  We handle every detail with precision and care, allowing you to focus 
                  on what matters most - celebrating your love story.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white p-8 luxury-card">
                <div className="text-center">
                  <div className="text-4xl font-light text-bali-gold mb-2">2000+</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Weddings Planned</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">100</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Annual Wedding Limit</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">24hr</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Response Guarantee</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Services */}
      <section className="section-padding">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">Our Planning Services</h2>
          
          <div className="space-y-8">
            {planningServices.map((service, index) => (
              <div key={index} className="luxury-card overflow-hidden">
                <div className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div>
                      <h3 className="text-2xl font-light text-gray-800 mb-4">
                        {service.name}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <div className="bg-bali-cream p-4 rounded">
                        <p className="text-sm text-gray-700 font-medium mb-2">Ideal for:</p>
                        <p className="text-sm text-gray-600">{service.ideal}</p>
                      </div>
                    </div>
                    
                    <div className="lg:col-span-2">
                      <h4 className="text-lg font-light text-gray-800 mb-4">What's Included:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {service.features.map((feature, featureIndex) => (
                          <div key={featureIndex} className="flex items-start">
                            <span className="w-2 h-2 bg-bali-gold rounded-full mr-3 mt-2 flex-shrink-0"></span>
                            <span className="text-gray-600 text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-4">
                    <button className="enquire-button">
                      GET DETAILED PRICING
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
                      SCHEDULE CONSULTATION
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Planning Process Timeline */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">Our Planning Process</h2>
          
          <div className="relative">
            {/* Timeline line - hidden on mobile */}
            <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px bg-bali-gold"></div>
            
            <div className="space-y-12">
              {planningProcess.map((phase, index) => (
                <div key={index} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="hidden lg:flex items-center justify-center w-16 h-16 bg-bali-gold rounded-full text-white font-light text-sm flex-shrink-0 z-10">
                    {index + 1}
                  </div>
                  
                  {/* Content */}
                  <div className="lg:ml-8 bg-white p-6 luxury-card flex-1">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <h3 className="text-xl font-light text-gray-800">
                        {phase.phase}
                      </h3>
                      <span className="text-sm text-bali-gold font-medium mt-1 md:mt-0">
                        {phase.timeline}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {phase.description}
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {phase.activities.map((activity, activityIndex) => (
                        <div key={activityIndex} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-bali-gold rounded-full mr-2 mt-2 flex-shrink-0"></span>
                          <span className="text-gray-600 text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Our Planning Services */}
      <section className="section-padding">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Why Choose Bali Love Planning?
          </h2>
          
          <div className="four-across-grid">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Proven Experience
              </h3>
              <p className="text-gray-600 text-sm">
                Over 2,000 successful weddings with 40+ years of combined team experience 
                in luxury destination weddings.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Local Expertise
              </h3>
              <p className="text-gray-600 text-sm">
                Deep understanding of Balinese culture, local regulations, and the best 
                vendors to bring your vision to life.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Transparent Process
              </h3>
              <p className="text-gray-600 text-sm">
                Clear communication, honest pricing, and no hidden fees. You'll know 
                exactly what to expect every step of the way.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Responsive Support
              </h3>
              <p className="text-gray-600 text-sm">
                24-hour response guarantee and dedicated support throughout your 
                planning journey and on your wedding day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Planning Tips */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Essential Planning Tips for Bali Weddings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-4">
                Start Early
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Begin planning 12-18 months in advance, especially for peak season 
                weddings (April-September).
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Secure your preferred venue</li>
                <li>• Book top vendors early</li>
                <li>• Allow time for legal requirements</li>
              </ul>
            </div>

            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-4">
                Consider the Weather
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Bali's dry season (April-September) is ideal, but shoulder seasons 
                offer great weather and lower costs.
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Plan for monsoon season alternatives</li>
                <li>• Consider indoor/outdoor flexibility</li>
                <li>• Sunset timing varies by season</li>
              </ul>
            </div>

            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-4">
                Guest Logistics
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Help your guests with travel planning, accommodation, and local 
                information for the best experience.
              </p>
              <ul className="space-y-1 text-xs text-gray-600">
                <li>• Provide accommodation options</li>
                <li>• Share local activity suggestions</li>
                <li>• Arrange group transportation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury text-center">
          <h2 className="heading-luxury mb-6">
            Ready to Start Planning Your Dream Wedding?
          </h2>
          <p className="subheading-luxury mb-8 max-w-2xl mx-auto">
            Schedule a complimentary consultation to discuss your wedding vision and 
            discover how we can bring it to life in Bali.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="enquire-button">
              SCHEDULE FREE CONSULTATION
            </Link>
            <Link href="/packages" className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
              VIEW WEDDING PACKAGES
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}