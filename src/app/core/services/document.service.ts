import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../constants/api.constants';
import { DocumentModel } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  constructor(private api: ApiService) {}

  getByOperator(operatorId: string): Observable<DocumentModel[]> {
    return this.api.get<DocumentModel[]>(ApiEndpoints.documentsByOperator(operatorId));
  }

  upload(formData: FormData): Observable<DocumentModel> {
    return this.api.postMultipart<DocumentModel>(ApiEndpoints.documents, formData);
  }

  delete(id: string): Observable<void> {
    return this.api.delete<void>(ApiEndpoints.documentById(id));
  }

  download(id: string): Observable<Blob> {
    return this.api.getBlob(ApiEndpoints.documentDownload(id));
  }
}
