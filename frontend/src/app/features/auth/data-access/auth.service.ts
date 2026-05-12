import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AuthApiService, LoginRequest, UserProfile } from './auth-api.service';
import { AuthSession, AuthState } from './auth-session.model';
import { AuthStorageService } from './auth-storage.service';

const INITIAL_AUTH_STATE: AuthState = {
  status: 'idle',
  user: null,
  accessToken: null,
  refreshToken: null,
  initialized: false
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly authStorage = inject(AuthStorageService);
  private readonly router = inject(Router);

  private readonly state = signal<AuthState>(INITIAL_AUTH_STATE);

  readonly authState = this.state.asReadonly();
  readonly status = computed(() => this.state().status);
  readonly user = computed(() => this.state().user);
  readonly accessToken = computed(() => this.state().accessToken);
  readonly refreshToken = computed(() => this.state().refreshToken);
  readonly isInitialized = computed(() => this.state().initialized);
  readonly isAuthenticated = computed(() => !!this.state().accessToken && !!this.state().user);

  login(credentials: LoginRequest): Observable<UserProfile> {
    this.patchState({ status: 'authenticating' });

    return this.authApi.login(credentials).pipe(
      tap((response) => {
        this.applySession({
          user: response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken
        });
      }),
      map((response) => response.user),
      catchError((error) => {
        this.clearSessionState({ preserveInitialization: true });
        return throwError(() => error);
      })
    );
  }

  initialize(): Observable<UserProfile | null> {
    const persistedRefreshToken = this.authStorage.getRefreshToken();

    if (!persistedRefreshToken) {
      this.clearSessionState({ preserveInitialization: false });
      this.patchState({ initialized: true });
      return of(null);
    }

    this.patchState({
      status: 'refreshing',
      refreshToken: persistedRefreshToken,
      initialized: false
    });

    return this.authApi.refresh(persistedRefreshToken).pipe(
      tap((response) => {
        this.applySession({
          user: response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken
        });
      }),
      map((response) => response.user),
      catchError(() => {
        this.clearSessionState({ preserveInitialization: false });
        this.patchState({ initialized: true });
        return of(null);
      })
    );
  }

  refreshSession(): Observable<string> {
    const currentRefreshToken = this.state().refreshToken ?? this.authStorage.getRefreshToken();

    if (!currentRefreshToken) {
      return throwError(() => new Error('No hay refresh token disponible'));
    }

    this.patchState({ status: 'refreshing', refreshToken: currentRefreshToken });

    return this.authApi.refresh(currentRefreshToken).pipe(
      tap((response) => {
        this.applySession({
          user: response.user,
          accessToken: response.tokens.accessToken,
          refreshToken: response.tokens.refreshToken
        });
      }),
      map((response) => response.tokens.accessToken),
      catchError((error) => {
        this.clearSessionState({ preserveInitialization: true });
        return throwError(() => error);
      })
    );
  }

  logout(options?: { redirectTo?: string }): void {
    this.clearSessionState({ preserveInitialization: true });
    void this.router.navigateByUrl(options?.redirectTo ?? '/auth/login');
  }

  getAccessTokenSnapshot(): string | null {
    return this.state().accessToken;
  }

  getRefreshTokenSnapshot(): string | null {
    return this.state().refreshToken;
  }

  private applySession(session: AuthSession): void {
    this.authStorage.setRefreshToken(session.refreshToken);
    this.patchState({
      status: 'authenticated',
      user: session.user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      initialized: true
    });
  }

  private clearSessionState(options: { preserveInitialization: boolean }): void {
    this.authStorage.clear();
    this.patchState({
      status: 'idle',
      user: null,
      accessToken: null,
      refreshToken: null,
      initialized: options.preserveInitialization ? this.state().initialized : false
    });
  }

  private patchState(patch: Partial<AuthState>): void {
    this.state.update((currentState) => ({
      ...currentState,
      ...patch
    }));
  }
}
