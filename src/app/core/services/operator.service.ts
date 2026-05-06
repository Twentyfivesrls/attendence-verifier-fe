import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../constants/api.constants';
import { OperatorModel, CreateOperatorRequest, UpdateOperatorRequest } from '../models/operator.model';

@Injectable({ providedIn: 'root' })
export class OperatorService {
  constructor(private api: ApiService) {}

  getAll(): Observable<OperatorModel[]> {
    return this.api.get<OperatorModel[]>(ApiEndpoints.operators);
  }

  getById(id: string): Observable<OperatorModel> {
    return this.api.get<OperatorModel>(ApiEndpoints.operatorById(id));
  }

  getMe(): Observable<OperatorModel> {
    return this.api.get<OperatorModel>(ApiEndpoints.operatorMe);
  }

  create(data: CreateOperatorRequest): Observable<OperatorModel> {
    return this.api.post<OperatorModel>(ApiEndpoints.operators, data);
  }

  update(id: string, data: UpdateOperatorRequest): Observable<OperatorModel> {
    return this.api.put<OperatorModel>(ApiEndpoints.operatorById(id), data);
  }

  deactivate(id: string): Observable<void> {
    return this.api.delete<void>(ApiEndpoints.operatorById(id));
  }
}
