import Banner from "./banner/SimpleBanner"
import CategoryList from "./category/CategoryList"
import SectionHeading from "./sectionHeading/ColoredSectionHeading"
import BlogList from "./blog/BlogList"
import Faq from "./faq/Faq"
import Newsletter from "./newsletter/Newsletter"
import { blogPosts, categories, description, faqs, title, products } from '../appData'
import CreateArticleModal from './article/CreateArticleModal'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import ProductList from './product/ProductList'

export default function HomePage() {
  const [articles, setArticles] = useState(blogPosts)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { isAuthenticated } = useAuth()

  const handleArticleCreated = (newArticle: any) => {
    setArticles(prev => [newArticle, ...prev])
  }

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(selectedCategory === categoryName ? null : categoryName)
  }

  const filteredArticles = selectedCategory
    ? articles.filter(article => article.category === selectedCategory)
    : articles

  return (
    <>
      <div id="accueil">
        <Banner title={title} description={description} />
      </div>
      <div className="mx-auto max-w-6xl px-3">
        <div id="categories">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryClick={handleCategoryClick}
          />
        </div>
        <div id="blog">
          <div className="flex items-center justify-between mb-6">
            <div>
              <SectionHeading
                title={selectedCategory ? [selectedCategory, 'Articles'] : ['Latest', 'Articles']}
                subtitle={
                  selectedCategory
                    ? `Articles filtered by ${selectedCategory} category`
                    : "Diverse Range of articles related to html css and javascript"
                }
              />
              {selectedCategory && (
                <div className="mt-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    ← Show all articles
                  </button>
                </div>
              )}
            </div>
            {isAuthenticated && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                title="Create New Article"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Article</span>
              </button>
            )}
          </div>
          <BlogList posts={filteredArticles} />
        </div>

        <div id="projects" className="bg-gradient-to-br from-gray-50 to-indigo-50 py-16 -mx-3 px-3 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <div>
              <SectionHeading
                title={['Our', 'Projects']}
                subtitle="Professional development projects and solutions for modern businesses"
              />
            </div>
            {isAuthenticated && (
              <button
                onClick={() => {/* TODO: Add project creation modal */}}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
                title="Create New Project"
              >
                <Plus size={20} />
                <span className="hidden sm:inline">Add Project</span>
              </button>
            )}
          </div>
          <ProductList products={products} />

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Looking for custom solutions? We create tailored projects for your specific needs.
            </p>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold shadow-md hover:shadow-lg">
              Request Custom Project
            </button>
          </div>
        </div>

        <div id="faq">
          <Faq items={faqs} />
        </div>
        <div id="newsletter">
          <Newsletter />
        </div>
      </div>

      {/* Create Article Modal */}
      <CreateArticleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onArticleCreated={handleArticleCreated}
      />
    </>
  )
}