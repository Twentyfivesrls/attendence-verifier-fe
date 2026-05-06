import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OperatorService } from '../../../core/services/operator.service';
import { DocumentService } from '../../../core/services/document.service';
import { OperatorModel, operatorFullName } from '../../../core/models/operator.model';
import { DocumentModel } from '../../../core/models/document.model';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.component.html',
})
export class DocumentsComponent implements OnInit {
  operators: OperatorModel[] = [];
  documents: DocumentModel[] = [];
  selectedOperatorId = '';
  loadingDocs = false;
  readonly nameFn = operatorFullName;

  constructor(
    private operatorService: OperatorService,
    private documentService: DocumentService,
    private modal: NgbModal,
    private toast: ToastService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const preselect = this.route.snapshot.queryParamMap.get('operatorId') ?? '';
    this.operatorService.getAll().subscribe(ops => {
      this.operators = ops;
      if (preselect) { this.selectedOperatorId = preselect; this.loadDocuments(); }
    });
  }

  loadDocuments(): void {
    if (!this.selectedOperatorId) return;
    this.loadingDocs = true;
    this.documentService.getByOperator(this.selectedOperatorId).subscribe({
      next: docs => { this.documents = docs; this.loadingDocs = false; },
      error: () => { this.toast.show('Errore nel caricamento', 'danger'); this.loadingDocs = false; }
    });
  }

  triggerUpload(): void {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      const file = input.files?.[0];
      if (file) this.showUploadDialog(file);
    };
    input.click();
  }

  private showUploadDialog(file: File): void {
    const description = window.prompt(`File: ${file.name}\n\nDescrizione (opzionale):`);
    if (description === null) return;

    const fd = new FormData();
    fd.append('operatorId', this.selectedOperatorId);
    fd.append('file', file, file.name);
    if (description.trim()) fd.append('description', description.trim());

    this.documentService.upload(fd).subscribe({
      next: () => { this.toast.show('Documento caricato'); this.loadDocuments(); },
      error: () => this.toast.show('Errore durante il caricamento', 'danger')
    });
  }

  download(doc: DocumentModel): void {
    this.documentService.download(doc.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.fileName;
      a.click();
      URL.revokeObjectURL(url);
    });
  }

  confirmDelete(doc: DocumentModel): void {
    const ref = this.modal.open(ConfirmDialogComponent, { centered: true });
    ref.componentInstance.title = 'Elimina documento';
    ref.componentInstance.message = `Eliminare "${doc.fileName}"?`;
    ref.componentInstance.confirmLabel = 'Elimina';
    ref.result.then(ok => {
      if (!ok) return;
      this.documentService.delete(doc.id).subscribe({
        next: () => { this.toast.show('Documento eliminato'); this.loadDocuments(); },
        error: () => this.toast.show('Errore durante l\'eliminazione', 'danger')
      });
    }).catch(() => {});
  }
}
