import Banner from "./banner/SimpleBanner"
import CategoryList from "./category/CategoryList"
import SectionHeading from "./sectionHeading/ColoredSectionHeading"
import BlogList from "./blog/BlogList"
import Faq from "./faq/Faq"
import Newsletter from "./newsletter/Newsletter"
import { blogPosts, categories, description, faqs, title } from '../appData'

export default function HomePage() {
  return (
    <>
      <div id="accueil">
        <Banner title={title} description={description} />
      </div>
      <div className="mx-auto max-w-6xl px-3">
        <div id="categories">
          <CategoryList categories={categories} />
        </div>
        <div id="blog">
          <SectionHeading
            title={['Latest', 'Articles']}
            subtitle="Diverse Range of articles related to html css and javascript"
          />
          <BlogList posts={blogPosts} />
        </div>
        <div id="popular">
          <SectionHeading
            title={['Popular', 'Articles']}
            subtitle="Diverse Range of articles related to html css and javascript"
          />
          <BlogList posts={blogPosts} type="horizontal" />
        </div>
        <div id="faq">
          <Faq items={faqs} />
        </div>
        <div id="newsletter">
          <Newsletter />
        </div>
      </div>
    </>
  )
} 