export interface Site {
  id: string;
  name: string;
  address: string;
  nfcTagId?: string;
  description?: string;
  active: boolean;
  startDate?: string;
  endDate?: string;
}

export interface CreateSiteRequest {
  name: string;
  address: string;
  nfcTagId?: string;
  description?: string;
}
