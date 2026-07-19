import { dbPool } from '../config/database';

export class ServiceRequestRepository {
  async findBySerialNumber(serialNumber: string): Promise<any[]> {
    const rows = await dbPool.query('SELECT * FROM service_requests WHERE serialNumber = ?', [serialNumber]);
    return rows || [];
  }
}

export const serviceRequestRepository = new ServiceRequestRepository();
export default serviceRequestRepository;
