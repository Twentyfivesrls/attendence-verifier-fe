import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styles: [`
    .dash-card { cursor: pointer; transition: transform .2s, box-shadow .2s; border-radius: 16px !important; }
    .dash-card:hover { transform: translateY(-4px); box-shadow: 0 12px 28px rgba(0,0,0,.13) !important; }
    .icon-wrap { width: 54px; height: 54px; border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
    .icon-wrap i { font-size: 28px; color: #fff; }
    .card-title { font-size: 17px; font-weight: 700; color: #37474f; margin: 0 0 6px; }
    .card-desc  { font-size: 13px; color: #78909c; margin: 0; line-height: 1.5; }
    .card-arrow { text-align: right; margin-top: 16px; color: #b0bec5; }
  `]
})
export class DashboardComponent {
  cards = [
    { icon: 'construction', label: 'Cantieri',   desc: 'Gestisci i cantieri e i tag NFC',             route: '/admin/sites',       bg: 'linear-gradient(135deg,#1565c0,#1976d2)' },
    { icon: 'people',       label: 'Operatori',  desc: 'Gestisci gli operatori e le assegnazioni',    route: '/admin/operators',   bg: 'linear-gradient(135deg,#2e7d32,#43a047)' },
    { icon: 'access_time',  label: 'Presenze',   desc: 'Monitora gli ingressi e le uscite',           route: '/admin/attendance',  bg: 'linear-gradient(135deg,#e65100,#f57c00)' },
    { icon: 'folder_open',  label: 'Documenti',  desc: 'Archivia i documenti degli operatori',        route: '/admin/documents',   bg: 'linear-gradient(135deg,#6a1b9a,#8e24aa)' },
  ];
  constructor(private router: Router) {}
  go(r: string) { this.router.navigate([r]); }
}
