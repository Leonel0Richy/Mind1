import React from 'react'
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
  productName
}) => {
  const projectDetails = [
    'Build a scalable E-commerce platform',
    'Create a dynamic blogging platform',
    'Showcase your skills and projects'
  ]

  return (
    <div className="group flex transform flex-col gap-3 rounded-lg border bg-light p-3 transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer">
      <figure className="relative h-40 w-full overflow-hidden bg-gray-200 rounded-md">
        <img
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          src={imageSrc}
          alt={altText}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
          <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </figure>

      <div className="flex flex-col gap-3">
        <h3 className="text-xl font-bold text-primary transition-colors duration-200 group-hover:text-theme">
          {productName}
        </h3>

        <div className="space-y-2">
          {projectDetails.map((detail: string, index: number) => (
            <div key={index} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-theme rounded-full mt-2 flex-shrink-0"></span>
              <p className="text-sm text-gray-700">{detail}</p>
            </div>
          ))}
        </div>

        <button className="mt-3 w-full bg-theme hover:bg-theme-hover text-white py-2 px-4 rounded-md text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2">
          <ZoomIn className="h-4 w-4" />
          Show Details
        </button>
      </div>
    </div>
  )
}

export default ProductCard
