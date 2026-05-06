import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-operator-shell',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="op-header">
      <div class="d-flex align-items-center gap-2">
        <div class="brand-icon"><i class="mi" style="font-size:18px;color:#fff">badge</i></div>
        <span style="color:#fff;font-size:15px;font-weight:700">Attendance Verifier</span>
      </div>
      <div class="d-flex align-items-center gap-2">
        <div class="user-avatar">{{ (auth.getUsername() || 'O')[0].toUpperCase() }}</div>
        <span style="font-size:13px;color:rgba(255,255,255,.8)">{{ auth.getUsername() }}</span>
        <button class="btn btn-link p-0" style="color:rgba(255,255,255,.7)" (click)="confirmLogout()" title="Esci">
          <i class="mi mi-sm">logout</i>
        </button>
      </div>
    </div>

    <nav class="op-nav">
      <a class="op-nav-link" routerLink="/operator/attendance" routerLinkActive="active">
        <i class="mi mi-sm me-1">access_time</i> Le mie Presenze
      </a>
      <a class="op-nav-link" routerLink="/operator/documents" routerLinkActive="active">
        <i class="mi mi-sm me-1">folder</i> I miei Documenti
      </a>
    </nav>

    <div class="op-content">
      <router-outlet />
    </div>
  `,
  styles: [`
    .op-header {
      display: flex; align-items: center; justify-content: space-between;
      background: linear-gradient(90deg, #0d47a1, #1565c0);
      padding: 12px 20px; position: sticky; top: 0; z-index: 10;
    }
    .brand-icon {
      width: 32px; height: 32px; background: rgba(255,255,255,.2);
      border-radius: 8px; display: flex; align-items: center; justify-content: center;
    }
    .user-avatar {
      width: 30px; height: 30px; border-radius: 50%; background: rgba(255,255,255,.2);
      color: #fff; font-size: 13px; font-weight: 700;
      display: flex; align-items: center; justify-content: center;
    }
    .op-nav {
      background: #fff; border-bottom: 1px solid #e0e0e0;
      display: flex; gap: 0; padding: 0 16px;
    }
    .op-nav-link {
      display: flex; align-items: center; padding: 14px 16px;
      font-size: 14px; font-weight: 600; color: #78909c;
      text-decoration: none; border-bottom: 3px solid transparent;
      transition: color .15s, border-color .15s;
    }
    .op-nav-link.active, .op-nav-link:hover { color: #1565c0; border-bottom-color: #1565c0; }
    .op-content { padding: 28px; background: #f5f7fa; min-height: calc(100vh - 108px); }
  `]
})
export class OperatorShellComponent {
  constructor(public auth: AuthService, private modal: NgbModal) {}

  confirmLogout(): void {
    const ref = this.modal.open(ConfirmDialogComponent, { centered: true });
    ref.componentInstance.title = 'Disconnessione';
    ref.componentInstance.message = 'Sei sicuro di voler uscire?';
    ref.componentInstance.confirmLabel = 'Esci';
    ref.result.then(ok => { if (ok) this.auth.logout(); }).catch(() => {});
  }
}
