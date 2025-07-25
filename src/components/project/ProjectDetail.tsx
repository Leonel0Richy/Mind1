/**
 * Project Detail Page Component
 * Shows full project information with features and pricing
 */

import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Check, ExternalLink, Github, Calendar, DollarSign } from 'lucide-react';
import { products } from '../../appData/products';
import BillingModal from '../billing/BillingModal';
import ContactModal from '../contact/ContactModal';

const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);

  const project = products.find(product =>
    product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') === slug
  );

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Project Not Found</h1>
          <p className="text-gray-600 mb-8">The project you're looking for doesn't exist.</p>
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

  const features = [
    'Responsive Design',
    'Modern UI/UX',
    'Performance Optimized',
    'SEO Friendly',
    'Cross-browser Compatible',
    'Mobile First Approach',
    'Clean Code Architecture',
    'Documentation Included',
    'Testing Suite',
    'Deployment Ready'
  ];

  const technologies = [
    'React', 'TypeScript', 'Node.js', 'MongoDB', 'Tailwind CSS', 
    'Express.js', 'JWT Authentication', 'REST APIs', 'Docker', 'AWS'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Back to Projects
          </Link>
          
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(4.9/5 rating)</span>
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {project.title}
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                {project.description}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-3xl font-bold text-indigo-600">
                  <DollarSign size={28} />
                  {project.price}
                </div>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    Delivery: 2-4 weeks
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowContactModal(true)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
                >
                  Get Started
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
                  View Demo
                </button>
              </div>
            </div>

            <div>
              <img
                src={project.imageSrc}
                alt={project.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project Details */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Overview</h2>
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="mb-4">
                  This {project.title.toLowerCase()} represents the cutting edge of modern web development, 
                  combining the latest technologies with proven design patterns to deliver exceptional 
                  user experiences.
                </p>
                <p className="mb-4">
                  Our team has carefully crafted every aspect of this project, from the initial concept 
                  to the final deployment. We focus on performance, scalability, and maintainability 
                  to ensure your investment delivers long-term value.
                </p>
                <p>
                  Whether you're a startup looking to establish your digital presence or an enterprise 
                  seeking to modernize your systems, this solution provides the foundation you need 
                  to succeed in today's competitive market.
                </p>
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Technologies */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Technologies Used</h2>
              <div className="flex flex-wrap gap-3">
                {technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Process */}
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Development Process</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Discovery & Planning</h3>
                    <p className="text-gray-600">We analyze your requirements and create a detailed project roadmap.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Design & Architecture</h3>
                    <p className="text-gray-600">Our team creates wireframes, mockups, and technical specifications.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Development & Testing</h3>
                    <p className="text-gray-600">We build your solution using agile methodologies with continuous testing.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Deployment & Support</h3>
                    <p className="text-gray-600">We deploy your project and provide ongoing support and maintenance.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-indigo-100">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{project.price}</div>
                <p className="text-gray-600">One-time payment</p>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Source code included</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Commercial license</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>6 months support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-green-600" />
                  <span>Free updates</span>
                </div>
              </div>

              <button
                onClick={() => setShowBillingModal(true)}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-semibold mb-3"
              >
                Purchase Now
              </button>
              
              <div className="flex gap-2">
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1">
                  <ExternalLink size={16} />
                  Demo
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors text-sm flex items-center justify-center gap-1">
                  <Github size={16} />
                  Code
                </button>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need Customization?</h3>
              <p className="text-gray-600 text-sm mb-4">
                We can customize this project to meet your specific requirements.
              </p>
              <button
                onClick={() => setShowContactModal(true)}
                className="w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
              >
                Contact Us
              </button>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Project Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Downloads</span>
                  <span className="font-medium">1,234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-medium">4.9/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span className="font-medium">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Billing Modal */}
      {project && (
        <BillingModal
          isOpen={showBillingModal}
          onClose={() => setShowBillingModal(false)}
          project={{
            title: project.title,
            price: project.price,
            description: project.description
          }}
        />
      )}

      {/* Contact Modal */}
      {project && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
          project={{
            title: project.title,
            price: project.price
          }}
        />
      )}
    </div>
  );
};

export default ProjectDetail;
