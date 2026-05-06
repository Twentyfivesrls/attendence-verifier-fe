import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../constants/api.constants';
import { OperatorStatistics } from '../models/statistics.model';

@Injectable({ providedIn: 'root' })
export class StatisticsService {
  constructor(private api: ApiService) {}

  getByOperator(
    operatorId: string,
    params: { siteId?: string; from?: string; to?: string } = {}
  ): Observable<OperatorStatistics> {
    const q: Record<string, string> = {};
    if (params.siteId) q['siteId'] = params.siteId;
    if (params.from) q['from'] = params.from;
    if (params.to) q['to'] = params.to;
    return this.api.get<OperatorStatistics>(ApiEndpoints.statisticsByOperator(operatorId), q);
  }
}
