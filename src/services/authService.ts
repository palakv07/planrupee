import { api } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'traveler' | 'local' | 'admin';
  avatar_url?: string;
  bio?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: AuthUser;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: 'traveler' | 'local' | 'admin';
  bio?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authService = {
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>('/auth/register', payload);
    localStorage.setItem('planrupee_auth_token', data.access_token);
    return data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const data = await api.post<AuthResponse>('/auth/login', payload);
    localStorage.setItem('planrupee_auth_token', data.access_token);
    return data;
  },

  async getMe(): Promise<AuthUser> {
    return api.get<AuthUser>('/auth/me');
  },

  logout(): void {
    localStorage.removeItem('planrupee_auth_token');
  },

  getToken(): string | null {
    return localStorage.getItem('planrupee_auth_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('planrupee_auth_token');
  },
};
