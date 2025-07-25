import { blogPosts, categories, description, faqs, products, title } from './appData'
import { Routes, Route } from 'react-router-dom'
import Banner from './components/banner/SimpleBanner'
import BlogList from './components/blog/BlogList'
import CategoryList from './components/category/CategoryList'
import Faq from './components/faq/Faq'
import Footer from './components/footer/MultiColumnFooter'
import Navbar from './components/navbar/BlogNavbar'
import Newsletter from './components/newsletter/Newsletter'
import ProductList from './components/product/ProductList'
import SectionHeading from './components/sectionHeading/ColoredSectionHeading'
import HomePage from './components/HomePage'
import { AuthProvider } from './contexts/AuthContext'
import UserDashboard from './components/dashboard/UserDashboard'
import ArticleDetail from './components/article/ArticleDetail'
import ProjectDetail from './components/project/ProjectDetail'
import ScrollProgressBar from './components/common/ScrollProgressBar'
import BackToTop from './components/common/BackToTop'

function App() {
  return (
    <AuthProvider>
      <ScrollProgressBar />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogList posts={blogPosts} />} />
        <Route path="/categories" element={<CategoryList categories={categories} />} />
        <Route path="/projects" element={
          <div className="mx-auto max-w-6xl px-3">
            <Banner title={title} description={description} />
            <SectionHeading
              title={['Featured', 'Projects']}
              subtitle="Explore our comprehensive development projects and showcase your technical expertise"
            />
            <ProductList products={products} />
          </div>
        } />
        <Route path="/masterminds" element={
          <div>
            <Banner title={title} description={description} />
            <div className="mx-auto max-w-6xl px-3">
              <CategoryList categories={categories} />
              <SectionHeading
                title={['Featured', 'Projects']}
                subtitle="Explore our comprehensive development projects and showcase your technical expertise"
              />
              <ProductList products={products} />
              <Faq items={faqs} />
              <Newsletter />
            </div>
          </div>
        } />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/article/:slug" element={<ArticleDetail />} />
        <Route path="/project/:slug" element={<ProjectDetail />} />
      </Routes>
      <Footer />
      <BackToTop />
    </AuthProvider>
  )
}

export default App
