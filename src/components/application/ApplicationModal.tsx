/**
 * Application Modal Component
 * Handles the complete application flow including authentication and form submission
 */

import React, { useState } from 'react';
import { X, User, Mail, Lock, Phone, Calendar, Clock, Code, Briefcase, Target } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient, AVAILABLE_PROGRAMS, TIME_COMMITMENTS, SKILL_LEVELS } from '../../utils/api';

interface ApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ModalStep = 'auth' | 'application' | 'success';
type AuthMode = 'login' | 'register';

const ApplicationModal: React.FC<ApplicationModalProps> = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, login, register } = useAuth();
  const [step, setStep] = useState<ModalStep>('auth');
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Auth form state
  const [authForm, setAuthForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: ''
  });

  // Application form state
  const [applicationForm, setApplicationForm] = useState({
    program: '',
    motivation: '',
    experience: '',
    goals: '',
    startDate: '',
    timeCommitment: '',
    technicalSkills: [{ skill: '', level: 'Beginner' }],
    projects: [{ name: '', description: '', technologies: '', url: '', githubUrl: '' }]
  });

  React.useEffect(() => {
    if (isAuthenticated && step === 'auth') {
      setStep('application');
    }
  }, [isAuthenticated, step]);

  React.useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      if (isAuthenticated) {
        setStep('application');
      } else {
        setStep('auth');
      }
    }
  }, [isOpen, isAuthenticated]);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (authMode === 'login') {
        await login(authForm.email, authForm.password);
      } else {
        await register({
          firstName: authForm.firstName,
          lastName: authForm.lastName,
          email: authForm.email,
          password: authForm.password,
          phone: authForm.phone || undefined
        });
      }
      setStep('application');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const applicationData = {
        program: applicationForm.program,
        motivation: applicationForm.motivation,
        experience: applicationForm.experience,
        goals: applicationForm.goals,
        availability: {
          startDate: applicationForm.startDate,
          timeCommitment: applicationForm.timeCommitment
        },
        technicalSkills: applicationForm.technicalSkills.filter(skill => skill.skill.trim()),
        projects: applicationForm.projects
          .filter(project => project.name.trim())
          .map(project => ({
            ...project,
            technologies: project.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
          }))
      };

      const response = await apiClient.submitApplication(applicationData);
      if (response.success) {
        setSuccess(`Application submitted successfully! Reference: ${response.data.application.referenceNumber || 'N/A'}`);
        setStep('success');
      }
    } catch (err: any) {
      setError(err.message || 'Application submission failed');
    } finally {
      setIsLoading(false);
    }
  };

  const addSkill = () => {
    setApplicationForm(prev => ({
      ...prev,
      technicalSkills: [...prev.technicalSkills, { skill: '', level: 'Beginner' }]
    }));
  };

  const removeSkill = (index: number) => {
    setApplicationForm(prev => ({
      ...prev,
      technicalSkills: prev.technicalSkills.filter((_, i) => i !== index)
    }));
  };

  const addProject = () => {
    setApplicationForm(prev => ({
      ...prev,
      projects: [...prev.projects, { name: '', description: '', technologies: '', url: '', githubUrl: '' }]
    }));
  };

  const removeProject = (index: number) => {
    setApplicationForm(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 'auth' ? (authMode === 'login' ? 'Sign In' : 'Create Account') : 
             step === 'application' ? 'Apply to MasterMinds' : 'Application Submitted!'}
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
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Authentication Step */}
          {step === 'auth' && (
            <div className="max-w-md mx-auto">
              <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    authMode === 'login' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    authMode === 'register' 
                      ? 'bg-white text-indigo-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Create Account
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === 'register' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            required
                            value={authForm.firstName}
                            onChange={(e) => setAuthForm(prev => ({ ...prev, firstName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="John"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                          <input
                            type="text"
                            required
                            value={authForm.lastName}
                            onChange={(e) => setAuthForm(prev => ({ ...prev, lastName: e.target.value }))}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Doe"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="email"
                      required
                      value={authForm.email}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="password"
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="••••••••"
                    />
                  </div>
                  {authMode === 'register' && (
                    <p className="text-xs text-gray-500 mt-1">
                      Must contain uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                {authMode === 'register' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number (Optional)
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <input
                        type="tel"
                        value={authForm.phone}
                        onChange={(e) => setAuthForm(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
                </button>
              </form>
            </div>
          )}

          {/* Application Step */}
          {step === 'application' && (
            <form onSubmit={handleApplicationSubmit} className="space-y-6">
              {/* Program Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Code className="inline mr-2" size={18} />
                  Program Selection
                </label>
                <select
                  required
                  value={applicationForm.program}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, program: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">Select a program...</option>
                  {AVAILABLE_PROGRAMS.map(program => (
                    <option key={program} value={program}>{program}</option>
                  ))}
                </select>
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Target className="inline mr-2" size={18} />
                  Motivation Letter (100-2000 characters)
                </label>
                <textarea
                  required
                  rows={4}
                  value={applicationForm.motivation}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, motivation: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Tell us why you want to join this program..."
                  minLength={100}
                  maxLength={2000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {applicationForm.motivation.length}/2000 characters
                </p>
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="inline mr-2" size={18} />
                  Experience (50-1500 characters)
                </label>
                <textarea
                  required
                  rows={3}
                  value={applicationForm.experience}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, experience: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Describe your relevant experience..."
                  minLength={50}
                  maxLength={1500}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {applicationForm.experience.length}/1500 characters
                </p>
              </div>

              {/* Goals */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Career Goals (50-1000 characters)
                </label>
                <textarea
                  required
                  rows={3}
                  value={applicationForm.goals}
                  onChange={(e) => setApplicationForm(prev => ({ ...prev, goals: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="What are your career goals?"
                  minLength={50}
                  maxLength={1000}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {applicationForm.goals.length}/1000 characters
                </p>
              </div>

              {/* Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Calendar className="inline mr-2" size={18} />
                    Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={applicationForm.startDate}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Clock className="inline mr-2" size={18} />
                    Time Commitment
                  </label>
                  <select
                    required
                    value={applicationForm.timeCommitment}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, timeCommitment: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Select commitment...</option>
                    {TIME_COMMITMENTS.map(commitment => (
                      <option key={commitment} value={commitment}>{commitment}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Technical Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Technical Skills
                </label>
                {applicationForm.technicalSkills.map((skill, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      required
                      value={skill.skill}
                      onChange={(e) => {
                        const newSkills = [...applicationForm.technicalSkills];
                        newSkills[index].skill = e.target.value;
                        setApplicationForm(prev => ({ ...prev, technicalSkills: newSkills }));
                      }}
                      className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="e.g., JavaScript"
                    />
                    <select
                      value={skill.level}
                      onChange={(e) => {
                        const newSkills = [...applicationForm.technicalSkills];
                        newSkills[index].level = e.target.value;
                        setApplicationForm(prev => ({ ...prev, technicalSkills: newSkills }));
                      }}
                      className="w-32 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {SKILL_LEVELS.map(level => (
                        <option key={level} value={level}>{level}</option>
                      ))}
                    </select>
                    {applicationForm.technicalSkills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addSkill}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Skill
                </button>
              </div>

              {/* Projects (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Projects (Optional)
                </label>
                {applicationForm.projects.map((project, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <input
                        type="text"
                        value={project.name}
                        onChange={(e) => {
                          const newProjects = [...applicationForm.projects];
                          newProjects[index].name = e.target.value;
                          setApplicationForm(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Project name"
                      />
                      <input
                        type="text"
                        value={project.technologies}
                        onChange={(e) => {
                          const newProjects = [...applicationForm.projects];
                          newProjects[index].technologies = e.target.value;
                          setApplicationForm(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Technologies (comma-separated)"
                      />
                    </div>
                    <textarea
                      rows={2}
                      value={project.description}
                      onChange={(e) => {
                        const newProjects = [...applicationForm.projects];
                        newProjects[index].description = e.target.value;
                        setApplicationForm(prev => ({ ...prev, projects: newProjects }));
                      }}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
                      placeholder="Project description"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="url"
                        value={project.url}
                        onChange={(e) => {
                          const newProjects = [...applicationForm.projects];
                          newProjects[index].url = e.target.value;
                          setApplicationForm(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Project URL (optional)"
                      />
                      <input
                        type="url"
                        value={project.githubUrl}
                        onChange={(e) => {
                          const newProjects = [...applicationForm.projects];
                          newProjects[index].githubUrl = e.target.value;
                          setApplicationForm(prev => ({ ...prev, projects: newProjects }));
                        }}
                        className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="GitHub URL (optional)"
                      />
                    </div>
                    {applicationForm.projects.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProject(index)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Project
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addProject}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  + Add Project
                </button>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setStep('auth')}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          )}

          {/* Success Step */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
              <p className="text-gray-600 mb-6">
                Thank you for applying to MasterMinds. We'll review your application and get back to you soon.
              </p>
              <button
                onClick={onClose}
                className="bg-indigo-600 text-white py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
