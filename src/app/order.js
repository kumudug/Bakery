import { calculateProductPacks } from './product-service.js';

class Order {

    constructor(){
        this.products = [];
        this.orderTotal = 0;
    }

    _updateOrderTotal(product){
        if(product.dollarValueProduct){
            this.orderTotal += product.dollarValueProduct;
        }
    }

    addProduct(productCode, quantity){
        try {
            if(isNaN(quantity)){
                throw 'Invalid quantity';
            }
            var product = calculateProductPacks(productCode, quantity);
            product.productCode = productCode;
            this._updateOrderTotal(product);
            this.products.push(product);
        }
        catch(err) {
            throw err;
        }
    }

}

export { Order };