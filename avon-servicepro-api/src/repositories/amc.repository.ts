import { GenericCrudRepository } from './base.repository';

export interface AmcContract {
  id: string;
  contractNumber: string;
  customerId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  pmInterval: '3 Months' | '6 Months' | '1 Year';
  status: 'Active' | 'Expired' | 'Pending';
  price: number;
  slaTier?: 'Platinum' | 'Gold' | 'Silver' | 'None';
  amcType?: 'Comprehensive' | 'Labor Only' | 'Spare Parts Included' | 'Standard';
  coveredAssetIds?: string[];
  escalationRate?: number;
  uptimeGuarantee?: number;
  responseTimeHours?: number;
  lastRenewedDate?: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export class AmcRepository extends GenericCrudRepository<AmcContract> {
  constructor() {
    super(
      'amc_contracts',
      [
        'id',
        'contractNumber',
        'customerId',
        'customerName',
        'startDate',
        'endDate',
        'pmInterval',
        'status',
        'price',
        'slaTier',
        'amcType',
        'coveredAssetIds',
        'escalationRate',
        'uptimeGuarantee',
        'responseTimeHours',
        'lastRenewedDate',
        'notes',
        'createdAt',
        'updatedAt'
      ],
      ['coveredAssetIds']
    );
  }

  /**
   * Fetch active contracts for a specific customer.
   */
  async findByCustomerId(customerId: string): Promise<AmcContract[]> {
    const sql = `SELECT * FROM amc_contracts WHERE customerId = ?`;
    const rows = await this.query(sql, [customerId]);
    return rows.map((row: any) => this.deserialize(row));
  }

  /**
   * Helper query executor method (exposes dbPool query in repository context).
   */
  private async query(sql: string, params: any[] = []): Promise<any[]> {
    const { dbPool } = await import('../config/database');
    return dbPool.query(sql, params) as Promise<any[]>;
  }
}

export const amcRepository = new AmcRepository();
