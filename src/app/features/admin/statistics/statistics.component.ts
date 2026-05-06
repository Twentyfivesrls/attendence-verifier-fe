import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { StatisticsService } from '../../../core/services/statistics.service';
import { SiteService } from '../../../core/services/site.service';
import { OperatorStatistics, formatMinutes } from '../../../core/models/statistics.model';
import { Attendance, formatWorkedMinutes } from '../../../core/models/attendance.model';
import { Site } from '../../../core/models/site.model';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './statistics.component.html',
})
export class StatisticsComponent implements OnInit {
  operatorId = '';
  sites: Site[] = [];
  stats?: OperatorStatistics;
  loading = false;
  error = '';

  filterSiteId = '';
  filterFrom = '';
  filterTo = '';

  readonly fmtMin = formatMinutes;
  readonly fmtWorked = formatWorkedMinutes;

  constructor(
    private route: ActivatedRoute,
    private statisticsService: StatisticsService,
    private siteService: SiteService
  ) {}

  ngOnInit(): void {
    this.operatorId = this.route.snapshot.paramMap.get('operatorId')!;
    this.siteService.getAll().subscribe(s => { this.sites = s; this.load(); });
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.statisticsService.getByOperator(this.operatorId, {
      siteId: this.filterSiteId || undefined,
      from: this.filterFrom || undefined,
      to: this.filterTo || undefined,
    }).subscribe({
      next: s => { this.stats = s; this.loading = false; },
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }

  trackAttendance(_: number, a: Attendance) { return a.id; }
}
