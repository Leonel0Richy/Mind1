/**
 * User Dashboard Component
 * Shows user profile and applications
 */

import React, { useState, useEffect } from 'react';
import { User, Calendar, Clock, FileText, ExternalLink, Github } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { apiClient, Application } from '../../utils/api';

const UserDashboard: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.getApplications();
        if (response.success) {
          setApplications(response.data.applications);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch applications');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'waitlisted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Authentication Required
          </h2>
          <p className="text-gray-600 mb-8">
            Please log in to access your dashboard.
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome, {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-gray-600">{user?.email}</p>
              {user?.phone && (
                <p className="text-gray-600">{user.phone}</p>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Applications Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Applications</h2>
            <p className="text-gray-600 mt-1">
              Track the status of your program applications
            </p>
          </div>

          <div className="p-6">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No Applications Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't submitted any applications. Click "Apply to Geeks Now" to get started!
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {application.program}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Applied: {new Date(application.submissionDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{application.availability.timeCommitment}</span>
                          </div>
                        </div>
                        {application.referenceNumber && (
                          <p className="text-sm text-gray-500 mt-1">
                            Reference: {application.referenceNumber}
                          </p>
                        )}
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {formatStatus(application.status)}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Motivation</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {application.motivation}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Experience</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {application.experience}
                        </p>
                      </div>
                    </div>

                    {/* Technical Skills */}
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Technical Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {application.technicalSkills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                          >
                            {skill.skill} ({skill.level})
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Projects */}
                    {application.projects && application.projects.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium text-gray-900 mb-2">Projects</h4>
                        <div className="space-y-2">
                          {application.projects.map((project, index) => (
                            <div key={index} className="border border-gray-100 rounded p-3">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{project.name}</h5>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {project.description}
                                  </p>
                                  {project.technologies && project.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-2">
                                      {project.technologies.map((tech, techIndex) => (
                                        <span
                                          key={techIndex}
                                          className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs"
                                        >
                                          {tech}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-2 ml-4">
                                  {project.url && (
                                    <a
                                      href={project.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-indigo-600 hover:text-indigo-700"
                                    >
                                      <ExternalLink className="w-4 h-4" />
                                    </a>
                                  )}
                                  {project.githubUrl && (
                                    <a
                                      href={project.githubUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-gray-600 hover:text-gray-700"
                                    >
                                      <Github className="w-4 h-4" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    <div className="text-sm text-gray-600">
                      <strong>Start Date:</strong>{' '}
                      {new Date(application.availability.startDate).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
