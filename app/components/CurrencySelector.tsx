'use client'

import { useState, useEffect } from 'react'
import { getRateInfo } from '@/app/lib/currency/exchange-rates'

interface CurrencySelectorProps {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
  className?: string
}

const CURRENCIES = [
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' }
]

export default function CurrencySelector({ 
  selectedCurrency, 
  onCurrencyChange, 
  className = '' 
}: CurrencySelectorProps) {
  const [rateInfo, setRateInfo] = useState<{
    age: string
    isStale: boolean
  } | null>(null)

  useEffect(() => {
    // Get rate info for display
    getRateInfo().then(info => {
      setRateInfo({
        age: info.age,
        isStale: info.isStale
      })
    })
  }, [])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex items-center gap-2">
        <label className="text-sm font-bold text-[#333]">Currency:</label>
        <select
          value={selectedCurrency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="px-3 py-1 border border-[#333] bg-white text-[#333] text-sm font-bold rounded focus:outline-none focus:border-[#B29A7B]"
        >
          {CURRENCIES.map(currency => (
            <option key={currency.code} value={currency.code}>
              {currency.symbol} {currency.code} - {currency.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Exchange rate info */}
      {rateInfo && (
        <div className="text-xs text-[#666]">
          Rates updated {rateInfo.age}
          {rateInfo.isStale && (
            <span className="text-[#D79E92] ml-1">• Updating...</span>
          )}
        </div>
      )}
      
      {/* Rate disclaimer */}
      <div className="text-xs text-[#666] italic max-w-sm">
        * As exchange rates change daily, final pricing is subject to the rate at booking confirmation.
      </div>
    </div>
  )
}