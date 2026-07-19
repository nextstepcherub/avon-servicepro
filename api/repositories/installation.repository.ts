import { dbPool } from '../config/database';

export class InstallationRepository {
  async findBySerialNumber(serialNumber: string): Promise<any> {
    const rows = await dbPool.query('SELECT * FROM installations WHERE serialNumber = ?', [serialNumber]);
    return rows && rows.length > 0 ? rows[0] : null;
  }
}

export const installationRepository = new InstallationRepository();
