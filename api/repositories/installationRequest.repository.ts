import { dbPool } from '../config/database';

export class InstallationRequestRepository {
  async findBySerialNumber(serialNumber: string): Promise<any> {
    const rows = await dbPool.query('SELECT * FROM installation_requests WHERE serialNumber = ?', [serialNumber]);
    return rows && rows.length > 0 ? rows[0] : null;
  }
}

export const installationRequestRepository = new InstallationRequestRepository();
