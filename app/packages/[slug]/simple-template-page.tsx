import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

// Simple fetch for testing
async function getTemplate(slug: string) {
  try {
    return await client.fetch(`
      *[_type == "wishlistTemplate" && slug.current == $slug][0] {
        _id,
        name,
        templateType,
        estimatedPricing
      }
    `, { slug });
  } catch (error) {
    console.error('Error fetching template:', error);
    return null;
  }
}

export default async function SimpleTemplatePage({ params }: { params: { slug: string } }) {
  const template = await getTemplate(params.slug);
  
  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#F5F3EF]">
      <Header />
      
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="font-cardo text-4xl text-[#333] mb-6">
            {template.name}
          </h1>
          
          <p className="text-lg text-[#666] mb-4">
            {template.templateType} wedding package
          </p>
          
          <div className="bg-white p-6 rounded border">
            <h2 className="text-xl font-bold mb-4">Package Details</h2>
            <p>Products: {template.estimatedPricing?.totalProducts || 0}</p>
            <p>Price: ${template.estimatedPricing?.totalSellPriceUSD?.toLocaleString() || 'TBD'}</p>
            <p>Template working! ✅</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}