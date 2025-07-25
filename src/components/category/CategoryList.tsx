import React from 'react'
import Category from './CategoryCard'

interface CategoryListProps {
  categories: {
    imageSrc: string;
    altText: string;
    categoryName: string;
    slug: string;
    description: string;
  }[]
  selectedCategory?: string | null;
  onCategoryClick?: (categoryName: string) => void;
}

const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  selectedCategory,
  onCategoryClick
}) => {
  return (
    <section className="py-8">
      <h2 className="mb-7 text-center text-2xl font-bold text-primary">Categories</h2>
      <div className="flex flex-wrap justify-center gap-6 md:gap-10">
        {categories.map((category, index) => (
          <Category
            key={index}
            imageSrc={category.imageSrc}
            altText={category.altText}
            categoryName={category.categoryName}
            description={category.description}
            isSelected={selectedCategory === category.categoryName}
            onClick={() => onCategoryClick?.(category.categoryName)}
          />
        ))}
      </div>
    </section>
  )
}

export default CategoryList
