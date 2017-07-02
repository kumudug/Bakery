import * as productService from './product-service.js';

describe('_getProductPackSpec', () => {
   it('_getProductPackSpec should return the correct product pack', () => {
       var productPacks = productService._getProductPackSpec('VS5');
       expect(productPacks.length).toBe(2);
   });
});