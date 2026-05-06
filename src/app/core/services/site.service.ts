import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../constants/api.constants';
import { Site, CreateSiteRequest } from '../models/site.model';

@Injectable({ providedIn: 'root' })
export class SiteService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Site[]> {
    return this.api.get<Site[]>(ApiEndpoints.sites);
  }

  getById(id: string): Observable<Site> {
    return this.api.get<Site>(ApiEndpoints.siteById(id));
  }

  create(data: CreateSiteRequest): Observable<Site> {
    return this.api.post<Site>(ApiEndpoints.sites, data);
  }

  update(id: string, data: CreateSiteRequest): Observable<Site> {
    return this.api.put<Site>(ApiEndpoints.siteById(id), data);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(ApiEndpoints.siteById(id));
  }

  assignOperators(siteId: string, operatorIds: string[]): Observable<void> {
    return this.api.post<void>(ApiEndpoints.siteOperators(siteId), { operatorIds });
  }

  removeOperator(siteId: string, operatorId: string): Observable<void> {
    return this.api.delete<void>(ApiEndpoints.siteOperatorById(siteId, operatorId));
  }
}
