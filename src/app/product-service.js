import { getProductData } from './data-service-mock.js';

let products = [];

function _retrieveProductData(){
    return getProductData();
}

function _getProductPackSpec(productCode) { 
    let productPacks = [];   
    products.some(p => {
        if( p.code === productCode ){            
            productPacks = p.packs;
            return true; //Workaround in JS for break;
        }
    });
    if(productPacks.length == 0){
        throw 'Invalid product code';
    }
    return productPacks;
}

function _sortProductsPacksDesc(productPackSpec){
    if(!productPackSpec || !productPackSpec.length){
        throw 'Something has gone terribly wrong - productService._sortProductsPacksDesc';
    }
    var sortedAsc = productPackSpec.sort(function(a,b){
        return a.count - b.count;
    });
    return sortedAsc.reverse();
}

function _calculateNumberOfPacks(sortedProductPackSpec, quantity){
    if(!sortedProductPackSpec || !sortedProductPackSpec.length){
        throw 'Something has gone terribly wrong - productService._calculateNumberOfPacks';
    }

    sortedProductPackSpec.some(sp => {
        let numOfPacks = Math.floor(quantity / sp.count);
        if(numOfPacks > 0){
            quantity = quantity - (sp.count * numOfPacks);
        } else{
            let remainder = quantity % sp.count;
            if(remainder > 0){
                numOfPacks = 1;
                quantity = 0;
            }
        }
        sp.numOfPacks = numOfPacks;
        return quantity <= 0;
    });

    if(quantity > 0){
        //sortedProductPackSpec[sortedProductPackSpec.length - 1].numOfPacks can never be undefined after returning from above loop
        sortedProductPackSpec[sortedProductPackSpec.length - 1].numOfPacks += 1;
    }

    return sortedProductPackSpec;
}

function _calculatePackTotals(processedProductPackSpec){
    if(!processedProductPackSpec || !processedProductPackSpec.length){
        throw 'Something has gone terribly wrong - productService._calculatePackTotals';
    }

    let dollarValueProduct = 0;
    let quantityProduct = 0;

    processedProductPackSpec.forEach(p => {
        p.quantityPack = p.numOfPacks ? (p.numOfPacks * p.count) : 0;
        p.dollarValuePack = p.numOfPacks ? (p.numOfPacks * p.price) : 0;
        quantityProduct += p.quantityPack;
        dollarValueProduct += p.dollarValuePack;
    });

    processedProductPackSpec.dollarValueProduct = dollarValueProduct;
    processedProductPackSpec.quantityProduct = quantityProduct;

    return processedProductPackSpec;
}

function calculateProductPacks(productCode, quantity) {    
    init(); //refresh product data
    let sortedProductPackSpec = _sortProductsPacksDesc(_getProductPackSpec(productCode));
    let processedProductPackSpec = _calculateNumberOfPacks(sortedProductPackSpec, quantity);
    processedProductPackSpec = _calculatePackTotals(processedProductPackSpec);
    processedProductPackSpec.originalOrderQuantity = quantity;

    return processedProductPackSpec;
}

function init(){
    products = _retrieveProductData();  
}

export { calculateProductPacks, _getProductPackSpec, _retrieveProductData, init, _sortProductsPacksDesc, _calculateNumberOfPacks, _calculatePackTotals }; //export all for tests