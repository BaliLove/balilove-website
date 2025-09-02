'use client'

import { useState } from 'react'

interface PricingCalculatorProps {
  template: {
    name: string
    products: Array<{
      product: {
        name: string
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
      }
      quantity: number
      isOptional: boolean
    }>
    estimatedPricing: {
      totalSellPrice: number
      pricingComplexity: {
        requiresGuestCount?: boolean
        requiresDateSelection?: boolean
        requiresNightCount?: boolean
        hasVariablePricing?: boolean
      }
    }
  }
}

export default function PricingCalculator({ template }: PricingCalculatorProps) {
  const [guestCount, setGuestCount] = useState(50)
  const [adultCount, setAdultCount] = useState(45)
  const [childCount, setChildCount] = useState(5)
  const [nightCount, setNightCount] = useState(3)
  const [selectedDate, setSelectedDate] = useState<string>('')

  // Calculate dynamic pricing based on inputs
  const calculateTotalPrice = () => {
    let totalPrice = 0
    let breakdown: Array<{
      item: string
      calculation: string
      price: number
    }> = []

    template.products.forEach(templateProduct => {
      const product = templateProduct.product
      const pricing = product.pricing

      if (pricing.isVenueInclusion) {
        // Venue inclusions are free
        breakdown.push({
          item: product.name,
          calculation: 'Venue Inclusion',
          price: 0
        })
        return
      }

      if (pricing.model === 'constant' && pricing.constantPricing) {
        const itemTotal = pricing.constantPricing.sellPrice * templateProduct.quantity
        totalPrice += itemTotal
        
        breakdown.push({
          item: product.name,
          calculation: `${pricing.constantPricing.sellPrice.toLocaleString()} IDR × ${templateProduct.quantity}`,
          price: itemTotal
        })
        
      } else if (pricing.model === 'variable' && pricing.variablePricing) {
        let itemTotal = 0
        let calculation = ''

        // Calculate based on unit type
        if (pricing.variablePricing.unitType === 'per-person') {
          itemTotal = pricing.variablePricing.baseSellPrice * guestCount * templateProduct.quantity
          calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${guestCount} guests × ${templateProduct.quantity}`
          
        } else if (pricing.variablePricing.unitType === 'per-adult') {
          itemTotal = pricing.variablePricing.baseSellPrice * adultCount * templateProduct.quantity
          calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${adultCount} adults × ${templateProduct.quantity}`
          
        } else if (pricing.variablePricing.unitType === 'per-child') {
          itemTotal = pricing.variablePricing.baseSellPrice * childCount * templateProduct.quantity
          calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${childCount} children × ${templateProduct.quantity}`
          
        } else if (pricing.variablePricing.unitType === 'per-night') {
          itemTotal = pricing.variablePricing.baseSellPrice * nightCount * templateProduct.quantity
          calculation = `${pricing.variablePricing.baseSellPrice.toLocaleString()} IDR × ${nightCount} nights × ${templateProduct.quantity}`
        }

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

        totalPrice += itemTotal
        breakdown.push({
          item: product.name,
          calculation: calculation,
          price: itemTotal
        })
      }
    })

    return { totalPrice, breakdown }
  }

  const { totalPrice, breakdown } = calculateTotalPrice()
  const usdPrice = totalPrice / 16388 // Convert IDR to USD

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <h3 className="font-cardo text-xl mb-6">Template Pricing Calculator</h3>
      
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {template.estimatedPricing.pricingComplexity?.requiresGuestCount && (
          <>
            <div>
              <label className="block text-sm font-bold mb-2">Adult Guests</label>
              <input
                type="number"
                value={adultCount}
                onChange={(e) => setAdultCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                min="1"
                max="200"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2">Children</label>
              <input
                type="number"
                value={childCount}
                onChange={(e) => setChildCount(Number(e.target.value))}
                className="w-full p-2 border border-gray-300 rounded"
                min="0"
                max="50"
              />
            </div>
          </>
        )}
        
        {template.estimatedPricing.pricingComplexity?.requiresNightCount && (
          <div>
            <label className="block text-sm font-bold mb-2">Number of Nights</label>
            <input
              type="number"
              value={nightCount}
              onChange={(e) => setNightCount(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded"
              min="1"
              max="14"
            />
          </div>
        )}
        
        {template.estimatedPricing.pricingComplexity?.requiresDateSelection && (
          <div>
            <label className="block text-sm font-bold mb-2">Event Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}
      </div>

      {/* Price Summary */}
      <div className="bg-[#F5F3EF] p-4 rounded mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold">Total Estimated Price:</span>
          <div className="text-right">
            <div className="font-bold text-lg">{totalPrice.toLocaleString()} IDR</div>
            <div className="text-sm text-gray-600">${usdPrice.toLocaleString()} USD</div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          Based on {adultCount + childCount} guests for {nightCount} nights
        </div>
      </div>

      {/* Pricing Breakdown */}
      <details className="mb-4">
        <summary className="cursor-pointer font-bold mb-2">View Pricing Breakdown</summary>
        <div className="space-y-2 text-sm">
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <div className="font-medium">{item.item}</div>
                <div className="text-xs text-gray-600">{item.calculation}</div>
              </div>
              <div className="text-right">
                {item.price === 0 ? (
                  <span className="text-green-600">Included</span>
                ) : (
                  <>
                    <div>{item.price.toLocaleString()} IDR</div>
                    <div className="text-xs text-gray-600">${(item.price / 16388).toFixed(0)}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </details>

      {/* Disclaimers */}
      <div className="text-xs text-gray-500 border-t pt-4">
        <p>* Prices are estimates based on current rates and may vary</p>
        <p>* Final pricing subject to availability and booking confirmation</p>
        <p>* Some items may have seasonal pricing variations</p>
      </div>
    </div>
  )
}