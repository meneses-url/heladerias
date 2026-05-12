import { UserProfile } from './auth-api.service';

export interface AuthSession {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}

export type AuthStatus = 'idle' | 'authenticating' | 'refreshing' | 'authenticated';

export interface AuthState {
  status: AuthStatus;
  user: UserProfile | null;
  accessToken: string | null;
  refreshToken: string | null;
  initialized: boolean;
}
