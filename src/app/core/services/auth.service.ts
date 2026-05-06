import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { API_BASE_URL, ApiEndpoints } from '../constants/api.constants';
import { firstValueFrom } from 'rxjs';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly ACCESS_KEY = 'av_access_token';
  private readonly REFRESH_KEY = 'av_refresh_token';
  private readonly EXPIRY_KEY  = 'av_token_expiry';

  constructor(private http: HttpClient, private router: Router) {}

  // Login via backend proxy → avoids browser CORS with Keycloak
  async login(username: string, password: string): Promise<void> {
    const response = await firstValueFrom(
      this.http.post<TokenResponse>(
        `${API_BASE_URL}${ApiEndpoints.authLogin}`,
        { username, password }
      )
    );
    this.storeTokens(response);
  }

  private storeTokens(res: TokenResponse): void {
    const expiry = Date.now() + (res.expires_in - 30) * 1000;
    localStorage.setItem(this.ACCESS_KEY, res.access_token);
    localStorage.setItem(this.REFRESH_KEY, res.refresh_token);
    localStorage.setItem(this.EXPIRY_KEY, expiry.toString());
  }

  async getValidAccessToken(): Promise<string | null> {
    const token = localStorage.getItem(this.ACCESS_KEY);
    if (!token) return null;
    const expiry = parseInt(localStorage.getItem(this.EXPIRY_KEY) ?? '0');
    if (Date.now() < expiry) return token;
    return this.refreshToken();
  }

  private async refreshToken(): Promise<string | null> {
    const refresh = localStorage.getItem(this.REFRESH_KEY);
    if (!refresh) return null;
    try {
      const response = await firstValueFrom(
        this.http.post<TokenResponse>(
          `${API_BASE_URL}${ApiEndpoints.authRefresh}`,
          { refreshToken: refresh }
        )
      );
      this.storeTokens(response);
      return response.access_token;
    } catch {
      this.clearTokens();
      return null;
    }
  }

  logout(): void {
    this.clearTokens();
    this.router.navigate(['/login']);
  }

  private clearTokens(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
    localStorage.removeItem(this.EXPIRY_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.ACCESS_KEY);
  }

  private decodeToken(): Record<string, unknown> {
    const token = localStorage.getItem(this.ACCESS_KEY);
    if (!token) return {};
    try {
      // JWT uses URL-safe base64 — replace chars before atob()
      const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(atob(b64));
    } catch {
      return {};
    }
  }

  getRoles(): string[] {
    const payload = this.decodeToken();
    return (payload['realm_access'] as { roles?: string[] })?.roles ?? [];
  }

  isAdmin(): boolean {
    return this.getRoles().includes('admin');
  }

  getUsername(): string {
    return (this.decodeToken()['preferred_username'] as string) ?? '';
  }
}
