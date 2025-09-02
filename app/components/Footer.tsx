import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-light text-gray-800 mb-4 block">
              BALI LOVE
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Creating unforgettable destination weddings in Bali with over 40 years of combined experience. 
              We specialize in luxury villa weddings, beachfront ceremonies, and authentic Balinese celebrations.
            </p>
            <div className="text-sm text-gray-500">
              <p className="mb-1">Limited to 100 weddings per year</p>
              <p>Transparent pricing • Genuine care • Prompt communication</p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/packages" className="text-sm text-gray-600 hover:text-[#B29A7B]">
                  Wedding Packages
                </Link>
              </li>
              <li>
                <Link href="/venues" className="text-sm text-gray-600 hover:text-[#B29A7B]">
                  Venues
                </Link>
              </li>
              <li>
                <Link href="/planning" className="text-sm text-gray-600 hover:text-[#B29A7B]">
                  Planning Services
                </Link>
              </li>
              <li>
                <Link href="/tours" className="text-sm text-gray-600 hover:text-[#B29A7B]">
                  Tours & Experiences
                </Link>
              </li>
              <li>
                <Link href="/real-weddings" className="text-sm text-gray-600 hover:text-[#B29A7B]">
                  Real Weddings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Bali, Indonesia</li>
              <li>
                <a href="mailto:info@bali.love" className="hover:text-[#B29A7B]">
                  info@bali.love
                </a>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#B29A7B]">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              © 2024 Bali Love. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <Link href="/contact" className="enquire-button px-6 py-2 text-xs">
                ENQUIRE NOW
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}