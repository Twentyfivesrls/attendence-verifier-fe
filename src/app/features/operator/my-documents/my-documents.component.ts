import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorService } from '../../../core/services/operator.service';
import { DocumentService } from '../../../core/services/document.service';
import { DocumentModel } from '../../../core/models/document.model';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-my-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-documents.component.html',
})
export class MyDocumentsComponent implements OnInit {
  documents: DocumentModel[] = [];
  loading = true;
  error = '';

  constructor(
    private operatorService: OperatorService,
    private documentService: DocumentService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.operatorService.getMe().subscribe({
      next: me => this.loadDocs(me.id),
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }

  private loadDocs(operatorId: string): void {
    this.documentService.getByOperator(operatorId).subscribe({
      next: docs => { this.documents = docs; this.loading = false; },
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }

  download(doc: DocumentModel): void {
    this.documentService.download(doc.id).subscribe({
      next: blob => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.fileName;
        a.click();
        URL.revokeObjectURL(url);
      },
      error: () => this.toast.show('Errore durante il download', 'danger')
    });
  }
}
