import React from 'react'

interface CategoryProps {
  imageSrc: string
  altText: string
  categoryName: string
  description?: string
  isSelected?: boolean
  onClick?: () => void
}

const Category: React.FC<CategoryProps> = ({
  imageSrc,
  altText,
  categoryName,
  description,
  isSelected = false,
  onClick
}) => {
  return (
    <div
      className={`flex cursor-pointer flex-col transition-all duration-300 ${
        isSelected ? 'transform scale-105' : 'hover:transform hover:scale-105'
      }`}
      onClick={onClick}
    >
      <figure className={`relative h-[86px] w-[86px] overflow-hidden rounded-full transition-colors duration-300 ${
        isSelected
          ? 'bg-indigo-100 ring-4 ring-indigo-500 ring-opacity-50'
          : 'bg-light hover:bg-light-hover'
      }`}>
        <img
          className="absolute inset-0 h-full w-full transform rounded-md object-contain p-4 transition-transform duration-300 ease-in-out hover:scale-110"
          src={imageSrc}
          alt={altText}
        />
      </figure>
      <h3 className={`mt-3 text-center text-base font-semibold transition-colors ${
        isSelected ? 'text-indigo-600' : 'text-secondary'
      }`}>
        {categoryName}
      </h3>
      {description && (
        <p className="mt-1 text-center text-xs text-gray-500 max-w-[100px]">
          {description}
        </p>
      )}
    </div>
  )
}

export default Category
