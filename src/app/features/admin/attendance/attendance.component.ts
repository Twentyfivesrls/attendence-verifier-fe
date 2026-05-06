import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../../core/services/attendance.service';
import { OperatorService } from '../../../core/services/operator.service';
import { SiteService } from '../../../core/services/site.service';
import { Attendance, formatWorkedMinutes } from '../../../core/models/attendance.model';
import { OperatorModel, operatorFullName } from '../../../core/models/operator.model';
import { Site } from '../../../core/models/site.model';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './attendance.component.html',
})
export class AttendanceComponent implements OnInit {
  operators: OperatorModel[] = [];
  sites: Site[] = [];
  records: Attendance[] = [];
  loading = false;
  error = '';

  selectedOperatorId = '';
  selectedSiteId = '';

  readonly formatFn = formatWorkedMinutes;
  readonly nameFn = operatorFullName;

  constructor(
    private attendanceService: AttendanceService,
    private operatorService: OperatorService,
    private siteService: SiteService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.selectedOperatorId = this.route.snapshot.queryParamMap.get('operatorId') ?? '';
    this.selectedSiteId     = this.route.snapshot.queryParamMap.get('siteId') ?? '';

    Promise.all([
      this.operatorService.getAll().toPromise(),
      this.siteService.getAll().toPromise()
    ]).then(([ops, sites]) => {
      this.operators = ops ?? [];
      this.sites = sites ?? [];
      this.load();
    });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    const op = this.selectedOperatorId;
    const site = this.selectedSiteId;

    const req = op && site
      ? this.attendanceService.getByOperatorAndSite(op, site)
      : op ? this.attendanceService.getByOperator(op)
      : site ? this.attendanceService.getBySite(site)
      : this.attendanceService.getAll();

    req.subscribe({
      next: r => { this.records = r; this.loading = false; },
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }

  operatorName(id: string): string {
    const op = this.operators.find(o => o.id === id);
    return op ? operatorFullName(op) : id;
  }

  siteName(id: string): string {
    return this.sites.find(s => s.id === id)?.name ?? id;
  }
}
