'use client'

import AirbnbHeroGallery from '@/app/components/AirbnbHeroGallery'
import { sampleGalleryImages } from '../sampleData'

export default function Page() {
  const handleViewAllPhotos = () => {
    // Just a demo handler for the test page
    console.log('View all photos clicked')
  }

  return (
    <div>
      <h1 className="text-center text-2xl py-4">AirbnbHeroGallery Test</h1>
      <AirbnbHeroGallery
        heroImage={{ 
          asset: { url: "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=1200&h=600&fit=crop" }, 
          alt: "Villa Vedas" 
        }}
        gallery={sampleGalleryImages}
        venueName="Villa Vedas"
        onViewAllPhotos={handleViewAllPhotos}
      />
    </div>
  )
}
