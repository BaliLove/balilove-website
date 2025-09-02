/**
 * Dynamic Currency Exchange Rate Service
 * 
 * Handles real-time currency conversion from IDR base currency
 * to multiple international currencies with automatic rate updates
 */

interface ExchangeRates {
  IDR: number
  USD: number
  EUR: number
  GBP: number
  AUD: number
  lastUpdated: string
  source: string
}

interface CurrencyConversion {
  amount: number
  currency: string
  idr: number
  formatted: string
}

// Default fallback rates (updated manually as backup)
const FALLBACK_RATES: ExchangeRates = {
  IDR: 1,
  USD: 16388,
  EUR: 17800,
  GBP: 20850,
  AUD: 11200,
  lastUpdated: '2025-09-02T00:00:00Z',
  source: 'fallback'
}

// Cache for exchange rates
let cachedRates: ExchangeRates | null = null
let lastFetch: Date | null = null
const CACHE_DURATION = 4 * 60 * 60 * 1000 // 4 hours in milliseconds

/**
 * Fetch current exchange rates from external API
 */
async function fetchExchangeRates(): Promise<ExchangeRates> {
  try {
    // Use free ExchangeRate-API.com service
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/IDR')
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    
    // Extract rates we need (IDR to other currencies)
    const rates: ExchangeRates = {
      IDR: 1,
      USD: 1 / (data.rates.USD || 0.000061), // Convert to IDR per USD
      EUR: 1 / (data.rates.EUR || 0.000056),
      GBP: 1 / (data.rates.GBP || 0.000048),
      AUD: 1 / (data.rates.AUD || 0.000089),
      lastUpdated: new Date().toISOString(),
      source: 'exchangerate-api.com'
    }
    
    console.log('✅ Fetched fresh exchange rates:', rates)
    return rates
    
  } catch (error) {
    console.warn('⚠️ Exchange rate API failed, using fallback rates:', error)
    return FALLBACK_RATES
  }
}

/**
 * Get current exchange rates (cached for 4 hours)
 */
export async function getExchangeRates(): Promise<ExchangeRates> {
  const now = new Date()
  
  // Check if we have cached rates that are still fresh
  if (cachedRates && lastFetch && (now.getTime() - lastFetch.getTime()) < CACHE_DURATION) {
    return cachedRates
  }
  
  // Fetch fresh rates
  try {
    const freshRates = await fetchExchangeRates()
    cachedRates = freshRates
    lastFetch = now
    return freshRates
  } catch (error) {
    console.error('❌ Failed to fetch exchange rates:', error)
    return FALLBACK_RATES
  }
}

/**
 * Convert IDR amount to target currency
 */
export async function convertCurrency(
  idrAmount: number, 
  targetCurrency: keyof Omit<ExchangeRates, 'lastUpdated' | 'source'>
): Promise<CurrencyConversion> {
  const rates = await getExchangeRates()
  
  if (targetCurrency === 'IDR') {
    return {
      amount: idrAmount,
      currency: 'IDR',
      idr: idrAmount,
      formatted: formatCurrency(idrAmount, 'IDR')
    }
  }
  
  const convertedAmount = idrAmount / rates[targetCurrency]
  
  return {
    amount: convertedAmount,
    currency: targetCurrency,
    idr: idrAmount,
    formatted: formatCurrency(convertedAmount, targetCurrency)
  }
}

/**
 * Convert to multiple currencies at once
 */
export async function convertToMultipleCurrencies(
  idrAmount: number,
  currencies: string[] = ['USD', 'EUR', 'GBP', 'AUD']
): Promise<CurrencyConversion[]> {
  const rates = await getExchangeRates()
  
  return currencies.map(currency => {
    if (currency === 'IDR') {
      return {
        amount: idrAmount,
        currency: 'IDR',
        idr: idrAmount,
        formatted: formatCurrency(idrAmount, 'IDR')
      }
    }
    
    const convertedAmount = idrAmount / rates[currency as keyof typeof rates]
    
    return {
      amount: convertedAmount,
      currency: currency,
      idr: idrAmount,
      formatted: formatCurrency(convertedAmount, currency)
    }
  })
}

/**
 * Format currency with proper symbols and formatting
 */
export function formatCurrency(amount: number, currency: string): string {
  const formatters = {
    IDR: new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0 
    }),
    USD: new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }),
    EUR: new Intl.NumberFormat('de-DE', { 
      style: 'currency', 
      currency: 'EUR' 
    }),
    GBP: new Intl.NumberFormat('en-GB', { 
      style: 'currency', 
      currency: 'GBP' 
    }),
    AUD: new Intl.NumberFormat('en-AU', { 
      style: 'currency', 
      currency: 'AUD' 
    })
  }
  
  const formatter = formatters[currency as keyof typeof formatters]
  return formatter ? formatter.format(amount) : `${amount.toLocaleString()} ${currency}`
}

/**
 * Get rate freshness info for UI display
 */
export async function getRateInfo(): Promise<{
  lastUpdated: string
  source: string
  age: string
  isStale: boolean
}> {
  const rates = await getExchangeRates()
  const lastUpdate = new Date(rates.lastUpdated)
  const now = new Date()
  const ageMs = now.getTime() - lastUpdate.getTime()
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60))
  
  return {
    lastUpdated: rates.lastUpdated,
    source: rates.source,
    age: ageHours < 1 ? 'Less than 1 hour ago' : 
         ageHours === 1 ? '1 hour ago' :
         `${ageHours} hours ago`,
    isStale: ageMs > CACHE_DURATION
  }
}

/**
 * Force refresh exchange rates (for admin use)
 */
export async function refreshExchangeRates(): Promise<ExchangeRates> {
  cachedRates = null
  lastFetch = null
  return await getExchangeRates()
}