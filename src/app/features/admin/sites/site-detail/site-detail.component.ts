import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SiteService } from '../../../../core/services/site.service';
import { OperatorService } from '../../../../core/services/operator.service';
import { Site } from '../../../../core/models/site.model';
import { OperatorModel, operatorFullName } from '../../../../core/models/operator.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AssignOperatorsDialogComponent } from '../assign-operators-dialog/assign-operators-dialog.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-site-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './site-detail.component.html'
})
export class SiteDetailComponent implements OnInit {
  site?: Site; allOperators: OperatorModel[] = []; loading = true; siteId = '';
  readonly fn = operatorFullName;
  constructor(private route: ActivatedRoute, private router: Router, private siteService: SiteService, private operatorService: OperatorService, private modal: NgbModal, private toast: ToastService) {}
  ngOnInit() { this.siteId = this.route.snapshot.paramMap.get('id')!; this.loadData(); }
  loadData() {
    this.loading = true;
    Promise.all([this.siteService.getById(this.siteId).toPromise(), this.operatorService.getAll().toPromise()])
      .then(([s, ops]) => { this.site = s; this.allOperators = ops ?? []; this.loading = false; })
      .catch(() => { this.toast.show('Errore nel caricamento', 'danger'); this.loading = false; });
  }
  get assignedOperators() { return this.allOperators.filter(o => o.assignedSiteIds.includes(this.siteId)); }
  openAssignDialog() {
    const ref = this.modal.open(AssignOperatorsDialogComponent, { centered: true, size: 'md' });
    ref.componentInstance.siteId = this.siteId;
    ref.componentInstance.allOperators = this.allOperators;
    ref.componentInstance.selected = new Set(this.assignedOperators.map(o => o.id));
    ref.result.then(changed => { if (changed) this.loadData(); }, () => {});
  }
  removeOperator(id: string) { this.siteService.removeOperator(this.siteId, id).subscribe({ next: () => this.loadData(), error: () => this.toast.show('Errore rimozione', 'danger') }); }
  async confirmDelete() {
    const ref = this.modal.open(ConfirmDialogComponent, { centered: true, size: 'sm' });
    ref.componentInstance.title = 'Elimina cantiere';
    ref.componentInstance.message = 'Sei sicuro di voler eliminare questo cantiere?';
    ref.componentInstance.confirmLabel = 'Elimina';
    const ok = await ref.result.catch(() => false);
    if (!ok) return;
    this.siteService.delete(this.siteId).subscribe({ next: () => { this.toast.show('Cantiere eliminato'); this.router.navigate(['/admin/sites']); }, error: () => this.toast.show('Errore eliminazione', 'danger') });
  }
}
