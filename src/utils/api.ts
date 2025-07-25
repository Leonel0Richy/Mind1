/**
 * API Utilities for MasterMinds Frontend
 * Handles all communication with the backend v2.0
 */

const API_BASE_URL = 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    tokens: AuthTokens;
  };
  meta?: {
    storageMode: string;
    loginTime?: string;
  };
}

export interface Application {
  id: string;
  user: string;
  program: string;
  motivation: string;
  experience: string;
  goals: string;
  availability: {
    startDate: string;
    timeCommitment: string;
  };
  technicalSkills: Array<{
    skill: string;
    level: string;
  }>;
  projects?: Array<{
    name: string;
    description: string;
    technologies: string[];
    url?: string;
    githubUrl?: string;
  }>;
  status: string;
  submissionDate: string;
  referenceNumber?: string;
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: Array<{
    field: string;
    message: string;
    value: any;
  }>;
}

// API Client Class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('authToken');
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  getToken(): string | null {
    return this.token || localStorage.getItem('authToken');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getToken();

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If JSON parsing fails, use the default error message
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.success && response.data.tokens.accessToken) {
      this.setToken(response.data.tokens.accessToken);
    }

    return response;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.tokens.accessToken) {
      this.setToken(response.data.tokens.accessToken);
    }

    return response;
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    const response = await this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });

    this.setToken(null);
    return response;
  }

  async getCurrentUser(): Promise<{ success: boolean; data: { user: User } }> {
    return this.request<{ success: boolean; data: { user: User } }>('/auth/me');
  }

  // Application endpoints
  async submitApplication(applicationData: {
    program: string;
    motivation: string;
    experience: string;
    goals: string;
    availability: {
      startDate: string;
      timeCommitment: string;
    };
    technicalSkills: Array<{
      skill: string;
      level: string;
    }>;
    projects?: Array<{
      name: string;
      description: string;
      technologies: string[];
      url?: string;
      githubUrl?: string;
    }>;
  }): Promise<{ success: boolean; message: string; data: { application: Application } }> {
    return this.request<{ success: boolean; message: string; data: { application: Application } }>('/applications', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  }

  async getApplications(): Promise<{ 
    success: boolean; 
    data: { 
      applications: Application[];
      pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
        hasNextPage: boolean;
        hasPrevPage: boolean;
      };
    } 
  }> {
    return this.request<{ 
      success: boolean; 
      data: { 
        applications: Application[];
        pagination: any;
      } 
    }>('/applications');
  }

  async getApplication(id: string): Promise<{ success: boolean; data: { application: Application } }> {
    return this.request<{ success: boolean; data: { application: Application } }>(`/applications/${id}`);
  }

  // Health check
  async healthCheck(): Promise<{ 
    success: boolean; 
    message: string; 
    data: { 
      status: string; 
      version: string; 
      storage: { mode: string; status: string } 
    } 
  }> {
    return this.request<{ 
      success: boolean; 
      message: string; 
      data: { 
        status: string; 
        version: string; 
        storage: { mode: string; status: string } 
      } 
    }>('/health');
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Utility functions
export const isAuthenticated = (): boolean => {
  return !!apiClient.getToken();
};

export const clearAuth = (): void => {
  apiClient.setToken(null);
};

// Available programs for applications
export const AVAILABLE_PROGRAMS = [
  'Full Stack Development',
  'Data Science & Analytics',
  'AI & Machine Learning',
  'Mobile App Development',
  'Cloud Infrastructure',
  'Cybersecurity',
  'UI/UX Design',
  'DevOps Engineering'
] as const;

export const TIME_COMMITMENTS = [
  'Part-time (10-20 hours/week)',
  'Full-time (40+ hours/week)',
  'Flexible'
] as const;

export const SKILL_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
] as const;
