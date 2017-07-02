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

    for(let i=0; i<sortedProductPackSpec.length; i++){
        let numOfPacks = Math.floor(quantity / sortedProductPackSpec[i].count);
        if(numOfPacks > 0){
            quantity = quantity - (sortedProductPackSpec[i].count * numOfPacks);
        }

        if(sortedProductPackSpec[i].numOfPacks){
            sortedProductPackSpec[i].numOfPacks += numOfPacks;
        }else{
            sortedProductPackSpec[i].numOfPacks = numOfPacks;
        }
        
        if(quantity <= 0){
            break;
        }
    }

    if(quantity > 0){
        if(sortedProductPackSpec[sortedProductPackSpec.length - 1].numOfPacks){ 
            sortedProductPackSpec[sortedProductPackSpec.length - 1].numOfPacks += 1;
        }else{
            sortedProductPackSpec[sortedProductPackSpec.length - 1].numOfPacks = 1;
        }
        quantity -= sortedProductPackSpec[sortedProductPackSpec.length - 1].count;
    }
    
    //refine packs if the actual quantity is greater than ordered quantity
    if(quantity < 0){
        for (var i = (sortedProductPackSpec.length - 1); i > 0; i--) {

            if(sortedProductPackSpec[i].numOfPacks && sortedProductPackSpec[i].numOfPacks > 1){
                //If there is more than 1 in smaller packs check the possibility of adding a large pack to reduce the num of packs                

                var numPacksToRemove = 0;
                var numPacksToAdd = 0;
                if(sortedProductPackSpec[i].numOfPacks > 2){
                    
                    for(var x=2; x < sortedProductPackSpec[i].numOfPacks; x++){
                        for(var y=1; y<x; y++){
                            var countInSmallPacks = x * sortedProductPackSpec[i].count;
                            var countInImmediatelyLargePacks = sortedProductPackSpec[i-1].count * y;
                            var differenceInQtyIfSmallPacksRemoved =  countInImmediatelyLargePacks - countInSmallPacks - quantity;
                            //if(differenceInQtyIfSmallPacksRemoved >= quantity && differenceInQtyIfSmallPacksRemoved <= 0)
                            if(differenceInQtyIfSmallPacksRemoved <= 0 && differenceInQtyIfSmallPacksRemoved >= quantity){                            
                                //The quantity increase is same or less 
                                numPacksToRemove = x;
                                numPacksToAdd = y;
                                break;
                            }
                        }
                        if(numPacksToRemove > 0){
                            break;
                        }
                    }
                }
                else{                    
                    var countInImmediatelyLargePacks = sortedProductPackSpec[i-1].count;
                    var countInSmallPacks = sortedProductPackSpec[i].numOfPacks * sortedProductPackSpec[i].count;
                    var differenceInQtyIfSmallPacksRemoved =  countInImmediatelyLargePacks - countInSmallPacks - quantity;
                    //if(differenceInQtyIfSmallPacksRemoved >= quantity && differenceInQtyIfSmallPacksRemoved <= 0){
                    if(differenceInQtyIfSmallPacksRemoved <= 0 && differenceInQtyIfSmallPacksRemoved >= quantity){
                        //The quantity increase is same or less 
                        numPacksToRemove = 2;
                        numPacksToAdd = 1;
                    }
                }

                if(numPacksToAdd > 0 && numPacksToRemove > 0){
                    if(sortedProductPackSpec[i-1].numOfPacks){
                        sortedProductPackSpec[i-1].numOfPacks += numPacksToAdd;
                        quantity -= (sortedProductPackSpec[i-1].count * numPacksToAdd);
                    }else{
                        sortedProductPackSpec[i-1].numOfPacks = numPacksToAdd;
                        quantity -= (sortedProductPackSpec[i-1].count * numPacksToAdd);
                    }
                    sortedProductPackSpec[i].numOfPacks -= numPacksToRemove;
                    quantity += (numPacksToRemove * sortedProductPackSpec[i].count);
                }             
            }
        }
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