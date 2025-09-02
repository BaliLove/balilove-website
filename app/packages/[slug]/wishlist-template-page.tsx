import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { client } from "@/sanity/lib/client";
import { getImageUrl } from "@/sanity/lib/image";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import GlobalCTA from "../../components/GlobalCTA";
import EnhancedPricingCalculator from "../../components/EnhancedPricingCalculator";
import PlannerCallCTA from "../../components/PlannerCallCTA";

// Fetch single wishlist template by slug
async function getWishlistTemplate(slug: string) {
  return client.fetch(`
    *[_type == "wishlistTemplate" && slug.current == $slug][0] {
      _id,
      name,
      slug,
      description,
      templateType,
      guestCount,
      estimatedPricing,
      featured,
      bubbleId,
      "products": products[] {
        quantity,
        isOptional,
        category,
        "product": product-> {
          _id,
          name,
          slug,
          vendorTradingName,
          description,
          images,
          categories,
          pricing,
          availability,
          status,
          bubbleId
        }
      },
      suitableVenues[]-> {
        _id,
        name,
        slug,
        "area": location.area
      }
    }
  `, { slug });
}

// Category mapping to match your Glamp Nusa system
const CATEGORY_MAPPING = {
  'planning': { label: 'Wedding Planning', icon: '📋', order: 1 },
  'venue-services': { label: 'Venue', icon: '🏛️', order: 2 },
  'accommodation': { label: 'Accommodation', icon: '🏠', order: 3 },
  'beauty': { label: 'Hair & Makeup', icon: '💄', order: 4 },
  'photography': { label: 'Photo & Video', icon: '📸', order: 5 },
  'ceremony': { label: 'Celebrants & MC', icon: '💒', order: 6 },
  'catering': { label: 'Catering', icon: '🍽️', order: 7 },
  'entertainment': { label: 'Entertainment', icon: '🎭', order: 8 },
  'styling': { label: 'Florist & Styling', icon: '🌺', order: 10 },
  'transportation': { label: 'Transport', icon: '🚗', order: 13 }
};

