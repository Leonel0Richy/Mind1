/**
 * API Test Component
 * Quick test to verify backend connectivity
 */

import React, { useState, useEffect } from 'react';
import { apiClient } from '../../utils/api';

const ApiTest: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.healthCheck();
        setHealthStatus(response.data);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to connect to backend');
        setHealthStatus(null);
      } finally {
        setIsLoading(false);
      }
    };

    testConnection();
  }, []);

  if (isLoading) {
    return (
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-700">Testing backend connection...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="font-semibold text-red-800 mb-2">Backend Connection Failed</h3>
        <p className="text-red-700 text-sm">{error}</p>
        <p className="text-red-600 text-xs mt-2">
          Make sure the backend server is running on http://localhost:5003
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-2">✅ Backend Connected Successfully!</h3>
      <div className="text-sm text-green-700">
        <p><strong>Status:</strong> {healthStatus.status}</p>
        <p><strong>Version:</strong> {healthStatus.version}</p>
        <p><strong>Storage:</strong> {healthStatus.storage.mode} ({healthStatus.storage.status})</p>
      </div>
    </div>
  );
};

export default ApiTest;
