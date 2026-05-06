import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { OperatorModel, operatorFullName } from '../../../../core/models/operator.model';
import { SiteService } from '../../../../core/services/site.service';

@Component({
  selector: 'app-assign-operators-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header border-0 pb-0">
      <h5 class="modal-title fw-bold">Assegna operatori</h5>
      <button class="btn-close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="input-group mb-3">
        <span class="input-group-text"><i class="mi mi-sm">search</i></span>
        <input class="form-control" [(ngModel)]="search" placeholder="Cerca per nome, cognome o email…" />
        @if (search) { <button class="btn btn-outline-secondary" (click)="search=''"><i class="mi mi-sm">close</i></button> }
      </div>
      <div style="max-height:340px;overflow-y:auto">
        @for (op of filtered; track op.id) {
          <div class="d-flex align-items-center gap-3 p-2 rounded row-clickable" (click)="toggle(op.id)">
            <input type="checkbox" class="form-check-input mt-0" [checked]="sel.has(op.id)" (click)="$event.stopPropagation()" (change)="toggle(op.id)" />
            <div>
              <div class="fw-semibold small">{{ fn(op) }}</div>
              <div class="text-secondary" style="font-size:12px">{{ op.email }}</div>
            </div>
          </div>
        }
        @if (filtered.length === 0) { <p class="text-center text-secondary py-4 mb-0">Nessun operatore trovato</p> }
      </div>
    </div>
    <div class="modal-footer border-0 pt-0">
      <button class="btn btn-outline-secondary btn-sm" (click)="modal.dismiss()">Annulla</button>
      <button class="btn btn-primary btn-sm" (click)="save()" [disabled]="saving">
        @if (saving) { <span class="spinner-border spinner-border-sm me-1"></span> } Salva
      </button>
    </div>
  `
})
export class AssignOperatorsDialogComponent {
  @Input() siteId = '';
  @Input() allOperators: OperatorModel[] = [];
  @Input() set selected(s: Set<string>) { this.sel = new Set(s); }
  sel = new Set<string>();
  search = ''; saving = false;
  readonly fn = operatorFullName;
  constructor(public modal: NgbActiveModal, private siteService: SiteService) {}
  get filtered() {
    if (!this.search.trim()) return this.allOperators;
    const q = this.search.toLowerCase();
    return this.allOperators.filter(o => o.firstName.toLowerCase().includes(q) || o.lastName.toLowerCase().includes(q) || o.email.toLowerCase().includes(q));
  }
  toggle(id: string) { this.sel.has(id) ? this.sel.delete(id) : this.sel.add(id); this.sel = new Set(this.sel); }
  async save() {
    this.saving = true;
    const orig = new Set(this.allOperators.filter(o => o.assignedSiteIds.includes(this.siteId)).map(o => o.id));
    const added = [...this.sel].filter(id => !orig.has(id));
    const removed = [...orig].filter(id => !this.sel.has(id));
    try {
      if (added.length) await this.siteService.assignOperators(this.siteId, added).toPromise();
      for (const id of removed) await this.siteService.removeOperator(this.siteId, id).toPromise();
      this.modal.close(true);
    } catch { this.saving = false; }
  }
}
