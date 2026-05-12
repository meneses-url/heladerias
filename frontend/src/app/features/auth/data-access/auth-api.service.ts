import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiClient } from '../../../core/http/api-client.service';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: 'ADMIN' | 'CASHIER';
  isActive: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserProfile;
  tokens: AuthTokens;
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly apiClient: ApiClient) {}

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>('/auth/login', payload);
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    return this.apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
  }

  me(): Observable<{ user: UserProfile }> {
    return this.apiClient.get<{ user: UserProfile }>('/auth/me');
  }
}
