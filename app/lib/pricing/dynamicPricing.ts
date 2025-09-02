interface Product {
  _id: string;
  name: string;
  vendorTradingName: string;
  categories: string[];
  pricing?: {
    model: string;
    isVenueInclusion?: boolean;
    constantPricing?: {
      sellPrice: number;
    };
    variablePricing?: {
      baseSellPrice: number;
      unitType: string;
      minNights?: number;
      maxNights?: number;
      eventFees?: {
        eventFeeSell?: number;
        banjarFee?: number;
      };
    };
  };
}

interface TemplateProduct {
  quantity: number;
  isOptional: boolean;
  product: Product;
}

interface PricingInputs {
  adults: number;
  children: number;
  nights?: number;
  selectedDate?: string;
}

interface ProductPricing {
  basePrice: number;
  calculation: string;
  pricingType: 'fixed' | 'per-person' | 'per-adult' | 'per-night' | 'seasonal';
  totalPrice: number;
}

export class DynamicPricingEngine {
  
  /**
   * Calculate pricing for a single product based on guest count and other factors
   */
  static calculateProductPrice(
    templateProduct: TemplateProduct, 
    inputs: PricingInputs
  ): ProductPricing {
    const product = templateProduct.product;
    const pricing = product.pricing;
    const totalGuests = inputs.adults + inputs.children;
    
    // Handle venue inclusions (free items)
    if (pricing?.isVenueInclusion) {
      return {
        basePrice: 0,
        calculation: 'Venue Inclusion',
        pricingType: 'fixed',
        totalPrice: 0
      };
    }
    
    // Handle constant pricing
    if (pricing?.model === 'constant' && pricing.constantPricing?.sellPrice) {
      const basePrice = pricing.constantPricing.sellPrice;
      
      // Determine if this is per-person pricing based on product name/category
      const pricingType = this.determinePricingType(product);
      
      let calculation = '';
      let totalPrice = 0;
      
      switch (pricingType) {
        case 'per-person':
          totalPrice = basePrice * totalGuests * templateProduct.quantity;
          calculation = `${basePrice.toLocaleString()} IDR × ${totalGuests} guests × ${templateProduct.quantity}`;
          break;
          
        case 'per-adult':
          totalPrice = basePrice * inputs.adults * templateProduct.quantity;
          calculation = `${basePrice.toLocaleString()} IDR × ${inputs.adults} adults × ${templateProduct.quantity}`;
          break;
          
        case 'fixed':
        default:
          totalPrice = basePrice * templateProduct.quantity;
          calculation = templateProduct.quantity > 1 
            ? `${basePrice.toLocaleString()} IDR × ${templateProduct.quantity}`
            : `${basePrice.toLocaleString()} IDR`;
          break;
      }
      
      return {
        basePrice,
        calculation,
        pricingType,
        totalPrice
      };
    }
    
    // Handle variable pricing (venue buyouts, seasonal)
    if (pricing?.model === 'variable' && pricing.variablePricing) {
      const basePrice = pricing.variablePricing.baseSellPrice;
      const nights = inputs.nights || 3;
      
      let totalPrice = basePrice;
      let calculation = `${basePrice.toLocaleString()} IDR base`;
      
      // Add night-based calculation if applicable
      if (pricing.variablePricing.unitType === 'per-night') {
        totalPrice = basePrice * nights;
        calculation = `${basePrice.toLocaleString()} IDR × ${nights} nights`;
      }
      
      // Add event fees
      if (pricing.variablePricing.eventFees?.eventFeeSell) {
        totalPrice += pricing.variablePricing.eventFees.eventFeeSell;
        calculation += ` + ${pricing.variablePricing.eventFees.eventFeeSell.toLocaleString()} IDR event fee`;
      }
      
      // Add banjar fees
      if (pricing.variablePricing.eventFees?.banjarFee) {
        totalPrice += pricing.variablePricing.eventFees.banjarFee;
        calculation += ` + ${pricing.variablePricing.eventFees.banjarFee.toLocaleString()} IDR banjar fee`;
      }
      
      // Apply quantity
      if (templateProduct.quantity > 1) {
        totalPrice *= templateProduct.quantity;
        calculation = `(${calculation}) × ${templateProduct.quantity}`;
      }
      
      return {
        basePrice,
        calculation,
        pricingType: 'seasonal',
        totalPrice
      };
    }
    
    // Fallback for products without pricing
    return {
      basePrice: 0,
      calculation: 'Contact for pricing',
      pricingType: 'fixed',
      totalPrice: 0
    };
  }
  
  /**
   * Determine pricing type based on product characteristics
   */
  private static determinePricingType(product: Product): 'fixed' | 'per-person' | 'per-adult' {
    const name = product.name.toLowerCase();
    const vendor = product.vendorTradingName?.toLowerCase() || '';
    
    // Adult-only products (alcohol)
    if (name.includes('alcohol') || name.includes('wine') || name.includes('beer') || 
        name.includes('cocktail') || name.includes('champagne') || name.includes('spirits')) {
      return 'per-adult';
    }
    
    // Per-person products (catering, meals)
    if (name.includes('menu') || name.includes('meal') || name.includes('catering') ||
        name.includes('buffet') || name.includes('per pax') || name.includes('per person') ||
        vendor.includes('catering') || vendor.includes('menu')) {
      return 'per-person';
    }
    
    // Default to fixed pricing
    return 'fixed';
  }
  
  /**
   * Calculate total package pricing with all products
   */
  static calculatePackageTotal(
    templateProducts: TemplateProduct[],
    inputs: PricingInputs
  ): {
    totalPrice: number;
    breakdown: Array<{
      product: Product;
      pricing: ProductPricing;
      quantity: number;
    }>;
  } {
    let totalPrice = 0;
    const breakdown: Array<{
      product: Product;
      pricing: ProductPricing;
      quantity: number;
    }> = [];
    
    templateProducts.forEach(templateProduct => {
      const productPricing = this.calculateProductPrice(templateProduct, inputs);
      
      totalPrice += productPricing.totalPrice;
      breakdown.push({
        product: templateProduct.product,
        pricing: productPricing,
        quantity: templateProduct.quantity
      });
    });
    
    return {
      totalPrice,
      breakdown
    };
  }
}