/**
 * Contact Us Modal Component
 * Handles customer inquiries and project consultations
 */

import React, { useState } from 'react';
import { X, Mail, Phone, MessageCircle, User, Calendar, DollarSign, Clock } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: {
    title: string;
    price: string;
  };
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, project }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [contactData, setContactData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: project ? 'project_inquiry' : 'general',
    projectType: project?.title || '',
    budget: '',
    timeline: '',
    message: '',
    preferredContact: 'email'
  });

  const handleInputChange = (field: string, value: string) => {
    setContactData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      alert('Thank you for your inquiry! We will get back to you within 24 hours.');
      onClose();
      
      // Reset form
      setContactData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: 'general',
        projectType: '',
        budget: '',
        timeline: '',
        message: '',
        preferredContact: 'email'
      });
    } catch (error) {
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
            <p className="text-gray-600">
              {project 
                ? `Inquiry about ${project.title}` 
                : 'Get in touch for custom solutions and consultations'
              }
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contact Information */}
        <div className="px-6 py-4 bg-indigo-50 border-b">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-indigo-700">
              <Mail size={16} />
              <span>contact@masterminds.dev</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-700">
              <Phone size={16} />
              <span>+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-700">
              <Clock size={16} />
              <span>Response within 24h</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User size={20} />
              Contact Information
            </h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={contactData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={contactData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={contactData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company/Organization
              </label>
              <input
                type="text"
                value={contactData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Your Company Name"
              />
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle size={20} />
              Project Details
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inquiry Type *
                </label>
                <select
                  required
                  value={contactData.inquiryType}
                  onChange={(e) => handleInputChange('inquiryType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="general">General Inquiry</option>
                  <option value="project_inquiry">Project Inquiry</option>
                  <option value="custom_development">Custom Development</option>
                  <option value="consultation">Consultation</option>
                  <option value="support">Support</option>
                  <option value="partnership">Partnership</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preferred Contact Method
                </label>
                <select
                  value={contactData.preferredContact}
                  onChange={(e) => handleInputChange('preferredContact', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="email">Email</option>
                  <option value="phone">Phone Call</option>
                  <option value="video">Video Call</option>
                  <option value="meeting">In-Person Meeting</option>
                </select>
              </div>
            </div>

            {contactData.inquiryType === 'project_inquiry' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Type
                </label>
                <select
                  value={contactData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Project Type</option>
                  <option value="E-commerce Platform">E-commerce Platform</option>
                  <option value="Analytics Dashboard">Analytics Dashboard</option>
                  <option value="AI Chatbot System">AI Chatbot System</option>
                  <option value="Mobile App Development">Mobile App Development</option>
                  <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                  <option value="Custom Web Development">Custom Web Development</option>
                  <option value="Custom Solution">Custom Solution</option>
                </select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <DollarSign className="inline mr-1" size={16} />
                  Budget Range
                </label>
                <select
                  value={contactData.budget}
                  onChange={(e) => handleInputChange('budget', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Budget Range</option>
                  <option value="under_1k">Under $1,000</option>
                  <option value="1k_5k">$1,000 - $5,000</option>
                  <option value="5k_10k">$5,000 - $10,000</option>
                  <option value="10k_25k">$10,000 - $25,000</option>
                  <option value="25k_50k">$25,000 - $50,000</option>
                  <option value="50k_plus">$50,000+</option>
                  <option value="discuss">Prefer to discuss</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="inline mr-1" size={16} />
                  Timeline
                </label>
                <select
                  value={contactData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select Timeline</option>
                  <option value="asap">ASAP (Rush)</option>
                  <option value="1_2_weeks">1-2 weeks</option>
                  <option value="2_4_weeks">2-4 weeks</option>
                  <option value="1_2_months">1-2 months</option>
                  <option value="2_6_months">2-6 months</option>
                  <option value="6_months_plus">6+ months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              required
              rows={5}
              value={contactData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder={project 
                ? `I'm interested in the ${project.title} project. Please provide more details about...`
                : "Please describe your project requirements, goals, and any specific questions you have..."
              }
            />
            <p className="text-xs text-gray-500 mt-1">
              Please provide as much detail as possible to help us understand your needs.
            </p>
          </div>

          {/* Privacy Notice */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600">
              <strong>Privacy Notice:</strong> Your information will be used solely to respond to your inquiry. 
              We respect your privacy and will never share your details with third parties.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
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
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactModal;
