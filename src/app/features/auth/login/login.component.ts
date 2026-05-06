import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: [`
    :host { display: block; }

    .login-page {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0d47a1 0%, #1565c0 55%, #1976d2 100%);
      padding: 40px 20px;
    }

    /* ── brand ── */
    .brand-section {
      text-align: center;
      color: #fff;
      margin-bottom: 32px;
    }
    .brand-logo {
      width: 68px; height: 68px;
      background: rgba(255,255,255,.15);
      border: 1.5px solid rgba(255,255,255,.25);
      border-radius: 20px;
      display: flex; align-items: center; justify-content: center;
      margin: 0 auto 20px;
    }
    .brand-title {
      font-size: 36px; font-weight: 800; line-height: 1.15;
      margin: 0 0 8px; letter-spacing: -.5px;
    }
    .brand-desc { font-size: 15px; color: rgba(255,255,255,.65); margin: 0 0 20px; }
    .brand-features {
      display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;
    }
    .brand-feature {
      display: flex; align-items: center; gap: 8px;
      font-size: 13px; color: rgba(255,255,255,.75);
    }
    .brand-feature-icon {
      width: 28px; height: 28px; flex-shrink: 0;
      background: rgba(255,255,255,.12); border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
    }

    /* ── form card ── */
    .form-card {
      width: 100%; max-width: 400px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,.18);
      padding: 36px 32px;
    }
    .form-heading { font-size: 22px; font-weight: 800; color: #1a2b4b; margin: 0 0 4px; }
    .form-sub     { font-size: 14px; color: #78909c; margin: 0 0 28px; }

    .form-label { font-size: 13px; font-weight: 600; color: #37474f; margin-bottom: 6px; }
    .input-icon-wrap { position: relative; }
    .input-icon-wrap .mi {
      position: absolute; left: 13px; top: 50%; transform: translateY(-50%);
      font-size: 18px; color: #90a4ae; pointer-events: none; z-index: 5;
    }
    .input-icon-wrap input { padding-left: 42px !important; }
    .toggle-pw {
      position: absolute; right: 10px; top: 50%; transform: translateY(-50%);
      background: none; border: none; padding: 4px; cursor: pointer; color: #90a4ae; z-index: 5;
    }
    .toggle-pw:hover { color: #37474f; }
    .toggle-pw .mi { pointer-events: none; }

    .btn-login {
      height: 48px; font-size: 15px; font-weight: 700;
      background: linear-gradient(135deg, #1565c0, #1976d2);
      border: none; border-radius: 10px !important;
      box-shadow: 0 4px 14px rgba(21,101,192,.3);
      transition: opacity .15s, transform .1s;
    }
    .btn-login:hover:not(:disabled)  { opacity: .92; transform: translateY(-1px); }
    .btn-login:active:not(:disabled) { transform: translateY(0); }
    .btn-login:disabled { opacity: .7; }

    @media (max-width: 480px) {
      .brand-features { display: none; }
      .form-card { padding: 28px 20px; }
      .brand-title { font-size: 28px; }
    }
  `]
})
export class LoginComponent {
  form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });
  hidePassword = true;
  loading = false;
  error = '';

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {}

  async submit(): Promise<void> {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    try {
      await this.auth.login(this.form.value.username!, this.form.value.password!);
      this.router.navigate([this.auth.isAdmin() ? '/admin' : '/operator/attendance']);
    } catch {
      this.error = 'Credenziali non valide. Riprova.';
    } finally {
      this.loading = false;
    }
  }
}
