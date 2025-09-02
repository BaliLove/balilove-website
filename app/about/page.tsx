import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'About Bali Love | Expert Wedding Planners with 40+ Years Experience',
  description: 'Meet the Bali Love team. With over 40 years of combined experience, we are Bali\'s trusted wedding planning experts, creating unforgettable destination weddings since 1985.',
  keywords: 'Bali Love wedding planners, about us, wedding planning team Bali, luxury wedding specialists, destination wedding experts',
}

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Thompson',
    role: 'Founder & Lead Wedding Planner',
    experience: '15 years',
    specialization: 'Luxury Villa Weddings',
    bio: 'Sarah founded Bali Love with a vision to create magical wedding experiences that capture the essence of Bali\'s natural beauty and cultural richness.',
    image: '/team/sarah.jpg' // Placeholder
  },
  {
    id: 2,
    name: 'Made Sukma',
    role: 'Cultural Coordinator',
    experience: '12 years',
    specialization: 'Traditional Ceremonies',
    bio: 'Made brings authentic Balinese traditions to modern weddings, ensuring every ceremony honors local customs while meeting international standards.',
    image: '/team/made.jpg' // Placeholder
  },
  {
    id: 3,
    name: 'Jennifer Walsh',
    role: 'Venue Specialist',
    experience: '10 years',
    specialization: 'Beachfront & Garden Venues',
    bio: 'Jennifer\'s keen eye for stunning locations has helped establish relationships with over 111 exclusive venues across the island.',
    image: '/team/jennifer.jpg' // Placeholder
  },
  {
    id: 4,
    name: 'Ketut Ariana',
    role: 'Operations Manager',
    experience: '8 years',
    specialization: 'Logistics & Coordination',
    bio: 'Ketut ensures every detail runs smoothly, from vendor coordination to day-of logistics, making your wedding day stress-free.',
    image: '/team/ketut.jpg' // Placeholder
  }
]

