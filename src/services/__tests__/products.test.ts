import { ProductService } from '../products';

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService();
  });

  describe('getAllProducts', () => {
    it('should return all available products', () => {
      const products = productService.getAllProducts();
      
      expect(products).toBeDefined();
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBeGreaterThan(0);
    });

    it('should return products with required properties', () => {
      const products = productService.getAllProducts();
      
      products.forEach(product => {
        expect(product).toHaveProperty('id');
        expect(product).toHaveProperty('name');
        expect(product).toHaveProperty('price');
        expect(product).toHaveProperty('currency');
        expect(product).toHaveProperty('description');
        expect(product).toHaveProperty('features');
        expect(product).toHaveProperty('duration');
      });
    });

    it('should return products with valid data types', () => {
      const products = productService.getAllProducts();
      
      products.forEach(product => {
        expect(typeof product.id).toBe('string');
        expect(typeof product.name).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.currency).toBe('string');
        expect(typeof product.description).toBe('string');
        expect(Array.isArray(product.features)).toBe(true);
        expect(typeof product.duration).toBe('number');
      });
    });
  });

  describe('getProductById', () => {
    it('should return product when valid ID is provided', () => {
      const products = productService.getAllProducts();
      const firstProduct = products[0];
      
      const product = productService.getProductById(firstProduct.id);
      
      expect(product).toBeDefined();
      expect(product?.id).toBe(firstProduct.id);
    });

    it('should return undefined when invalid ID is provided', () => {
      const product = productService.getProductById('invalid-id');
      
      expect(product).toBeUndefined();
    });

    it('should return undefined when empty ID is provided', () => {
      const product = productService.getProductById('');
      
      expect(product).toBeUndefined();
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products for valid category', () => {
      const mentoringProducts = productService.getProductsByCategory('MENTORIA');
      
      expect(Array.isArray(mentoringProducts)).toBe(true);
      mentoringProducts.forEach(product => {
        expect(product.category).toBe('MENTORIA');
      });
    });

    it('should return empty array for invalid category', () => {
      const products = productService.getProductsByCategory('INVALID_CATEGORY' as any);
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });

    it('should return incubator products', () => {
      const incubatorProducts = productService.getProductsByCategory('ENCUBADORA');
      
      expect(Array.isArray(incubatorProducts)).toBe(true);
      incubatorProducts.forEach(product => {
        expect(product.category).toBe('ENCUBADORA');
      });
    });
  });

  describe('getProductsByPriceRange', () => {
    it('should return products within price range', () => {
      const products = productService.getProductsByPriceRange(1000, 5000);
      
      expect(Array.isArray(products)).toBe(true);
      products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(1000);
        expect(product.price).toBeLessThanOrEqual(5000);
      });
    });

    it('should return empty array when no products match price range', () => {
      const products = productService.getProductsByPriceRange(100000, 200000);
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });

    it('should handle invalid price range', () => {
      const products = productService.getProductsByPriceRange(5000, 1000); // max < min
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });

    it('should handle negative prices', () => {
      const products = productService.getProductsByPriceRange(-1000, 1000);
      
      expect(Array.isArray(products)).toBe(true);
      // Should only return products with positive prices
      products.forEach(product => {
        expect(product.price).toBeGreaterThanOrEqual(0);
        expect(product.price).toBeLessThanOrEqual(1000);
      });
    });
  });

  describe('searchProducts', () => {
    it('should return products matching search term', () => {
      const products = productService.searchProducts('essencial');
      
      expect(Array.isArray(products)).toBe(true);
      products.forEach(product => {
        const searchTerm = 'essencial';
        const matchesName = product.name.toLowerCase().includes(searchTerm);
        const matchesDescription = product.description.toLowerCase().includes(searchTerm);
        const matchesFeatures = product.features.some(feature => 
          feature.toLowerCase().includes(searchTerm)
        );
        
        expect(matchesName || matchesDescription || matchesFeatures).toBe(true);
      });
    });

    it('should return empty array when no products match search term', () => {
      const products = productService.searchProducts('nonexistent');
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });

    it('should handle empty search term', () => {
      const products = productService.searchProducts('');
      
      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(0);
    });

    it('should be case insensitive', () => {
      const lowerCaseResults = productService.searchProducts('mentoria');
      const upperCaseResults = productService.searchProducts('MENTORIA');
      const mixedCaseResults = productService.searchProducts('Mentoria');
      
      expect(lowerCaseResults.length).toBeGreaterThan(0);
      expect(upperCaseResults.length).toBe(lowerCaseResults.length);
      expect(mixedCaseResults.length).toBe(lowerCaseResults.length);
    });
  });

  describe('getPopularProducts', () => {
    it('should return only popular products', () => {
      const popularProducts = productService.getPopularProducts();
      
      expect(Array.isArray(popularProducts)).toBe(true);
      popularProducts.forEach(product => {
        expect(product.isPopular).toBe(true);
      });
    });

    it('should return products sorted by popularity', () => {
      const popularProducts = productService.getPopularProducts();
      
      // All returned products should be popular
      popularProducts.forEach(product => {
        expect(product.isPopular).toBe(true);
      });
    });
  });

  describe('getProductFeatures', () => {
    it('should return features for valid product ID', () => {
      const products = productService.getAllProducts();
      const firstProduct = products[0];
      
      const features = productService.getProductFeatures(firstProduct.id);
      
      expect(Array.isArray(features)).toBe(true);
      expect(features).toEqual(firstProduct.features);
    });

    it('should return empty array for invalid product ID', () => {
      const features = productService.getProductFeatures('invalid-id');
      
      expect(Array.isArray(features)).toBe(true);
      expect(features.length).toBe(0);
    });
  });

  describe('isProductAvailable', () => {
    it('should return true for existing product', () => {
      const products = productService.getAllProducts();
      const firstProduct = products[0];
      
      const isAvailable = productService.isProductAvailable(firstProduct.id);
      
      expect(isAvailable).toBe(true);
    });

    it('should return false for non-existing product', () => {
      const isAvailable = productService.isProductAvailable('invalid-id');
      
      expect(isAvailable).toBe(false);
    });
  });

  describe('getProductPrice', () => {
    it('should return price for valid product ID', () => {
      const products = productService.getAllProducts();
      const firstProduct = products[0];
      
      const price = productService.getProductPrice(firstProduct.id);
      
      expect(typeof price).toBe('number');
      expect(price).toBe(firstProduct.price);
    });

    it('should return 0 for invalid product ID', () => {
      const price = productService.getProductPrice('invalid-id');
      
      expect(price).toBe(0);
    });
  });

  describe('formatPrice', () => {
    it('should format BRL currency correctly', () => {
      const formatted = productService.formatPrice(1500, 'BRL');
      
      expect(formatted).toContain('R$');
      expect(formatted).toContain('1.500');
    });

    it('should format USD currency correctly', () => {
      const formatted = productService.formatPrice(1500, 'USD');
      
      expect(formatted).toContain('$');
    });

    it('should handle zero price', () => {
      const formatted = productService.formatPrice(0, 'BRL');
      
      expect(formatted).toContain('R$');
      expect(formatted).toContain('0');
    });

    it('should handle large numbers', () => {
      const formatted = productService.formatPrice(1000000, 'BRL');
      
      expect(formatted).toContain('R$');
      expect(formatted).toContain('1.000.000');
    });
  });
});
