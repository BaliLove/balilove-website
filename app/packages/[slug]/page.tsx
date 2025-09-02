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
      pricingComplexity,
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

// Fetch similar templates
async function getSimilarTemplates(templateType: string, currentId: string) {
  return client.fetch(`
    *[_type == "wishlistTemplate" && templateType == $templateType && _id != $currentId][0...3] {
      _id,
      name,
      slug,
      templateType,
      estimatedPricing,
      "productCount": length(products),
      "heroImage": products[0].product->images[0]
    }
  `, { templateType, currentId });
}

// Generate metadata
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const template = await getWishlistTemplate(params.slug);
  
  if (!template) {
    return {
      title: "Package Not Found",
    };
  }

  const title = `${template.name} Wedding Package | Bali Love`;
  const description = `Complete ${template.templateType} wedding package with ${template.estimatedPricing?.totalProducts || 0} curated items. Starting from $${template.estimatedPricing?.totalSellPriceUSD?.toLocaleString() || 'TBD'} USD.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function PackageDetailPage({ params }: { params: { slug: string } }) {
  const template = await getWishlistTemplate(params.slug);
  
  if (!template) {
    notFound();
  }

  const similarTemplates = await getSimilarTemplates(template.templateType, template._id);

  // Group products by category for organized display
  const productsByCategory: { [key: string]: any[] } = {};
  
  template.products.forEach(tp => {
    const category = tp.product.categories[0] || 'other';
    if (!productsByCategory[category]) {
      productsByCategory[category] = [];
    }
    productsByCategory[category].push(tp);
  });

  // Category mapping to match your system
  const categoryMapping = {
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

  // Sort categories by order
  const sortedCategories = Object.keys(productsByCategory)
    .map(key => ({
      key,
      products: productsByCategory[key],
      ...categoryMapping[key as keyof typeof categoryMapping] || { label: key, icon: '📦', order: 99 }
    }))
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-[#F5F3EF] font-cardo text-[#333333]">
      <Header />

      {/* Hero Section - Split Panel */}
      <section className="border-b border-black">
        <div className="flex flex-col lg:flex-row">
          {/* Hero Image */}
          <div className="w-full lg:w-1/2 h-auto overflow-hidden border-b lg:border-b-0 lg:border-r border-black">
            {template.products[0]?.product?.images?.[0] ? (
              <Image
                src={getImageUrl(template.products[0].product.images[0], { width: 800, height: 600 })}
                alt={`${template.name} wedding package`}
                width={800}
                height={600}
                className="w-full h-full object-cover min-h-[400px] lg:min-h-[600px]"
              />
            ) : (
              <div className="w-full h-[400px] lg:h-[600px] bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600 font-bold">{template.name}</span>
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
            
            <h1 className="font-cardo text-4xl lg:text-5xl font-light text-[#333333] mb-6 leading-tight">
              {template.name.toUpperCase()}
            </h1>
            
            {template.description && (
              <div className="font-cardo text-[15px] text-[#333] leading-relaxed mb-6">
                {/* Render description blocks */}
                <p>Complete {template.templateType?.replace('-', ' ')} wedding experience with {template.estimatedPricing?.totalProducts || 0} curated items.</p>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <div>
                <span className="text-[#666] text-sm uppercase tracking-wide">Starting from</span>
                <div className="font-cardo text-2xl font-bold text-[#333]">
                  ${template.estimatedPricing?.totalSellPriceUSD?.toLocaleString() || 'TBD'} USD
                </div>
                <span className="text-[#B29A7B] text-sm">
                  Based on {template.guestCount?.optimal || 50} guests
                </span>
              </div>
              
              <div className="text-sm text-[#666]">
                • {template.estimatedPricing?.totalProducts || 0} items included
                • Professional vendors & coordination
                • Transparent pricing with no hidden fees
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Calculator */}
      <section className="py-16 px-4 border-b border-black">
        <div className="container mx-auto max-w-4xl">
          <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-8 text-center">
            CUSTOMIZE FOR YOUR WEDDING
          </h2>
          
          <EnhancedPricingCalculator template={template} />
        </div>
      </section>

      {/* What's Included - Category by Category */}
      <section className="py-16 px-4 border-b border-black">
        <div className="container mx-auto max-w-6xl">
          <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-12 text-center">
            WHAT'S INCLUDED
          </h2>

          <div className="space-y-12">
            {sortedCategories.map((category, categoryIndex) => (
              <div key={category.key} className="border-b border-gray-200 pb-8 last:border-b-0">
                {/* Category Header */}
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <h3 className="font-cardo text-xl font-bold text-[#333] uppercase">
                    {categoryIndex + 1}. {category.label}
                  </h3>
                  <span className="text-sm text-[#B29A7B]">
                    {category.products.length} item{category.products.length !== 1 ? 's' : ''}
                  </span>
                </div>

                {/* Category Products */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {category.products.map((tp: any, index: number) => {
                    const product = tp.product;
                    const pricing = product.pricing;
                    
                    return (
                      <div key={product._id} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#333] text-sm">
                            {product.name}
                          </h4>
                          {pricing?.isVenueInclusion && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              INCLUDED
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-[#B29A7B] mb-2">
                          {product.vendorTradingName}
                        </p>
                        
                        {/* Pricing Display */}
                        {pricing?.isVenueInclusion ? (
                          <div className="text-sm text-green-600 font-bold">
                            Venue Inclusion - No Extra Cost
                          </div>
                        ) : pricing?.model === 'constant' && pricing.constantPricing ? (
                          <div className="text-sm font-bold text-[#333]">
                            {formatCurrency(pricing.constantPricing.sellPrice, 'IDR')}
                            {tp.quantity > 1 && (
                              <span className="text-[#666]"> × {tp.quantity}</span>
                            )}
                          </div>
                        ) : pricing?.model === 'variable' ? (
                          <div className="text-sm">
                            <div className="font-bold text-[#333]">
                              Variable Pricing
                            </div>
                            <div className="text-xs text-[#666]">
                              {pricing.calculationNotes || 'Price varies by guest count/nights'}
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-[#666]">
                            Contact for pricing
                          </div>
                        )}
                        
                        {tp.isOptional && (
                          <div className="text-xs text-[#B29A7B] mt-1">
                            Optional add-on
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

      {/* Similar Packages */}
      {similarTemplates.length > 0 && (
        <section className="py-16 px-4 border-b border-black">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-cardo text-2xl md:text-3xl text-[#333] mb-12 text-center">
              SIMILAR PACKAGES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarTemplates.map((similar: any) => (
                <Link 
                  key={similar._id}
                  href={`/packages/${similar.slug.current}`}
                  className="bg-white border border-black hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-square bg-gray-200 flex items-center justify-center">
                    {similar.heroImage ? (
                      <Image
                        src={getImageUrl(similar.heroImage, { width: 400, height: 400 })}
                        alt={similar.name}
                        width={400}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-600 font-bold">{similar.name}</span>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-cardo text-lg font-bold text-[#333] mb-2">
                      {similar.name}
                    </h3>
                    <p className="text-sm text-[#666] mb-3">
                      {similar.productCount} items • {similar.templateType?.replace('-', ' ')}
                    </p>
                    <div className="font-bold text-[#333]">
                      ${similar.estimatedPricing?.totalSellPriceUSD?.toLocaleString() || 'TBD'}
                    </div>
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