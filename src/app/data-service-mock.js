let products = [
    {
        name: 'Vegemite Scroll',
        code: 'VS5',
        packs: [
            {
                count: 3,
                price: 6.99
            },
            {
                count: 5,
                price: 8.99
            }
        ]
    },
    {
        name: 'Blueberry Muffin',
        code: 'MB11',
        packs: [
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
            }
        ]
    },
    {
        name: 'Croissant',
        code: 'CF',
        packs: [
            {
                count: 3,
                price: 5.95
            },
            {
                count: 5,
                price: 9.95
            },
            {
                count: 9,
                price: 16.99
            }
        ]
    }
]

function getProductData() {
    return JSON.parse(JSON.stringify(products)); //Clone the object to avoid the original object from being modified
}

export { getProductData };