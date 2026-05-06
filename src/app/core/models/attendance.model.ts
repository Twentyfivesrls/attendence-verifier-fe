export type AttendanceStatus = 'ENTERED' | 'EXITED';

export interface Attendance {
  id: string;
  operatorId: string;
  operatorName?: string;
  siteId: string;
  siteName?: string;
  entryTime: string;
  exitTime?: string;
  status: AttendanceStatus;
  workedMinutes?: number;
}

export function formatWorkedMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}
