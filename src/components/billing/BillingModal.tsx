/**
 * Billing Modal Component
 * Handles project purchase and billing information
 */

import React, { useState } from 'react';
import { X, CreditCard, Lock, User, Mail, MapPin, Calendar } from 'lucide-react';

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    price: string;
    description: string;
  };
}

const BillingModal: React.FC<BillingModalProps> = ({ isOpen, onClose, project }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [billingData, setBillingData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    
    // Billing Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    
    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Project Details
    projectType: 'standard',
    timeline: '2-4 weeks',
    additionalRequirements: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setBillingData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would integrate with a payment processor like Stripe
      alert('Payment processed successfully! We will contact you within 24 hours to start your project.');
      onClose();
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Purchase Project</h2>
            <p className="text-gray-600">{project.title} - {project.price}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${
                  step <= currentStep ? 'text-indigo-600' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Personal Info' : step === 2 ? 'Billing' : 'Payment'}
                </span>
                {step < 3 && <div className="w-12 h-0.5 bg-gray-200 mx-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingData.firstName}
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
                    value={billingData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Mail className="inline mr-1" size={16} />
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={billingData.email}
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
                  value={billingData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Timeline
                </label>
                <select
                  value={billingData.timeline}
                  onChange={(e) => handleInputChange('timeline', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="2-4 weeks">2-4 weeks (Standard)</option>
                  <option value="1-2 weeks">1-2 weeks (Rush - +25%)</option>
                  <option value="4-8 weeks">4-8 weeks (Extended)</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Billing Address */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin size={20} />
                Billing Address
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  required
                  value={billingData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP/Postal Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <select
                    required
                    value={billingData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select Country</option>
                    <option value="US">United States</option>
                    <option value="CA">Canada</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                    <option value="DE">Germany</option>
                    <option value="FR">France</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Requirements
                </label>
                <textarea
                  rows={3}
                  value={billingData.additionalRequirements}
                  onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Any specific requirements or customizations..."
                />
              </div>
            </div>
          )}

          {/* Step 3: Payment Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard size={20} />
                Payment Information
              </h3>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 text-blue-800">
                  <Lock size={16} />
                  <span className="text-sm font-medium">Secure Payment</span>
                </div>
                <p className="text-blue-700 text-sm mt-1">
                  Your payment information is encrypted and secure.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  value={billingData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cardholder Name *
                </label>
                <input
                  type="text"
                  required
                  value={billingData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar className="inline mr-1" size={16} />
                    Expiry Date *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    required
                    value={billingData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{project.title}</span>
                    <span className="font-medium">{project.price}</span>
                  </div>
                  {billingData.timeline === '1-2 weeks' && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rush delivery (+25%)</span>
                      <span className="font-medium">+$500</span>
                    </div>
                  )}
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>Total</span>
                    <span className="text-indigo-600">
                      {billingData.timeline === '1-2 weeks' 
                        ? `$${(parseInt(project.price.replace('$', '').replace(',', '')) * 1.25).toLocaleString()}`
                        : project.price
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Previous
              </button>
            )}
            
            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Processing...' : 'Complete Purchase'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default BillingModal;
