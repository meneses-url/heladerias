import { Injectable } from '@angular/core';

const REFRESH_TOKEN_KEY = 'dulce_tentacion.refresh_token';

@Injectable({ providedIn: 'root' })
export class AuthStorageService {
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setRefreshToken(refreshToken: string): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  clear(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
