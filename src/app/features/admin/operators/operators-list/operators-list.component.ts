import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OperatorService } from '../../../../core/services/operator.service';
import { OperatorModel, operatorFullName } from '../../../../core/models/operator.model';

@Component({
  selector: 'app-operators-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './operators-list.component.html',
})
export class OperatorsListComponent implements OnInit {
  operators: OperatorModel[] = [];
  loading = true;
  error = '';
  readonly fn = operatorFullName;

  constructor(private operatorService: OperatorService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.operatorService.getAll().subscribe({
      next: ops => { this.operators = ops; this.loading = false; },
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }
}
