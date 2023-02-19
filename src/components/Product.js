import React from 'react'

export default function Product({ product }) {
    if (product) {
        const curr = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        });
        return (
            <div className="product">
                <h2>{product.title}</h2>
                <h3>{curr.format(product.price)}</h3>
                <img src={product.image} alt={product.title} />
            </div>
        )
    }
}
