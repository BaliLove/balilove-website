import WeddingImageCarousel from '@/app/components/WeddingImageCarousel'
import { sampleGalleryImages } from '../sampleData'

export default function Page() {
  return (
    <div>
      <h1 className="text-center text-2xl py-4">WeddingImageCarousel Test</h1>
      <div className="container mx-auto p-4 max-w-md">
        <WeddingImageCarousel images={sampleGalleryImages as any} />
      </div>
    </div>
  )
}
