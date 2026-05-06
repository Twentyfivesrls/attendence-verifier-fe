import { environment } from '../../../environments/environment';

export const API_BASE_URL = environment.apiUrl;

export const ApiEndpoints = {
  authLogin:    '/api/auth/login',
  authRefresh:  '/api/auth/refresh',

  attendance: '/api/attendance',
  myAttendance: '/api/attendance/my',
  attendanceByOperator: (id: string) => `/api/attendance/operator/${id}`,
  attendanceBySite: (id: string) => `/api/attendance/site/${id}`,
  attendanceByOperatorAndSite: (opId: string, siteId: string) =>
    `/api/attendance/operator/${opId}/site/${siteId}`,

  sites: '/api/sites',
  siteById: (id: string) => `/api/sites/${id}`,
  siteOperators: (id: string) => `/api/sites/${id}/operators`,
  siteOperatorById: (siteId: string, opId: string) => `/api/sites/${siteId}/operators/${opId}`,

  operators: '/api/operators',
  operatorMe: '/api/operators/me',
  operatorById: (id: string) => `/api/operators/${id}`,

  documents: '/api/documents',
  documentsByOperator: (id: string) => `/api/documents/operator/${id}`,
  documentDownload: (id: string) => `/api/documents/${id}/download`,
  documentById: (id: string) => `/api/documents/${id}`,

  statisticsByOperator: (id: string) => `/api/statistics/operator/${id}`,
};
