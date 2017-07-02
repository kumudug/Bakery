import { getProductPacks } from './products.js';

describe('getProductPacks', () => {
   it('temp', () => {
       var productPacks = getProductPacks('VS5');
       expect(productPacks.length).toBe(2);
   });
});