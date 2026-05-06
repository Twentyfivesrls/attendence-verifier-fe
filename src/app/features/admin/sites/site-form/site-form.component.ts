import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { SiteService } from '../../../../core/services/site.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-site-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './site-form.component.html'
})
export class SiteFormComponent implements OnInit {
  isEdit = false; siteId?: string; loading = false; saving = false;
  form = this.fb.group({ name: ['', Validators.required], address: ['', Validators.required], nfcTagId: [''], description: [''] });
  constructor(private fb: FormBuilder, private siteService: SiteService, private route: ActivatedRoute, private router: Router, private toast: ToastService) {}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.isEdit = !!id && this.route.snapshot.url.some(s => s.path === 'edit');
    if (this.isEdit && id) {
      this.siteId = id; this.loading = true;
      this.siteService.getById(id).subscribe({ next: s => { this.form.patchValue(s); this.loading = false; }, error: () => { this.toast.show('Errore nel caricamento', 'danger'); this.loading = false; } });
    }
  }
  save() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const d = { name: this.form.value.name!, address: this.form.value.address!, nfcTagId: this.form.value.nfcTagId || undefined, description: this.form.value.description || undefined };
    const req = this.isEdit ? this.siteService.update(this.siteId!, d) : this.siteService.create(d);
    req.subscribe({ next: s => { this.toast.show(this.isEdit ? 'Cantiere aggiornato' : 'Cantiere creato'); this.router.navigate(['/admin/sites', s.id]); }, error: () => { this.toast.show('Errore durante il salvataggio', 'danger'); this.saving = false; } });
  }
  back() { this.router.navigate([this.isEdit ? `/admin/sites/${this.siteId}` : '/admin/sites']); }
}
