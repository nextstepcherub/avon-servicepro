import { dbPool } from '../config/database';

export class ServiceRequestAssignmentRepository {
  async findByRequestId(requestId: string): Promise<any[]> {
    const rows = await dbPool.query('SELECT * FROM service_request_assignments WHERE requestId = ?', [requestId]);
    return rows || [];
  }
}

export const serviceRequestAssignmentRepository = new ServiceRequestAssignmentRepository();
export default serviceRequestAssignmentRepository;
