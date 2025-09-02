import { Metadata } from 'next'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Contact Us | Bali Love Wedding Planning - Get Your Free Quote',
  description: 'Contact Bali Love for your dream wedding consultation. Get transparent pricing, expert advice, and personalized wedding planning services. Response within 24 hours.',
  keywords: 'contact Bali wedding planner, wedding consultation Bali, wedding quote Bali, Bali Love contact information',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 hero-section">
        <div className="container-luxury">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="heading-luxury mb-6">
              Let's Plan Your Dream Wedding
            </h1>
            <p className="subheading-luxury mb-8">
              Ready to start your Bali wedding journey? We're here to help every step of the way.
            </p>
            <div className="body-luxury">
              <p className="mb-6">
                Whether you're just starting to dream about your Bali wedding or ready to 
                book your perfect venue, our team is here to provide expert guidance, 
                transparent pricing, and personalized service.
              </p>
              <p>
                We respond to all inquiries within 24 hours and offer complimentary 
                initial consultations to help you explore your options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Forms and Info */}
      <section className="section-padding">
        <div className="container-luxury">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Contact Form */}
            <div className="lg:col-span-2">
              <div className="luxury-card p-8">
                <h2 className="text-2xl font-light text-gray-800 mb-8">Get Your Free Wedding Quote</h2>
                
                <form className="form-luxury space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="bride-name">Bride's Name *</label>
                      <input
                        type="text"
                        id="bride-name"
                        name="bride-name"
                        required
                        placeholder="First & Last Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="groom-name">Groom's Name *</label>
                      <input
                        type="text"
                        id="groom-name"
                        name="groom-name"
                        required
                        placeholder="First & Last Name"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email">Email Address *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="wedding-date">Preferred Wedding Date</label>
                      <input
                        type="date"
                        id="wedding-date"
                        name="wedding-date"
                      />
                    </div>
                    <div>
                      <label htmlFor="guest-count">Expected Guest Count</label>
                      <select id="guest-count" name="guest-count">
                        <option value="">Select guest count</option>
                        <option value="intimate">Intimate (10-30 guests)</option>
                        <option value="small">Small (30-60 guests)</option>
                        <option value="medium">Medium (60-100 guests)</option>
                        <option value="large">Large (100+ guests)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="budget">Estimated Budget (USD)</label>
                      <select id="budget" name="budget">
                        <option value="">Select budget range</option>
                        <option value="10-20k">$10,000 - $20,000</option>
                        <option value="20-35k">$20,000 - $35,000</option>
                        <option value="35-50k">$35,000 - $50,000</option>
                        <option value="50k+">$50,000+</option>
                        <option value="custom">Custom/Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="venue-type">Preferred Venue Type</label>
                      <select id="venue-type" name="venue-type">
                        <option value="">Select venue type</option>
                        <option value="villa">Luxury Villa</option>
                        <option value="beach">Beachfront</option>
                        <option value="garden">Garden/Jungle</option>
                        <option value="clifftop">Cliff Top</option>
                        <option value="traditional">Traditional Balinese</option>
                        <option value="resort">Resort/Hotel</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="services">Services You're Interested In</label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      {[
                        'Full Wedding Planning',
                        'Venue Selection',
                        'Photography/Videography',
                        'Catering Services',
                        'Floral Arrangements',
                        'Entertainment',
                        'Transportation',
                        'Guest Accommodation'
                      ].map((service) => (
                        <label key={service} className="flex items-center text-sm">
                          <input 
                            type="checkbox" 
                            name="services" 
                            value={service}
                            className="mr-2"
                          />
                          {service}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message">Tell Us About Your Dream Wedding</label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder="Share your vision, special requests, or any questions you have..."
                    ></textarea>
                  </div>

                  <div>
                    <label className="flex items-start text-sm">
                      <input 
                        type="checkbox" 
                        name="consent" 
                        required
                        className="mr-3 mt-1"
                      />
                      I agree to receive wedding planning information and updates from Bali Love. 
                      We never share your information and you can unsubscribe anytime.
                    </label>
                  </div>

                  <button type="submit" className="enquire-button w-full md:w-auto">
                    SEND MY WEDDING INQUIRY
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information Sidebar */}
            <div className="space-y-6">
              {/* Quick Response Promise */}
              <div className="luxury-card p-6 text-center">
                <div className="w-16 h-16 bg-bali-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-light text-gray-800 mb-2">
                  24-Hour Response
                </h3>
                <p className="text-gray-600 text-sm">
                  We respond to all wedding inquiries within 24 hours, often much sooner!
                </p>
              </div>

              {/* Contact Methods */}
              <div className="luxury-card p-6">
                <h3 className="text-lg font-light text-gray-800 mb-4">Get In Touch</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start">
                    <span className="w-5 h-5 text-bali-gold mr-3 mt-1">📧</span>
                    <div>
                      <div className="text-gray-800 font-medium">Email</div>
                      <div className="text-gray-600">info@bali.love</div>
                      <div className="text-gray-600">weddings@bali.love</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <span className="w-5 h-5 text-bali-gold mr-3 mt-1">📱</span>
                    <div>
                      <div className="text-gray-800 font-medium">WhatsApp</div>
                      <div className="text-gray-600">+62 361 123 4567</div>
                      <div className="text-gray-500 text-xs">Quickest response</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="w-5 h-5 text-bali-gold mr-3 mt-1">☎️</span>
                    <div>
                      <div className="text-gray-800 font-medium">Phone</div>
                      <div className="text-gray-600">+62 361 987 6543</div>
                      <div className="text-gray-500 text-xs">9 AM - 6 PM (GMT+8)</div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="w-5 h-5 text-bali-gold mr-3 mt-1">📍</span>
                    <div>
                      <div className="text-gray-800 font-medium">Office</div>
                      <div className="text-gray-600">Seminyak, Bali</div>
                      <div className="text-gray-600">Indonesia</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="luxury-card p-6">
                <h3 className="text-lg font-light text-gray-800 mb-4">Office Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday</span>
                    <span className="text-gray-800">9 AM - 6 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="text-gray-800">9 AM - 2 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="text-gray-800">By appointment</span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="text-gray-600 text-xs">
                      <strong>Time Zone:</strong> GMT+8 (Bali Time)
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="luxury-card p-6">
                <h3 className="text-lg font-light text-gray-800 mb-4">Wedding Day Support</h3>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">
                    24/7 emergency support available for all our wedding couples on their special day.
                  </p>
                  <div className="text-gray-800 font-medium">
                    Emergency: +62 812 3456 7890
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-bali-cream">
        <div className="container-luxury">
          <h2 className="heading-luxury text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-3">
                How far in advance should we book?
              </h3>
              <p className="text-gray-600 text-sm">
                We recommend booking 6-12 months in advance, especially for peak season 
                (April-September). However, we can accommodate shorter timelines when possible.
              </p>
            </div>

            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Do you help with legal requirements?
              </h3>
              <p className="text-gray-600 text-sm">
                Absolutely! We guide you through all legal requirements for marriage in 
                Indonesia and can arrange ceremonial celebrations for legally married couples.
              </p>
            </div>

            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-3">
                What's included in your planning fee?
              </h3>
              <p className="text-gray-600 text-sm">
                Our transparent pricing includes all planning services, venue coordination, 
                vendor management, and day-of coordination. No hidden fees ever.
              </p>
            </div>

            <div className="luxury-card p-6">
              <h3 className="text-lg font-light text-gray-800 mb-3">
                Can you accommodate dietary restrictions?
              </h3>
              <p className="text-gray-600 text-sm">
                Yes! We work with top caterers who can accommodate all dietary needs including 
                vegan, vegetarian, halal, kosher, and allergy-specific requirements.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}