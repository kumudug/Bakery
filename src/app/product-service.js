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
        let remainder = quantity % sortedProductPackSpec[i].count;
        if(numOfPacks > 0){
            //Check if qty is going greater than original quantity and whether it can be adjusted
            /*let tempQty = quantity - (sortedProductPackSpec[i].count * numOfPacks);
            if(numOfPacks == 1 && i < (sortedProductPackSpec.length -1) && sortedProductPackSpec[i].count > (sortedProductPackSpec[i+1].count * 2) && tempQty <= 0){
                numOfPacks = 0;
            }else{*/
                quantity = quantity - (sortedProductPackSpec[i].count * numOfPacks);
            //}       
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

    /*sortedProductPackSpec.some(sp => {
        let numOfPacks = Math.floor(quantity / sp.count);
        if(numOfPacks > 0){
            quantity = quantity - (sp.count * numOfPacks);
        }
        sp.numOfPacks = numOfPacks;
        return quantity <= 0;
    });*/

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
        let packsRefined = false;
        for (var i = (sortedProductPackSpec.length - 1); i > 0; i--) {
            if(sortedProductPackSpec[i].numOfPacks && sortedProductPackSpec[i].numOfPacks > 1 && ((sortedProductPackSpec[i].numOfPacks * sortedProductPackSpec[i].count) > sortedProductPackSpec[i-1].count)){
                //Remove smaller packs and add a larger pack while keeping quantity in tact
                let differenceInQty = sortedProductPackSpec[i-1].count - (sortedProductPackSpec[i].numOfPacks * sortedProductPackSpec[i].count);
                if(differenceInQty > quantity){
                    packsRefined = true;
                    //can safely change packs
                    sortedProductPackSpec[i].numOfPacks = 0;
                    if(sortedProductPackSpec[i-1].numOfPacks){
                        sortedProductPackSpec[i-1].numOfPacks += 1;
                    }else{
                        sortedProductPackSpec[i-1].numOfPacks = 1;
                    }
                }
            }
        }

        if(!packsRefined){
            for (var j = 0; j < (sortedProductPackSpec.length - 1); j++) {
                if(sortedProductPackSpec[j].numOfPacks && sortedProductPackSpec[j].numOfPacks === 1 && ((sortedProductPackSpec[j+1].numOfPacks * 2) < sortedProductPackSpec[j].count)){
                    //Remove larger pack and add 2 smaller packs while keeping quantity in tact
                    let differenceInQty = sortedProductPackSpec[j].count - (sortedProductPackSpec[j+1].count * 2);
                    if(differenceInQty > quantity){
                        //can safely change packs
                        sortedProductPackSpec[j].numOfPacks = 0;
                        if(sortedProductPackSpec[j+1].numOfPacks){
                            sortedProductPackSpec[j+1].numOfPacks += 1;
                        }else{
                            sortedProductPackSpec[j+1].numOfPacks = 1;
                        }
                    }
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