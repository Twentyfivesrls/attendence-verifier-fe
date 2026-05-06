import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OperatorService } from '../../../../core/services/operator.service';
import { SiteService } from '../../../../core/services/site.service';
import { OperatorModel, operatorFullName } from '../../../../core/models/operator.model';
import { Site } from '../../../../core/models/site.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AssignSitesDialogComponent } from '../assign-sites-dialog/assign-sites-dialog.component';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-operator-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operator-detail.component.html',
})
export class OperatorDetailComponent implements OnInit {
  operator?: OperatorModel;
  allSites: Site[] = [];
  loading = true;
  operatorId = '';
  readonly fn = operatorFullName;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private operatorService: OperatorService,
    private siteService: SiteService,
    private modal: NgbModal,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.operatorId = this.route.snapshot.paramMap.get('id')!;
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    Promise.all([
      this.operatorService.getById(this.operatorId).toPromise(),
      this.siteService.getAll().toPromise()
    ]).then(([op, sites]) => {
      this.operator = op;
      this.allSites = sites ?? [];
      this.loading = false;
    }).catch(() => {
      this.toast.show('Errore nel caricamento', 'danger');
      this.loading = false;
    });
  }

  get assignedSites(): Site[] {
    return this.allSites.filter(s => this.operator?.assignedSiteIds.includes(s.id));
  }

  openAssignDialog(): void {
    const ref = this.modal.open(AssignSitesDialogComponent, { centered: true, size: 'md' });
    ref.componentInstance.operatorId = this.operatorId;
    ref.componentInstance.allSites = this.allSites;
    ref.componentInstance.selected = new Set(this.operator?.assignedSiteIds ?? []);
    ref.result.then(changed => { if (changed) this.loadData(); }).catch(() => {});
  }

  removeSite(siteId: string): void {
    this.siteService.removeOperator(siteId, this.operatorId).subscribe({
      next: () => this.loadData(),
      error: () => this.toast.show('Errore durante la rimozione', 'danger')
    });
  }

  confirmDeactivate(): void {
    const ref = this.modal.open(ConfirmDialogComponent, { centered: true });
    ref.componentInstance.title = 'Disattiva operatore';
    ref.componentInstance.message = 'L\'operatore non potrà più accedere all\'applicazione.';
    ref.componentInstance.confirmLabel = 'Disattiva';
    ref.result.then(ok => {
      if (!ok) return;
      this.operatorService.deactivate(this.operatorId).subscribe({
        next: () => { this.toast.show('Operatore disattivato'); this.router.navigate(['/admin/operators']); },
        error: () => this.toast.show('Errore durante la disattivazione', 'danger')
      });
    }).catch(() => {});
  }
}
