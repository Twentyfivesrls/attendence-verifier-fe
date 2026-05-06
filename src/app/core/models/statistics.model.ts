import { Attendance } from './attendance.model';

export interface OperatorStatistics {
  operatorId: string;
  operatorName: string;
  siteId?: string;
  siteName?: string;
  totalDaysWorked: number;
  totalWorkedMinutes: number;
  averageDailyMinutes: number;
  periodStart: string;
  periodEnd: string;
  recentAttendances: Attendance[];
}

export function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