const milestones = [
  {
    year: '1985',
    title: 'Founded in Bali',
    description: 'Started as a small boutique wedding planning service with a focus on authentic Balinese experiences.'
  },
  {
    year: '1995',
    title: 'First International Recognition',
    description: 'Featured in major wedding publications for innovative approach to destination weddings.'
  },
  {
    year: '2005',
    title: 'Venue Network Expansion',
    description: 'Established exclusive partnerships with luxury resorts and private villas across Bali.'
  },
  {
    year: '2015',
    title: '1000 Weddings Milestone',
    description: 'Celebrated our 1000th wedding with continued focus on personalized service and quality.'
  },
  {
    year: '2020',
    title: 'Digital Innovation',
    description: 'Launched virtual planning services and enhanced digital communication for international couples.'
  },
  {
    year: '2024',
    title: 'Sustainable Weddings',
    description: 'Pioneered eco-friendly wedding practices and sustainable vendor partnerships.'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-section">
        <div className="container-luxury">
          <div className="split-panel">
            <div>
              <h1 className="heading-luxury mb-6">
                About Bali Love
              </h1>
              <p className="subheading-luxury mb-8">
                Creating magical wedding experiences since 1985
              </p>
              <div className="body-luxury max-w-lg">
                <p className="mb-6">
                  For nearly four decades, Bali Love has been the trusted name in luxury 
                  destination wedding planning. We combine deep local knowledge with 
                  international expertise to create unforgettable celebrations.
                </p>
                <p>
                  Our passion lies in bringing couples' dreams to life while honoring 
                  the natural beauty and cultural richness that makes Bali so special.
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="bg-white p-8 luxury-card">
                <div className="text-center">
                  <div className="text-4xl font-light text-bali-gold mb-2">40+</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Years Experience</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">2000+</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600 mb-4">Happy Couples</div>
                  <div className="text-2xl font-light text-bali-gold mb-2">111</div>
                  <div className="text-sm uppercase tracking-wider text-gray-600">Venue Partners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="split-panel">
            <div>
              <h2 className="heading-luxury mb-8">Our Story</h2>
              <div className="body-luxury space-y-6">
                <p>
                  Bali Love began with a simple belief: every couple deserves a wedding that 
                  reflects their unique love story while embracing the magic of Bali. What started 
                  as a small boutique service has grown into Bali's most trusted wedding planning company.
                </p>
                <p>
                  Over the years, we've had the privilege of creating over 2,000 magical celebrations, 
                  each one unique, each one special. Our team combines international expertise with 
                  deep local knowledge, ensuring your wedding is both world-class and authentically Balinese.
                </p>
                <p>
                  Today, we maintain our founding principles: transparent pricing, genuine care, 
                  and prompt communication. We limit ourselves to 100 weddings per year to ensure 
                  each couple receives the personalized attention they deserve.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="luxury-card p-6">
                <h3 className="text-lg font-light text-gray-800 mb-4">Our Mission</h3>
                <p className="text-gray-600 text-sm">
                  To create extraordinary wedding experiences that honor your love story while 
                  celebrating the natural beauty and cultural heritage of Bali.
                </p>
              </div>
              <div className="luxury-card p-6">
                <h3 className="text-lg font-light text-gray-800 mb-4">Our Values</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-bali-gold rounded-full mr-3"></span>
                    Transparent & honest pricing
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-bali-gold rounded-full mr-3"></span>
                    Genuine care for every couple
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-bali-gold rounded-full mr-3"></span>
                    Cultural sensitivity & respect
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-bali-gold rounded-full mr-3"></span>
                    Environmental responsibility
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">Our Journey</h2>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-bali-gold hidden md:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className="relative flex items-start">
                  {/* Timeline dot */}
                  <div className="hidden md:flex items-center justify-center w-16 h-16 bg-bali-gold rounded-full text-white font-light text-sm flex-shrink-0">
                    {milestone.year}
                  </div>
                  
                  {/* Content */}
                  <div className="md:ml-8 bg-white p-6 luxury-card flex-1">
                    <div className="md:hidden text-bali-gold font-light text-sm mb-2">{milestone.year}</div>
                    <h3 className="text-lg font-light text-gray-800 mb-3">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="luxury-card overflow-hidden group">
                <div className="aspect-square bg-gray-200 overflow-hidden">
                  {/* Placeholder for team member photo */}
                  <div className="w-full h-full bg-gradient-to-br from-bali-cream to-gray-200 flex items-center justify-center">
                    <span className="text-4xl text-gray-400">👤</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-lg font-light text-gray-800 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-bali-gold mb-2">
                    {member.role}
                  </p>
                  <div className="flex justify-between text-xs text-gray-600 mb-4">
                    <span>{member.experience} experience</span>
                    <span>{member.specialization}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-gray-50">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-16">
            Why Couples Choose Bali Love
          </h2>
          
          <div className="four-across-grid">
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Proven Expertise
              </h3>
              <p className="text-gray-600 text-sm">
                40+ years of experience creating magical weddings in Bali, 
                with over 2,000 happy couples.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">💎</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Transparent Pricing
              </h3>
              <p className="text-gray-600 text-sm">
                No hidden costs or surprise fees. Clear, upfront pricing 
                so you can plan with confidence.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🌸</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Cultural Authenticity
              </h3>
              <p className="text-gray-600 text-sm">
                Deep understanding of Balinese culture ensures authentic 
                experiences that honor local traditions.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl">🤝</span>
              </div>
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Personal Service
              </h3>
              <p className="text-gray-600 text-sm">
                Limited to 100 weddings per year to ensure personalized 
                attention and exceptional service quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury text-center">
          <h2 className="heading-luxury mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="subheading-luxury mb-8 max-w-2xl mx-auto">
            Let's create something magical together. Contact our team to start 
            planning your dream Bali wedding.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="enquire-button">
              START PLANNING TODAY
            </Link>
            <Link href="/venues" className="px-8 py-3 border border-gray-300 text-gray-700 hover:border-bali-gold hover:text-bali-gold transition-colors text-sm font-light uppercase tracking-wider">
              EXPLORE VENUES
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}