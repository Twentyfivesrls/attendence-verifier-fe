import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { SiteService } from '../../../../core/services/site.service';
import { Site } from '../../../../core/models/site.model';

@Component({
  selector: 'app-sites-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sites-list.component.html'
})
export class SitesListComponent implements OnInit {
  sites: Site[] = [];
  loading = true;
  error = '';
  constructor(private siteService: SiteService, private router: Router) {}
  ngOnInit() { this.load(); }
  load() {
    this.loading = true; this.error = '';
    this.siteService.getAll().subscribe({
      next: s => { this.sites = s; this.loading = false; },
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }
}
