/**
 * Article Detail Page Component
 * Shows full article content with author info and metadata
 */

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, User, ArrowLeft, Tag } from 'lucide-react';
import { blogPosts } from '../../appData/blogPost';
import { formatDate } from '../../utils';

const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = blogPosts.find(post => post.slug === slug);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Articles
          </Link>
          
          <div className="mb-6">
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                <Tag size={14} />
                {article.category}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={16} />
                {formatDate(article.publishDate)}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={16} />
                {article.estimatedTimeToRead}
              </span>
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              {article.shortDescription}
            </p>
          </div>

          {/* Author Info */}
          {article.author && (
            <div className="flex items-center gap-3 py-4 border-t border-gray-200">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{article.author.name}</p>
                <p className="text-sm text-gray-600">{article.author.email}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Cover Image */}
        <div className="mb-8">
          <img
            src={article.cover}
            alt={article.title}
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Article Body */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div className="text-gray-700 leading-relaxed space-y-6">
              {article.content ? (
                article.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-lg leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="space-y-6">
                  <p className="text-lg leading-relaxed">
                    This is a comprehensive article about {article.title.toLowerCase()}. 
                    The content covers essential concepts, practical examples, and best practices 
                    that every developer should know.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    In this detailed guide, we explore the fundamental principles and advanced 
                    techniques that will help you master this topic. Whether you're a beginner 
                    or an experienced developer, you'll find valuable insights and actionable advice.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    We'll walk through step-by-step examples, common pitfalls to avoid, and 
                    industry best practices that will elevate your development skills. By the end 
                    of this article, you'll have a solid understanding of the concepts and be 
                    ready to apply them in your own projects.
                  </p>
                  
                  <p className="text-lg leading-relaxed">
                    The techniques and patterns discussed here are used by leading companies and 
                    experienced developers worldwide. Take your time to understand each concept 
                    and practice implementing them in your development workflow.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    <Tag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts
              .filter(post => 
                post.id !== article.id && 
                (post.category === article.category || 
                 post.tags?.some(tag => article.tags?.includes(tag)))
              )
              .slice(0, 2)
              .map(relatedArticle => (
                <Link
                  key={relatedArticle.id}
                  to={`/article/${relatedArticle.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <img
                    src={relatedArticle.cover}
                    alt={relatedArticle.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-xs">
                        {relatedArticle.category}
                      </span>
                      <span>{relatedArticle.estimatedTimeToRead}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {relatedArticle.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3">
                      {relatedArticle.shortDescription}
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
