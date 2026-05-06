import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Site } from '../../../../core/models/site.model';
import { SiteService } from '../../../../core/services/site.service';

@Component({
  selector: 'app-assign-sites-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title fw-bold">Assegna cantieri</h5>
      <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="input-group mb-3">
        <span class="input-group-text"><i class="mi mi-sm">search</i></span>
        <input class="form-control" [(ngModel)]="search" placeholder="Cerca per nome o indirizzo…" autocomplete="off" />
        @if (search) {
          <button class="btn btn-outline-secondary" type="button" (click)="search = ''">
            <i class="mi mi-sm">close</i>
          </button>
        }
      </div>
      <div style="max-height:360px;overflow-y:auto">
        @for (site of filtered; track site.id) {
          <div class="d-flex align-items-center gap-3 px-2 py-2 rounded"
               style="cursor:pointer"
               [style.background]="sel.has(site.id) ? '#e3f2fd' : ''"
               (click)="toggle(site.id)">
            <input class="form-check-input mt-0 flex-shrink-0" type="checkbox"
                   [checked]="sel.has(site.id)" (click)="$event.stopPropagation()" readonly />
            <div>
              <div class="fw-semibold small">{{ site.name }}</div>
              <div class="text-secondary" style="font-size:12px">{{ site.address }}</div>
            </div>
          </div>
        }
        @if (filtered.length === 0) {
          <p class="text-center text-secondary py-4 mb-0">Nessun cantiere trovato</p>
        }
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline-secondary" (click)="modal.dismiss()">Annulla</button>
      <button class="btn btn-primary" (click)="save()" [disabled]="saving">
        @if (saving) { <span class="spinner-border spinner-border-sm me-2"></span> }
        Salva
      </button>
    </div>
  `
})
export class AssignSitesDialogComponent {
  @Input() operatorId = '';
  @Input() allSites: Site[] = [];

  private _originalSel = new Set<string>();
  sel = new Set<string>();

  @Input() set selected(s: Set<string>) {
    this._originalSel = new Set(s);
    this.sel = new Set(s);
  }

  search = '';
  saving = false;

  constructor(public modal: NgbActiveModal, private siteService: SiteService) {}

  get filtered(): Site[] {
    if (!this.search.trim()) return this.allSites;
    const q = this.search.toLowerCase();
    return this.allSites.filter(s =>
      s.name.toLowerCase().includes(q) || s.address.toLowerCase().includes(q)
    );
  }

  toggle(id: string): void {
    this.sel.has(id) ? this.sel.delete(id) : this.sel.add(id);
    this.sel = new Set(this.sel);
  }

  async save(): Promise<void> {
    this.saving = true;
    const added   = [...this.sel].filter(id => !this._originalSel.has(id));
    const removed = [...this._originalSel].filter(id => !this.sel.has(id));
    try {
      for (const siteId of added) {
        await this.siteService.assignOperators(siteId, [this.operatorId]).toPromise();
      }
      for (const siteId of removed) {
        await this.siteService.removeOperator(siteId, this.operatorId).toPromise();
      }
      this.modal.close(true);
    } catch {
      this.saving = false;
    }
  }
}
