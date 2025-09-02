'use client'

import Image from 'next/image'
import { getImageUrl } from '@/sanity/lib/image'

interface GalleryImage {
  asset?: {
    url?: string
    _ref?: string
  }
  alt?: string
}

interface AirbnbHeroGalleryProps {
  heroImage?: GalleryImage
  gallery: GalleryImage[]
  venueName: string
  onViewAllPhotos: () => void
}

export default function AirbnbHeroGallery({
  heroImage,
  gallery,
  venueName,
  onViewAllPhotos
}: AirbnbHeroGalleryProps) {
  const totalImages = (heroImage ? 1 : 0) + gallery.length
  const additionalImagesCount = Math.max(0, totalImages - 5)
  const allImages = heroImage ? [heroImage, ...gallery] : gallery

  return (
    <section className="border-b border-black">
      {/* Desktop Gallery Layout */}
      <div className="hidden lg:flex relative gap-2 p-2 aspect-[2/1]">
        {/* Main Hero Image - Left Half */}
        <div 
          className="w-1/2 aspect-square relative overflow-hidden cursor-pointer"
          onClick={onViewAllPhotos}
        >
          {heroImage?.asset?.url ? (
            <Image
              src={getImageUrl(heroImage, { width: 800, height: 800 })}
              alt={heroImage.alt || venueName}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">{venueName}</span>
            </div>
          )}
        </div>

        {/* Gallery Grid - Right Half */}
        <div className="w-1/2 aspect-square grid grid-cols-2 grid-rows-2 gap-2">
          {gallery && gallery.length > 0 ? (
            <>
              {/* Top Left */}
              <div 
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={onViewAllPhotos}
              >
                <Image
                  src={getImageUrl(gallery[0], { width: 400, height: 400 })}
                  alt={gallery[0]?.alt || `${venueName} gallery`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Top Right */}
              <div 
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={onViewAllPhotos}
              >
                {gallery[1] ? (
                  <Image
                    src={getImageUrl(gallery[1], { width: 400, height: 400 })}
                    alt={gallery[1]?.alt || `${venueName} gallery`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              {/* Bottom Left */}
              <div 
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={onViewAllPhotos}
              >
                {gallery[2] ? (
                  <Image
                    src={getImageUrl(gallery[2], { width: 400, height: 400 })}
                    alt={gallery[2]?.alt || `${venueName} gallery`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>

              {/* Bottom Right - With overlay if more photos */}
              <div 
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={onViewAllPhotos}
              >
                {gallery[3] ? (
                  <>
                    <Image
                      src={getImageUrl(gallery[3], { width: 400, height: 400 })}
                      alt={gallery[3]?.alt || `${venueName} gallery`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                    {additionalImagesCount > 0 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white text-lg font-medium">
                          +{additionalImagesCount} more
                        </span>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-100" />
                )}
              </div>
            </>
          ) : (
            // Placeholder if no gallery images
            <div className="col-span-2 row-span-2 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500">No gallery images</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Gallery Layout */}
      <div className="lg:hidden">
        <div className="relative aspect-[4/3] overflow-hidden" onClick={onViewAllPhotos}>
          {heroImage?.asset?.url ? (
            <>
              <Image
                src={getImageUrl(heroImage, { width: 600, height: 450 })}
                alt={heroImage.alt || venueName}
                fill
                className="object-cover"
                priority
              />
              {totalImages > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  1 / {totalImages}
                </div>
              )}
            </>
          ) : gallery[0]?.asset?.url ? (
            <>
              <Image
                src={getImageUrl(gallery[0], { width: 600, height: 450 })}
                alt={gallery[0]?.alt || venueName}
                fill
                className="object-cover"
                priority
              />
              {totalImages > 1 && (
                <div className="absolute top-4 right-4 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                  1 / {totalImages}
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-xl">{venueName}</span>
            </div>
          )}
        </div>
        
        {totalImages > 1 && (
          <div className="p-4 text-center">
            <button
              onClick={onViewAllPhotos}
              className="enquire-button text-xs px-4 py-2"
            >
              VIEW ALL {totalImages} PHOTOS
            </button>
          </div>
        )}
      </div>

      {/* View All Photos Button - Desktop */}
      <div className="hidden lg:block absolute bottom-4 right-4">
        <button
          onClick={onViewAllPhotos}
          className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 px-4 py-2 text-sm font-medium rounded-lg shadow-sm transition-colors"
        >
          Show all photos
        </button>
      </div>
    </section>
  )
}