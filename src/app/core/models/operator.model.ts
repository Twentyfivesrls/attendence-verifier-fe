export interface OperatorModel {
  id: string;
  keycloakId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  fiscalCode?: string;
  assignedSiteIds: string[];
  hireDate?: string;
  active: boolean;
}

export function operatorFullName(op: OperatorModel): string {
  return `${op.firstName} ${op.lastName}`;
}

export interface CreateOperatorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  fiscalCode?: string;
}

export interface UpdateOperatorRequest {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phone?: string;
  fiscalCode?: string;
}
