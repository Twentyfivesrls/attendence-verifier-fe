import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiEndpoints } from '../constants/api.constants';
import { Attendance } from '../models/attendance.model';

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  constructor(private api: ApiService) {}

  getAll(): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(ApiEndpoints.attendance);
  }

  getMy(): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(ApiEndpoints.myAttendance);
  }

  getByOperator(operatorId: string): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(ApiEndpoints.attendanceByOperator(operatorId));
  }

  getBySite(siteId: string): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(ApiEndpoints.attendanceBySite(siteId));
  }

  getByOperatorAndSite(operatorId: string, siteId: string): Observable<Attendance[]> {
    return this.api.get<Attendance[]>(ApiEndpoints.attendanceByOperatorAndSite(operatorId, siteId));
  }
}
