import { Order } from './order.js';

let order = new Order();

function printProductData(){
    console.log(order.products);
    console.log(order.orderTotal);

    var output = "";
    order.products.forEach(p => {
        var outputProd = p.productCode + '\n';
        outputProd += "\t Original order qty: " + p.originalOrderQuantity;
        outputProd += "\t Actual order qty: " + p.quantityProduct;
        p.forEach(pack => {
            console.log(pack);
        })
        output += outputProd + '\n';
    });

    document.getElementById('output').value = output;
}

function addProductToOrder(productCode, productQty){
    try {
        order.addProduct(productCode, productQty);
        printProductData();
    }
    catch(err) {
        console.log(err);
        alert(err);
    }
}

document.getElementById('addOrder').addEventListener('click', function () {
    var productCode = document.getElementById('productCode').value;
    var productQty = document.getElementById('orderQty').value;
    if(isNaN(productQty) || isNaN(parseInt(productQty))){
        alert('Invalid product quantity');
    } else{
        addProductToOrder(productCode, productQty);
    }
});


