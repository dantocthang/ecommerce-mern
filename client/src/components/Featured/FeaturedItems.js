import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import ProductItem from '../ProductItem'



function FeaturedItems({ products }) {
    return (
        <>
            {products && products.map(productItem => (
                <Link to={`/product/${productItem._id}`} key={productItem._id} className="col l-4 m-6 c-12 mt-4">
                    <ProductItem data={productItem}></ProductItem>
                </Link>
            ))}
        </>
    )
}

FeaturedItems.propTypes = {
    products: PropTypes.array.isRequired
}

export default FeaturedItems