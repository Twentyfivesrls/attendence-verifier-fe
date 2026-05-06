import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../constants/api.constants';

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  get<T>(path: string, params?: Record<string, string>): Observable<T> {
    let p = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) p = p.set(k, v);
      });
    }
    return this.http.get<T>(`${API_BASE_URL}${path}`, { params: p });
  }

  post<T>(path: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${API_BASE_URL}${path}`, body);
  }

  delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}${path}`);
  }

  postMultipart<T>(path: string, formData: FormData): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}${path}`, formData);
  }

  getBlob(path: string): Observable<Blob> {
    return this.http.get(`${API_BASE_URL}${path}`, { responseType: 'blob' });
  }
}
