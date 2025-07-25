import React from 'react'
import { Link } from 'react-router-dom'
import { ZoomIn } from 'lucide-react'

interface ProductCardProps {
  imageSrc: string
  altText: string
  productName: string
  price: string
  rating: number
  description: string
}

const ProductCard: React.FC<ProductCardProps> = ({
  imageSrc,
  altText,
  productName,
  price,
  description
}) => {
  const projectSlug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  /* const projectDetails = [
    'Build a scalable E-commerce platform',
    'Create a dynamic blogging platform',
    'Showcase your skills and projects'
  ] */

  return (
    <div className="group flex transform flex-col gap-3 rounded-lg border bg-light p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <figure className="relative h-48 w-full overflow-hidden bg-gray-200 rounded-md">
        <img
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={imageSrc}
          alt={altText}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </figure>

      <div className="flex flex-col gap-3 flex-1">
        <h3 className="text-xl font-bold text-primary transition-colors duration-200 group-hover:text-theme">
          {productName}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-3 flex-1">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-theme">{price}</span>
          <span className="text-xs text-gray-500">Starting from</span>
        </div>

        <Link
          to={`/project/${projectSlug}`}
          className="w-full bg-theme hover:bg-theme-hover text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
        >
          <ZoomIn className="h-4 w-4" />
          Show Details
        </Link>
      </div>
    </div>
  )
}

export default ProductCard
