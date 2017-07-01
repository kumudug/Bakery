import { getProductData } from './data-service-mock.js';

let products = getProductData();

function getProductPacks(productCode) { 
    var productPacks = [];   
    products.some(p => {
        if( p.code === productCode ){            
            p.packs.forEach(pa => {
                productPacks.push(pa.count);
            });
            return true; //Workaround in JS for break;
        }
    });
    return productPacks;
}

export { getProductPacks };