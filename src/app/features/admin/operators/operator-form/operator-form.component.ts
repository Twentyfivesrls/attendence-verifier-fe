import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OperatorService } from '../../../../core/services/operator.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-operator-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './operator-form.component.html',
})
export class OperatorFormComponent implements OnInit {
  isEdit = false;
  operatorId?: string;
  loading = false;
  saving = false;
  hidePassword = true;

  form = this.fb.group({
    firstName:  ['', Validators.required],
    lastName:   ['', Validators.required],
    email:      ['', [Validators.required, Validators.email]],
    password:   [''],
    phone:      [''],
    fiscalCode: [''],
  });

  constructor(
    private fb: FormBuilder,
    private operatorService: OperatorService,
    private route: ActivatedRoute,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id && this.route.snapshot.url.some(s => s.path === 'edit');
    if (this.isEdit && id) {
      this.operatorId = id;
      this.loading = true;
      this.operatorService.getById(id).subscribe({
        next: op => { this.form.patchValue(op); this.loading = false; },
        error: () => { this.toast.show('Errore nel caricamento', 'danger'); this.loading = false; }
      });
    } else {
      this.form.get('password')!.addValidators(Validators.required);
      this.form.get('password')!.updateValueAndValidity();
    }
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.form.value;

    const req = this.isEdit
      ? this.operatorService.update(this.operatorId!, {
          firstName: v.firstName!,
          lastName: v.lastName!,
          email: v.email!,
          password: v.password || undefined,
          phone: v.phone || undefined,
          fiscalCode: v.fiscalCode || undefined,
        })
      : this.operatorService.create({
          firstName: v.firstName!,
          lastName: v.lastName!,
          email: v.email!,
          password: v.password!,
          phone: v.phone || undefined,
          fiscalCode: v.fiscalCode || undefined,
        });

    req.subscribe({
      next: op => {
        this.toast.show(this.isEdit ? 'Operatore aggiornato' : 'Operatore creato');
        this.router.navigate(['/admin/operators', op.id]);
      },
      error: () => { this.toast.show('Errore durante il salvataggio', 'danger'); this.saving = false; }
    });
  }

  back(): void {
    this.router.navigate([this.isEdit ? `/admin/operators/${this.operatorId}` : '/admin/operators']);
  }
}