export default async function WishlistTemplateDetailPage({ params }: { params: { slug: string } }) {
  const template = await getWishlistTemplate(params.slug);
  
  if (!template) {
    notFound();
  }

  // Group products by category
  const productsByCategory: { [key: string]: any[] } = {};
  
  template.products.forEach(tp => {
    const category = tp.product.categories[0] || 'other';
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(tp);
  });

  // Sort categories by order
  const sortedCategories = Object.keys(productsByCategory)
    .map(key => ({
      key,
      products: productsByCategory[key],
      ...CATEGORY_MAPPING[key as keyof typeof CATEGORY_MAPPING] || { label: key, icon: '📦', order: 99 }
    }))
    .sort((a, b) => a.order - b.order);

  // Get hero image from first product
  const heroImage = template.products[0]?.product?.images?.[0];

  return (
    <div className="min-h-screen bg-[#F5F3EF] font-cardo text-[#333333]">
      <Header />

      {/* Hero Section - Split Panel */}
      <section className="border-b border-black">
        <div className="flex flex-col lg:flex-row">
          {/* Hero Image */}
          <div className="w-full lg:w-1/2 h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-black">
            {heroImage ? (
              <Image
                src={getImageUrl(heroImage, { width: 800, height: 600 })}
                alt={`${template.name} wedding package`}
                width={800}
                height={600}
                className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]"
              />
            ) : (
              <div className="w-full h-[400px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold text-lg">{template.name}</span>
              </div>
            )}
          </div>

          {/* Package Info */}
          <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16 bg-[#F5F3EF]">
            <div className="mb-4">
              <span className="text-[#B29A7B] text-sm font-bold uppercase tracking-widest">
                {template.templateType?.replace('-', ' ')} Wedding Package
              </span>
            </div>
            
            <h1 className="font-cardo text-4xl lg:text-5xl font-light text-[#333] mb-6 leading-tight">
              {template.name.toUpperCase()}
            </h1>
            
            <div className="font-cardo text-[15px] text-[#333] leading-relaxed mb-6">
              <p>Complete {template.templateType?.replace('-', ' ')} wedding experience with {template.estimatedPricing?.totalProducts || 0} professionally curated items and services.</p>
            </div>

            <div className="flex flex-col gap-4 mb-8">
              <div>
                <span className="text-[#666] text-sm uppercase tracking-wide">Starting from</span>
                <div className="font-cardo text-3xl font-bold text-[#333]">
                  ${template.estimatedPricing?.totalSellPriceUSD?.toLocaleString() || 'TBD'} USD
                </div>
                <div className="text-sm text-[#B29A7B]">
                  Based on {template.guestCount?.optimal || 50} guests
                </div>
              </div>
              
              <div className="text-sm text-[#666] space-y-1">
                <div>• {template.estimatedPricing?.totalProducts || 0} curated items included</div>
                <div>• Professional vendors & full coordination</div>
                <div>• Transparent pricing with live currency conversion</div>
                <div>• No hidden fees or surprises</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/contact"
                className="bg-[#D79E92] hover:bg-[#c48b7f] text-white px-8 py-4 text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 text-center"
              >
                GET CUSTOM QUOTE
              </Link>
              <Link 
                href="#calculator"
                className="bg-transparent border-2 border-[#333] text-[#333] hover:bg-[#333] hover:text-white px-8 py-4 text-sm font-bold transition-all duration-300 text-center"
              >
                CALCULATE PRICING
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Calculator */}
      <section id="calculator" className="py-16 px-4 border-b border-black">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-8 text-center">
            CUSTOMIZE FOR YOUR WEDDING
          </h2>
          
          <EnhancedPricingCalculator template={template} />
        </div>
      </section>

      {/* What's Included - Organized by Category */}
      <section className="py-16 px-4 border-b border-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-12 text-center">
            WHAT'S INCLUDED IN YOUR PACKAGE
          </h2>

          <div className="space-y-12">
            {sortedCategories.map((category, categoryIndex) => (
              <div key={category.key} className="border-b border-gray-200 pb-8 last:border-b-0">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-[#B29A7B] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {categoryIndex + 1}
                  </div>
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-cardo text-xl font-bold text-[#333] uppercase">
                    {category.label}
                  </h3>
                  <span className="text-sm text-[#B29A7B] bg-[#B29A7B] bg-opacity-10 px-2 py-1 rounded">
                    {category.products.length} item{category.products.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Category Products */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.products.map((tp: any) => {
                    const product = tp.product;
                    const pricing = product.pricing;
                    
                    return (
                      <div key={product._id} className="bg-white border border-gray-200 rounded p-4 hover:shadow-md transition-shadow duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-bold text-[#333] text-sm leading-tight">
                            {product.name}
                          </h4>
                          {pricing?.isVenueInclusion && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">
                              INCLUDED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-[#B29A7B] font-bold uppercase tracking-wide mb-3">
                          {product.vendorTradingName}
                        </p>
                        
                        {/* Pricing Display */}
                        {pricing?.isVenueInclusion ? (
                          <div className="text-sm text-green-600 font-bold">
                            Venue Inclusion - No Extra Cost
                          </div>
                        ) : pricing?.model === 'constant' && pricing.constantPricing ? (
                          <div className="text-sm">
                            <div className="font-bold text-[#333]">
                              {pricing.constantPricing.sellPrice.toLocaleString()} IDR
                            </div>
                            <div className="text-xs text-[#666]">
                              ≈ ${Math.round(pricing.constantPricing.sellPrice / 16388)} USD
                            </div>
                            {tp.quantity > 1 && (
                              <div className="text-xs text-[#B29A7B] mt-1">
                                Quantity: {tp.quantity}
                              </div>
                            )}
                          </div>
                        ) : pricing?.model === 'variable' && pricing.variablePricing ? (
                          <div className="text-sm">
                            <div className="font-bold text-[#333]">
                              Variable Pricing
                            </div>
                            <div className="text-xs text-[#666]">
                              {pricing.variablePricing.unitType?.replace('-', ' ')} • 
                              {pricing.variablePricing.baseSellPrice?.toLocaleString()} IDR per unit
                            </div>
                            {pricing.calculationNotes && (
                              <div className="text-xs text-[#B29A7B] mt-1 italic">
                                {pricing.calculationNotes}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-[#666] italic">
                            Contact for pricing
                          </div>
                        )}
                        
                        {tp.isOptional && (
                          <div className="text-xs text-orange-600 mt-2 font-bold">
                            🔵 Optional Add-on
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Package Summary */}
      <section className="py-16 px-4 border-b border-black bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-8">
            PACKAGE SUMMARY
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#B29A7B] mb-2">
                {template.estimatedPricing?.totalProducts || 0}
              </div>
              <div className="text-sm uppercase tracking-wide text-[#666]">
                Curated Items
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-[#B29A7B] mb-2">
                ${template.estimatedPricing?.totalSellPriceUSD?.toLocaleString() || 'TBD'}
              </div>
              <div className="text-sm uppercase tracking-wide text-[#666]">
                Starting Price (USD)
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold text-[#B29A7B] mb-2">
                {template.guestCount?.optimal || 50}
              </div>
              <div className="text-sm uppercase tracking-wide text-[#666]">
                Optimal Guest Count
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-sm text-[#666] max-w-2xl mx-auto">
            <p>This package includes everything you need for your {template.templateType?.replace('-', ' ')} wedding in Bali. 
            All pricing is calculated in Indonesian Rupiah (IDR) and automatically converted to your preferred currency.</p>
          </div>
        </div>
      </section>

      {/* Suitable Venues */}
      {template.suitableVenues && template.suitableVenues.length > 0 && (
        <section className="py-16 px-4 border-b border-black">
          <div className="container mx-auto max-w-6xl">
            <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-12 text-center">
              PERFECT FOR THESE VENUES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {template.suitableVenues.map((venue: any) => (
                <Link 
                  key={venue._id}
                  href={`/venues/${venue.slug.current}`}
                  className="group bg-white border border-gray-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600 font-bold">{venue.name}</span>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-cardo text-sm font-bold text-[#333] mb-1 group-hover:text-[#B29A7B] transition-colors">
                      {venue.name}
                    </h3>
                    <p className="text-xs text-[#B29A7B] uppercase tracking-wide">
                      {venue.area} • Bali
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planner Call CTA */}
      <PlannerCallCTA venueName={`${template.name} Package`} />

      <GlobalCTA />
      <Footer />
    </div>
  );
}