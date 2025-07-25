import React from 'react'
import ProductCard from './ProductCard'

interface Product {
  imageSrc: string
  altText: string
  productName: string
  price: string
  rating: number
  description: string
}

interface ProductListProps {
  products: Product[]
  showAll?: boolean
}

const ProductList: React.FC<ProductListProps> = ({ products, showAll = true }) => {
  const displayProducts = showAll ? products : products.slice(0, 6)

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
      {displayProducts.map((product: Product, index: number) => (
        <ProductCard
          key={index}
          imageSrc={product.imageSrc}
          altText={product.altText}
          productName={product.productName}
          price={product.price}
          rating={product.rating}
          description={product.description}
        />
      ))}
    </div>
  )
}

export default ProductList
