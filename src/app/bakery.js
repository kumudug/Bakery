import { calculateProductPacks }  from './product-service.js';

require('dotenv').config();
console.log(process.env.ENV);
try {
    let productPacks = calculateProductPacks('VS5', 14);
    console.log(productPacks);
}
catch(err) {
    console.log(err);
}
