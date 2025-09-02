import imageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

import { client } from './client'

const builder = imageUrlBuilder(client)

export const urlFor = (source: Image) => {
  return builder.image(source)
}

/**
 * Generate optimized image URL with responsive sizing
 */
export const getImageUrl = (
  source: Image | any,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png'
    fit?: 'crop' | 'fill' | 'max' | 'min'
  } = {}
) => {
  // Handle both new format (source.asset._ref) and Bubble format (source.asset.url)
  if (!source?.asset) return ''
  
  // If we have a direct URL from Bubble import, use it
  if (source.asset.url && !source.asset._ref) {
    return source.asset.url
  }
  
  // If we have a Sanity asset reference, use the builder
  if (!source.asset._ref) return ''

  const { width = 800, height, quality = 80, format = 'webp', fit = 'crop' } = options

  let url = builder.image(source).format(format).quality(quality).fit(fit)

  if (width) url = url.width(width)
  if (height) url = url.height(height)

  return url.url()
}

/**
 * Generate responsive image srcSet for different screen sizes
 */
export const getImageSrcSet = (source: Image, baseWidth: number = 800) => {
  if (!source?.asset?._ref) return ''

  const sizes = [baseWidth, baseWidth * 1.5, baseWidth * 2]
  const srcSet = sizes
    .map(width => 
      `${getImageUrl(source, { width, quality: 80, format: 'webp' })} ${width}w`
    )
    .join(', ')

  return srcSet
}

/**
 * Get gallery images sorted by display order and category
 */
export const getSortedGalleryImages = (
  gallery: Array<{
    image: Image | null
    alt: string
    caption?: string
    category: string
    featured?: boolean
    displayOrder?: number
  }> = [],
  category?: string
) => {
  // Filter out items without valid images first
  let validImages = gallery.filter(item => item?.image?.asset?.url)
  
  let filteredImages = category 
    ? validImages.filter(item => item.category === category)
    : validImages

  return filteredImages.sort((a, b) => {
    // Featured images first
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    
    // Then by display order
    const orderA = a.displayOrder || 999
    const orderB = b.displayOrder || 999
    return orderA - orderB
  })
}