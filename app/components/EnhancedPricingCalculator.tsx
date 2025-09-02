'use client'

import { useState, useEffect } from 'react'
import { convertToMultipleCurrencies, formatCurrency } from '@/app/lib/currency/exchange-rates'
import CurrencySelector from './CurrencySelector'

interface Product {
  name: string
  vendorTradingName: string
  pricing: {
    model: string
    constantPricing?: {
      sellPrice: number
    }
    variablePricing?: {
      baseSellPrice: number
      unitType: string
      minimumUnits?: number
      maximumUnits?: number
      eventFees?: {
        eventFeeSell?: number
        banjarFee?: number
      }
    }
    isVenueInclusion?: boolean
  }
  categories: string[]
}

interface TemplateProduct {
  product: Product
  quantity: number
  isOptional: boolean
  category: string
}

interface PricingCalculatorProps {
  template: {
    name: string
    templateType: string
    products: TemplateProduct[]
    estimatedPricing: {
      totalSellPrice: number
      pricingComplexity: {
        requiresGuestCount?: boolean
        requiresNightCount?: boolean
        hasVariablePricing?: boolean
      }
    }
  }
}

// Category order matching your Glamp Nusa system
const CATEGORY_ORDER = [
  { key: 'planner', label: 'Wedding Planning', icon: '📋' },
  { key: 'venue', label: 'Venue', icon: '🏛️' },
  { key: 'accommodation', label: 'Accommodation', icon: '🏠' },
  { key: 'beauty', label: 'Hair & Makeup', icon: '💄' },
  { key: 'photography', label: 'Photo & Video', icon: '📸' },
  { key: 'ceremony', label: 'Celebrants & MC', icon: '💒' },
  { key: 'catering', label: 'Catering', icon: '🍽️' },
  { key: 'entertainment', label: 'Entertainment', icon: '🎭' },
  { key: 'catering', label: 'Cakes', icon: '🎂' },
  { key: 'styling', label: 'Florist & Styling', icon: '🌺' },
  { key: 'venue-services', label: 'Sound & Lighting', icon: '🎵' },
  { key: 'transportation', label: 'Transport', icon: '🚗' }
]

