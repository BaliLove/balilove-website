import Header from './components/Header'
import Footer from './components/Footer'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-light text-gray-800 mb-6">
            CELEBRATING LOVE
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-gray-700 mb-8">
            in the BEAUTIFUL ISLAND of BALI
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Experience the magic of a destination wedding in Bali with our expert wedding planning services. 
            We specialize in creating unforgettable celebrations across Bali&apos;s most stunning venues.
          </p>
          <div className="mt-12">
            <button className="enquire-button px-8 py-3 text-sm">
              START YOUR JOURNEY
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-light text-gray-800 mb-4">
              Our Services
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From intimate villa ceremonies to grand beachfront celebrations, 
              we bring your dream wedding to life in paradise.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Wedding Packages */}
            <div className="text-center group">
              <div className="h-64 bg-gray-100 mb-6 rounded-lg overflow-hidden">
                <div className="h-full flex items-center justify-center text-gray-400">
                  Package Image
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-800 mb-3">Wedding Packages</h3>
              <p className="text-gray-600 mb-4">
                Curated wedding packages designed for every style and budget, 
                from intimate gatherings to grand celebrations.
              </p>
              <a href="/packages" className="nav-item text-sm">
                VIEW PACKAGES →
              </a>
            </div>

            {/* Wedding Planning */}
            <div className="text-center group">
              <div className="h-64 bg-gray-100 mb-6 rounded-lg overflow-hidden">
                <div className="h-full flex items-center justify-center text-gray-400">
                  Planning Image
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-800 mb-3">Wedding Planning</h3>
              <p className="text-gray-600 mb-4">
                Expert local wedding planners with 40+ years combined experience 
                ensuring every detail is perfect.
              </p>
              <a href="/planning" className="nav-item text-sm">
                LEARN MORE →
              </a>
            </div>

            {/* Venues */}
            <div className="text-center group">
              <div className="h-64 bg-gray-100 mb-6 rounded-lg overflow-hidden">
                <div className="h-full flex items-center justify-center text-gray-400">
                  Venue Image
                </div>
              </div>
              <h3 className="text-xl font-light text-gray-800 mb-3">Exclusive Venues</h3>
              <p className="text-gray-600 mb-4">
                Access to Bali&apos;s most stunning wedding venues, from luxury villas 
                to beachfront locations and traditional settings.
              </p>
              <Link href="/venues" className="nav-item text-sm">
                EXPLORE VENUES →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <h3 className="text-3xl font-light text-gray-800 mb-2">40+</h3>
              <p className="text-gray-600">Years Combined Experience</p>
            </div>
            <div>
              <h3 className="text-3xl font-light text-gray-800 mb-2">100</h3>
              <p className="text-gray-600">Wedding Limit Per Year</p>
            </div>
            <div>
              <h3 className="text-3xl font-light text-gray-800 mb-2">111</h3>
              <p className="text-gray-600">Exclusive Venues</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promise Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-light text-gray-800 mb-8">
            Our Promise to You
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-light text-gray-800 mb-3">Transparent Pricing</h3>
              <p className="text-gray-600 text-sm">
                Clear, upfront pricing with no hidden costs or high-pressure sales tactics.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-800 mb-3">Genuine Care</h3>
              <p className="text-gray-600 text-sm">
                Your wedding is as important to us as it is to you. We care about every detail.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-light text-gray-800 mb-3">Prompt Communication</h3>
              <p className="text-gray-600 text-sm">
                Quick responses and clear communication throughout your planning journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}