import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    <div class="modal-header border-0 pb-0">
      <h5 class="modal-title fw-bold">{{ title }}</h5>
      <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body pt-2 pb-3">
      <p class="mb-0 text-secondary">{{ message }}</p>
    </div>
    <div class="modal-footer border-0 pt-0">
      <button class="btn btn-outline-secondary btn-sm" (click)="modal.close(false)">
        {{ cancelLabel }}
      </button>
      <button class="btn btn-primary btn-sm" (click)="modal.close(true)">
        {{ confirmLabel }}
      </button>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() confirmLabel = 'Conferma';
  @Input() cancelLabel  = 'Annulla';
  constructor(public modal: NgbActiveModal) {}
}
