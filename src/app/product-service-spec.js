import * as productService from './product-service.js';

describe('product-service', () => {
    
    beforeEach(function() {
        productService.init();
    });

    it('_getProductPackSpec should return the correct product pack', () => {        
        var productPacks = productService._getProductPackSpec('VS5');
        expect(productPacks.length).toBe(2);
        expect(productPacks[0].count).toBe(3);
        expect(productPacks[0].price).toBe(6.99);
    });

    it('_sortProductsPacksDesc sorts product packs in descending order', () => {

        let packs = [
            {
                count: 2,
                price: 9.95
            },
            {
                count: 5,
                price: 16.95
            },
            {
                count: 8,
                price: 24.95
            }];

        var sortedProductPacks = productService._sortProductsPacksDesc(packs);  
        expect(sortedProductPacks.length).toBe(3);
        expect(sortedProductPacks[0].count).toBe(8);
    });

    it('_calculateNumberOfPacks should calculate proper number of packs when number of packs are devided without remainder', () => {
        let sortedPacks = [            
            {
                count: 8,
                price: 24.95
            },
            {
                count: 5,
                price: 16.95
            },
            {
                count: 2,
                price: 9.95
            }];

        let processedProductPackSpec = productService._calculateNumberOfPacks(sortedPacks, 21);
        expect(processedProductPackSpec[0].numOfPacks).toBe(2);
        expect(processedProductPackSpec[1].numOfPacks).toBe(1);
    });

    it('_calculateNumberOfPacks should calculate proper number of packs when number of packs are devided with remainder', () => {
        let sortedPacks = [            
            {
                count: 9,
                price: 24.95
            },
            {
                count: 5,
                price: 16.95
            },
            {
                count: 2,
                price: 9.95
            }];

        let processedProductPackSpec = productService._calculateNumberOfPacks(sortedPacks, 26);
        expect(processedProductPackSpec[0].numOfPacks).toBe(2);
        expect(processedProductPackSpec[1].numOfPacks).toBe(1);
        expect(processedProductPackSpec[2].numOfPacks).toBe(2);
    });

    it('_calculatePackTotals should calculate proper totals', () => {
        let sortedPacks = [            
            {
                count: 9,
                price: 24.95,
                numOfPacks: 2
            },
            {
                count: 5,
                price: 16.95,
                numOfPacks: 1
            },
            {
                count: 2,
                price: 9.95, 
                numOfPacks: 2
            }];

        let processedProductPackSpec = productService._calculatePackTotals(sortedPacks);
        expect(processedProductPackSpec[0].quantityPack).toBe(18);
        expect(processedProductPackSpec[0].dollarValuePack).toBe(49.9);

        expect(processedProductPackSpec[1].quantityPack).toBe(5);
        expect(processedProductPackSpec[1].dollarValuePack).toBe(16.95);

        expect(processedProductPackSpec[2].quantityPack).toBe(4);
        expect(processedProductPackSpec[2].dollarValuePack).toBe(19.9);
    });
});