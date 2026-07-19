import { dbPool } from '../config/database';

export class JobRepository {
  async findAll(options: any = {}): Promise<any> {
    const rows = await dbPool.query('SELECT * FROM service_jobs');
    return {
      data: rows || [],
      total: rows ? rows.length : 0
    };
  }

  async findById(id: string): Promise<any> {
    const rows = await dbPool.query('SELECT * FROM service_jobs WHERE id = ?', [id]);
    return rows && rows.length > 0 ? rows[0] : null;
  }
}

export const jobRepository = new JobRepository();