export default function EnhancedPricingCalculator({ template }: PricingCalculatorProps) {
  const [adultCount, setAdultCount] = useState(50)
  const [childCount, setChildCount] = useState(0)
  const [nightCount, setNightCount] = useState(3)
  const [selectedCurrency, setSelectedCurrency] = useState('AUD')
  const [conversions, setConversions] = useState<any>({})
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculate total and update currency conversions
  const calculatePricing = async () => {
    setIsCalculating(true)
    
    let totalIDR = 0
    const breakdown: Array<{
      category: string
      items: Array<{
        name: string
        vendor: string
        calculation: string
        idrAmount: number
        isIncluded: boolean
      }>
      categoryTotal: number
    }> = []

    // Group products by category
    const productsByCategory: { [key: string]: TemplateProduct[] } = {}
    
    template.products.forEach(tp => {
      const category = tp.product.categories[0] || 'other'
      if (!productsByCategory[category]) {
        productsByCategory[category] = []
      }
      productsByCategory[category].push(tp)
    })

    // Calculate pricing for each category
    CATEGORY_ORDER.forEach(categoryInfo => {
      const products = productsByCategory[categoryInfo.key] || []
      if (products.length === 0) return

      let categoryTotal = 0
      const categoryItems: any[] = []

      products.forEach(tp => {
        const product = tp.product
        const pricing = product.pricing
        let itemTotal = 0
        let calculation = ''

        if (pricing.isVenueInclusion) {
          // Venue inclusions are free
          calculation = 'Venue Inclusion'
          itemTotal = 0
        } else if (pricing.model === 'constant' && pricing.constantPricing) {
          // Fixed price items
          itemTotal = pricing.constantPricing.sellPrice * tp.quantity
          calculation = tp.quantity > 1 ? 
            `${pricing.constantPricing.sellPrice.toLocaleString()} IDR × ${tp.quantity}` :
            `${pricing.constantPricing.sellPrice.toLocaleString()} IDR`
            
        } else if (pricing.model === 'variable' && pricing.variablePricing) {
          // Variable pricing based on guests/nights
          let baseAmount = 0
          
          if (pricing.variablePricing.unitType === 'per-person') {
            baseAmount = pricing.variablePricing.baseSellPrice * (adultCount + childCount)
            calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${adultCount + childCount} guests`
          } else if (pricing.variablePricing.unitType === 'per-adult') {
            baseAmount = pricing.variablePricing.baseSellPrice * adultCount
            calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${adultCount} adults`
          } else if (pricing.variablePricing.unitType === 'per-child') {
            baseAmount = pricing.variablePricing.baseSellPrice * childCount
            calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${childCount} children`
          } else if (pricing.variablePricing.unitType === 'per-night') {
            baseAmount = pricing.variablePricing.baseSellPrice * nightCount
            calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${nightCount} nights`
          }

          itemTotal = baseAmount

          // Add event fees
          if (pricing.variablePricing.eventFees?.eventFeeSell) {
            itemTotal += pricing.variablePricing.eventFees.eventFeeSell
            calculation += ` + ${pricing.variablePricing.eventFees.eventFeeSell.toLocaleString()} IDR event fee`
          }

          // Add banjar fees
          if (pricing.variablePricing.eventFees?.banjarFee) {
            itemTotal += pricing.variablePricing.eventFees.banjarFee
            calculation += ` + ${pricing.variablePricing.eventFees.banjarFee.toLocaleString()} IDR banjar fee`
          }

          // Handle negative pricing (guest paybacks)
          if (itemTotal < 0) {
            calculation = `Guest payback: ${Math.abs(itemTotal).toLocaleString()} IDR × ${nightCount} nights`
          }
        }

        categoryItems.push({
          name: product.name,
          vendor: product.vendorTradingName,
          calculation: calculation,
          idrAmount: itemTotal,
          isIncluded: pricing.isVenueInclusion || false
        })

        categoryTotal += itemTotal
      })

      if (categoryItems.length > 0) {
        breakdown.push({
          category: categoryInfo.label,
          items: categoryItems,
          categoryTotal: categoryTotal
        })

        totalIDR += categoryTotal
      }
    })

    // Convert to multiple currencies
    try {
      const conversions = await convertToMultipleCurrencies(totalIDR, ['IDR', 'USD', 'EUR', 'GBP', 'AUD'])
      setConversions(conversions.reduce((acc, conv) => {
        acc[conv.currency] = conv
        return acc
      }, {} as any))
    } catch (error) {
      console.error('Currency conversion failed:', error)
    }

    setIsCalculating(false)
    return { totalIDR, breakdown }
  }

  // Recalculate when inputs change
  useEffect(() => {
    calculatePricing()
  }, [adultCount, childCount, nightCount])

  const totalGuests = adultCount + childCount
  const selectedConversion = conversions[selectedCurrency]

  return (
    <div className="bg-white border border-black">
      {/* Header */}
      <div className="bg-[#F5F3EF] p-6 border-b border-black">
        <h3 className="font-cardo text-xl text-[#333] mb-4">
          PACKAGE PRICING CALCULATOR
        </h3>
        
        {/* Guest Count Controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-bold text-[#333] mb-2">Adults</label>
            <input
              type="number"
              value={adultCount}
              onChange={(e) => setAdultCount(Number(e.target.value))}
              className="w-full p-2 border border-[#333] text-[#333] font-bold text-center"
              min="1"
              max="200"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-[#333] mb-2">Children</label>
            <input
              type="number"
              value={childCount}
              onChange={(e) => setChildCount(Number(e.target.value))}
              className="w-full p-2 border border-[#333] text-[#333] font-bold text-center"
              min="0"
              max="50"
            />
          </div>
        </div>

        {/* Nights input (if needed) */}
        {template.estimatedPricing.pricingComplexity?.requiresNightCount && (
          <div className="mb-4">
            <label className="block text-sm font-bold text-[#333] mb-2">Number of Nights</label>
            <input
              type="number"
              value={nightCount}
              onChange={(e) => setNightCount(Number(e.target.value))}
              className="w-full p-2 border border-[#333] text-[#333] font-bold text-center"
              min="1"
              max="14"
            />
          </div>
        )}

        {/* Currency Selector */}
        <CurrencySelector
          selectedCurrency={selectedCurrency}
          onCurrencyChange={setSelectedCurrency}
        />
      </div>

      {/* Price Summary */}
      <div className="p-6 border-b border-black bg-[#F5F3EF]">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-[#666] uppercase tracking-wide">
              Total for {totalGuests} guests × {nightCount} nights
            </div>
            <div className="font-cardo text-2xl font-bold text-[#333]">
              {selectedConversion ? selectedConversion.formatted : 'Calculating...'}
            </div>
          </div>
          {isCalculating && (
            <div className="text-sm text-[#B29A7B]">Updating...</div>
          )}
        </div>
        
        {/* Show other currencies */}
        {conversions && Object.keys(conversions).length > 0 && (
          <div className="mt-3 text-xs text-[#666]">
            {Object.values(conversions).filter((conv: any) => conv.currency !== selectedCurrency).map((conv: any) => (
              <div key={conv.currency}>
                {conv.formatted} {conv.currency}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}