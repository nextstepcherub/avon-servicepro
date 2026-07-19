export interface AmcContract {
  id?: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  pmInterval: string;
  status: string;
  price: number;
  slaTier: string;
  amcType: string;
  coveredAssetIds?: string[];
  escalationRate?: number;
  uptimeGuarantee?: number;
  responseTimeHours?: number;
  notes?: string;
  lastRenewedDate?: string;
}

export class AmcRepository {}

export const amcRepository = new AmcRepository();
