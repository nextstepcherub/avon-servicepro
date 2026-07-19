import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class ServiceRequestService {
  async createRequest(reqData: any, actorId: string, actorName: string, actorRole: string) {
    const id = `sreq-${uuidv4().slice(0, 8)}`;
    const ticketNumber = `AVN-SRQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const slaDaysSetting = reqData.priority === 'HIGH' ? 3 : 7;
    
    const request = {
      id,
      ticketNumber,
      status: 'RECEIVED',
      slaDaysSetting,
      slaStatus: 'IN_COMPLIANCE',
      ...reqData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await dbPool.query(
      `INSERT INTO service_requests (
        id, ticketNumber, status, slaDaysSetting, slaStatus, instrumentId,
        instrumentName, brand, serialNumber, customerId, customerName, subject,
        description, priority, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, ticketNumber, request.status, request.slaDaysSetting, request.slaStatus, request.instrumentId,
        request.instrumentName, request.brand, request.serialNumber, request.customerId, request.customerName,
        request.subject, request.description, request.priority, request.createdAt, request.updatedAt
      ]
    );

    // Auto-provision job ticket
    const jobId = `job-${uuidv4().slice(0, 8)}`;
    const jobPriority = reqData.priority === 'HIGH' ? 'Urgent' : 'Routine';
    await dbPool.query(
      `INSERT INTO service_jobs (
        id, serialNumber, jobType, status, customerName, brand, model, priority, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId, request.serialNumber, 'Calibration', 'Pending Assignment', request.customerName, request.brand, request.instrumentName, jobPriority, new Date().toISOString()
      ]
    );

    return request;
  }

  async assignRequest(requestId: string, assignmentData: any, actorId: string, actorName: string, actorRole: string) {
    const id = `sra-${uuidv4().slice(0, 8)}`;
    const assignment = {
      id,
      requestId,
      ...assignmentData,
      createdAt: new Date().toISOString()
    };

    // Insert assignment
    await dbPool.query(
      `INSERT INTO service_request_assignments (
        id, requestId, assignedEngineerId, assignedEngineerName, targetResolutionDate, remarks, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id, requestId, assignment.assignedEngineerId, assignment.assignedEngineerName, assignment.targetResolutionDate, assignment.remarks, assignment.createdAt
      ]
    );

    // Update request status to 'DIAGNOSING'
    await dbPool.query(
      'UPDATE service_requests SET status = "DIAGNOSING", updatedAt = ? WHERE id = ?',
      [new Date().toISOString(), requestId]
    );

    // Write audit log
    await dbPool.query(
      `INSERT INTO service_request_audit_logs (
        id, requestId, action, remarks, createdAt
      ) VALUES (?, ?, ?, ?, ?)`,
      [
        `aud-${uuidv4().slice(0, 8)}`, requestId, 'ASSIGNED', assignment.remarks, new Date().toISOString()
      ]
    );

    // Sync job ticket to DIAGNOSING and assign to engineer
    await dbPool.query(
      'UPDATE service_jobs SET status = "DIAGNOSING", assignedEngineerId = ?, assignedEngineerName = ? WHERE serialNumber = ? AND jobType = "Calibration"',
      [assignment.assignedEngineerId, assignment.assignedEngineerName, (await this.getRequestSerialNumber(requestId))]
    );

    return assignment;
  }

  private async getRequestSerialNumber(requestId: string): Promise<string> {
    const rows = await dbPool.query('SELECT serialNumber FROM service_requests WHERE id = ?', [requestId]);
    return rows && rows.length > 0 ? rows[0].serialNumber : '';
  }

  async getRequestDetails(requestId: string) {
    const requestRows = await dbPool.query('SELECT * FROM service_requests WHERE id = ?', [requestId]);
    if (!requestRows || requestRows.length === 0) throw new Error('Request not found');
    const request = requestRows[0];

    const assignmentRows = await dbPool.query('SELECT * FROM service_request_assignments WHERE requestId = ?', [requestId]);
    const assignment = assignmentRows && assignmentRows.length > 0 ? assignmentRows[0] : null;

    const auditLogs = await dbPool.query('SELECT * FROM service_request_audit_logs WHERE requestId = ?', [requestId]);

    return {
      request,
      assignment,
      auditLogs: auditLogs || []
    };
  }

  async updateStatus(requestId: string, status: string, remarks: string, actorId: string, actorName: string, actorRole: string) {
    const resolvedAt = status === 'CLOSED' ? new Date().toISOString() : null;
    const downTimeHours = status === 'CLOSED' ? 4.0 : 0.0;
    const slaStatus = status === 'CLOSED' ? 'IN_COMPLIANCE' : 'IN_COMPLIANCE';

    if (status === 'CLOSED') {
      await dbPool.query(
        'UPDATE service_requests SET status = ?, resolvedAt = ?, downTimeHours = ?, slaStatus = ?, updatedAt = ? WHERE id = ?',
        [status, resolvedAt, downTimeHours, slaStatus, new Date().toISOString(), requestId]
      );
    } else {
      await dbPool.query(
        'UPDATE service_requests SET status = ?, updatedAt = ? WHERE id = ?',
        [status, new Date().toISOString(), requestId]
      );
    }

    // Sync job ticket to CLOSED
    const serial = await this.getRequestSerialNumber(requestId);
    await dbPool.query(
      'UPDATE service_jobs SET status = ? WHERE serialNumber = ? AND jobType = "Calibration"',
      [status, serial]
    );

    const rows = await dbPool.query('SELECT * FROM service_requests WHERE id = ?', [requestId]);
    return rows[0];
  }

  async updateBilling(requestId: string, estimatedCost: number, isApproved: boolean, actorId: string, actorName: string, actorRole: string) {
    const billingApproved = isApproved ? 1 : 0;
    await dbPool.query(
      'UPDATE service_requests SET estimatedCost = ?, billingApproved = ?, updatedAt = ? WHERE id = ?',
      [estimatedCost, billingApproved, new Date().toISOString(), requestId]
    );

    const rows = await dbPool.query('SELECT * FROM service_requests WHERE id = ?', [requestId]);
    return rows[0];
  }
}

export const serviceRequestService = new ServiceRequestService();
export default serviceRequestService;
