import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppEnvironment } from '../models/app-environment.model';
import { APP_ENVIRONMENT } from '../tokens/app-environment.token';

type HeaderValue = string | string[];
type ParamValue = string | number | boolean | ReadonlyArray<string | number | boolean>;

export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, HeaderValue>;
  params?:
    | HttpParams
    | Record<string, ParamValue>;
  context?: HttpContext;
  withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  constructor(
    private readonly http: HttpClient,
    @Inject(APP_ENVIRONMENT) private readonly env: AppEnvironment
  ) {}

  get<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.resolveUrl(path), options);
  }

  post<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(this.resolveUrl(path), body, options);
  }

  put<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(this.resolveUrl(path), body, options);
  }

  patch<T>(path: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(this.resolveUrl(path), body, options);
  }

  delete<T>(path: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(this.resolveUrl(path), options);
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//.test(path)) {
      return path;
    }

    const normalizedBaseUrl = this.env.apiBaseUrl.replace(/\/+$/, '');
    const normalizedPath = path.replace(/^\/+/, '');
    return `${normalizedBaseUrl}/${normalizedPath}`;
  }
}
