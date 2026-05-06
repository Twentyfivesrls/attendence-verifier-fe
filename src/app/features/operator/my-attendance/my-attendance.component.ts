import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../../core/services/attendance.service';
import { Attendance, formatWorkedMinutes } from '../../../core/models/attendance.model';

@Component({
  selector: 'app-my-attendance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-attendance.component.html',
})
export class MyAttendanceComponent implements OnInit {
  records: Attendance[] = [];
  loading = true;
  error = '';
  readonly fmt = formatWorkedMinutes;

  constructor(private attendanceService: AttendanceService) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.error = '';
    this.attendanceService.getMy().subscribe({
      next: r => { this.records = r; this.loading = false; },
      error: () => { this.error = 'Errore nel caricamento'; this.loading = false; }
    });
  }
}
