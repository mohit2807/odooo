import { formatPrice, getImagePlaceholder } from '../../lib/supabase'

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('should format price in INR currency', () => {
      expect(formatPrice(100000)).toBe('₹1,00,000')
      expect(formatPrice(50000)).toBe('₹50,000')
      expect(formatPrice(0)).toBe('₹0')
    })

    it('should handle large numbers', () => {
      expect(formatPrice(1000000)).toBe('₹10,00,000')
    })
  })

  describe('getImagePlaceholder', () => {
    it('should return a valid data URI', () => {
      const placeholder = getImagePlaceholder()
      expect(placeholder).toMatch(/^data:image\/svg\+xml/)
    })
  })
})
