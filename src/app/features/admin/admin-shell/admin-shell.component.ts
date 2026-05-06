import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ToastService, Toast } from '../../../core/services/toast.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss']
})
export class AdminShellComponent {
  isMobile = window.innerWidth < 768;
  sidebarOpen = !this.isMobile;

  navItems = [
    { icon: 'dashboard',    label: 'Dashboard',  route: '/admin/dashboard' },
    { icon: 'construction', label: 'Cantieri',   route: '/admin/sites' },
    { icon: 'people',       label: 'Operatori',  route: '/admin/operators' },
    { icon: 'access_time',  label: 'Presenze',   route: '/admin/attendance' },
    { icon: 'folder',       label: 'Documenti',  route: '/admin/documents' },
  ];

  toasts$;

  constructor(public auth: AuthService, private modal: NgbModal, public toast: ToastService) {
    this.toasts$ = toast.toasts$;
  }

  @HostListener('window:resize')
  onResize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) this.sidebarOpen = true;
  }

  async confirmLogout(): Promise<void> {
    const ref = this.modal.open(ConfirmDialogComponent, { centered: true, size: 'sm' });
    ref.componentInstance.title = 'Disconnessione';
    ref.componentInstance.message = 'Sei sicuro di voler uscire?';
    ref.componentInstance.confirmLabel = 'Esci';
    const result = await ref.result.catch(() => false);
    if (result) this.auth.logout();
  }

  trackToast(_: number, t: Toast) { return t.id; }
}
