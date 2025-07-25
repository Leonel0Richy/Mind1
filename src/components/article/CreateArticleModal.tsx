/**
 * Create Article Modal Component
 * Allows users to create new articles
 */

import React, { useState } from 'react';
import { X, FileText, Calendar, Clock, Image, Tag } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface CreateArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticleCreated: (article: any) => void;
}

const CreateArticleModal: React.FC<CreateArticleModalProps> = ({ 
  isOpen, 
  onClose, 
  onArticleCreated 
}) => {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const [articleForm, setArticleForm] = useState({
    title: '',
    shortDescription: '',
    content: '',
    cover: '',
    category: '',
    tags: '',
    estimatedTimeToRead: '5 min read'
  });

  const categories = [
    'JavaScript',
    'React',
    'TypeScript',
    'Node.js',
    'CSS',
    'HTML',
    'Web Development',
    'Frontend',
    'Backend',
    'Full Stack',
    'UI/UX',
    'DevOps',
    'Database',
    'API',
    'Mobile Development'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setError('You must be logged in to create articles');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Create new article object
      const newArticle = {
        id: Date.now().toString(),
        title: articleForm.title,
        shortDescription: articleForm.shortDescription,
        content: articleForm.content,
        cover: articleForm.cover || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
        slug: articleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        publishDate: new Date().toISOString().split('T')[0],
        estimatedTimeToRead: articleForm.estimatedTimeToRead,
        author: {
          name: `${user?.firstName} ${user?.lastName}`,
          email: user?.email
        },
        category: articleForm.category,
        tags: articleForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        status: 'published'
      };

      // Simulate API call (in real app, this would be an API request)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call the callback to add the article
      onArticleCreated(newArticle);

      // Reset form
      setArticleForm({
        title: '',
        shortDescription: '',
        content: '',
        cover: '',
        category: '',
        tags: '',
        estimatedTimeToRead: '5 min read'
      });

      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create article');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Create New Article
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAuthenticated ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Authentication Required
              </h3>
              <p className="text-gray-600 mb-6">
                Please log in to create articles.
              </p>
              <button
                onClick={onClose}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={articleForm.title}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter article title..."
                  />
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={articleForm.shortDescription}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, shortDescription: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Brief description of the article..."
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Article Content *
                  </label>
                  <textarea
                    required
                    rows={8}
                    value={articleForm.content}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Write your article content here..."
                  />
                </div>

                {/* Cover Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="inline mr-2" size={16} />
                    Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={articleForm.cover}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, cover: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="https://example.com/image.jpg (optional)"
                  />
                </div>

                {/* Category and Reading Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="inline mr-2" size={16} />
                      Category *
                    </label>
                    <select
                      required
                      value={articleForm.category}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select category...</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline mr-2" size={16} />
                      Reading Time
                    </label>
                    <select
                      value={articleForm.estimatedTimeToRead}
                      onChange={(e) => setArticleForm(prev => ({ ...prev, estimatedTimeToRead: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="3 min read">3 min read</option>
                      <option value="5 min read">5 min read</option>
                      <option value="7 min read">7 min read</option>
                      <option value="10 min read">10 min read</option>
                      <option value="15 min read">15 min read</option>
                      <option value="20 min read">20 min read</option>
                    </select>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={articleForm.tags}
                    onChange={(e) => setArticleForm(prev => ({ ...prev, tags: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="react, javascript, tutorial, beginner"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? 'Creating...' : 'Create Article'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateArticleModal;
