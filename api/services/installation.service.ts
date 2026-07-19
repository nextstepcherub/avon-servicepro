import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class InstallationService {
  async createRequest(input: any, actorId: string, actorName: string, actorRole: string) {
    const id = `ireq-${uuidv4().slice(0, 8)}`;
    const request = {
      id,
      ...input,
      status: 'Pending Assignment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await dbPool.query(
      `INSERT INTO installation_requests (
        id, invoiceNumber, invoiceValue, customerName, departmentName, endUserName,
        instrumentName, brand, model, serialNumber, deliveryDate, warrantyPeriod,
        warrantyUnit, remarks, status, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, request.invoiceNumber, request.invoiceValue, request.customerName, request.departmentName, request.endUserName,
        request.instrumentName, request.brand, request.model, request.serialNumber, request.deliveryDate, request.warrantyPeriod,
        request.warrantyUnit, request.remarks, request.status, request.createdAt, request.updatedAt
      ]
    );
    return request;
  }

  async assignInstallation(requestId: string, data: any, actorId: string, actorName: string, actorRole: string) {
    const requestRows = await dbPool.query('SELECT * FROM installation_requests WHERE id = ?', [requestId]);
    if (!requestRows || requestRows.length === 0) throw new Error('Request not found');
    const request = requestRows[0];

    const assignmentId = `iasg-${uuidv4().slice(0, 8)}`;
    const assignment = {
      id: assignmentId,
      requestId,
      ...data,
      createdAt: new Date().toISOString()
    };

    // Insert into assignments
    await dbPool.query(
      `INSERT INTO installation_assignments (
        id, requestId, assignedEngineer, assignedTechnicians, assignmentDate,
        targetInstallationDate, priority, slaDaysSetting, slaDueDate, installationTerritory, remarks
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        assignmentId, requestId, assignment.assignedEngineer, assignment.assignedTechnicians, assignment.assignmentDate,
        assignment.targetInstallationDate, assignment.priority, assignment.slaDaysSetting, assignment.slaDueDate,
        assignment.installationTerritory, assignment.remarks
      ]
    );

    // Update request status to 'Assigned'
    await dbPool.query('UPDATE installation_requests SET status = "Assigned", updatedAt = ? WHERE id = ?', [new Date().toISOString(), requestId]);

    // Provision an active service job ticket
    const jobId = `job-${uuidv4().slice(0, 8)}`;
    await dbPool.query(
      `INSERT INTO service_jobs (
        id, serialNumber, jobType, status, customerName, brand, model, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jobId, request.serialNumber, 'Installation', 'Assigned', request.customerName, request.brand, request.model, new Date().toISOString()
      ]
    );

    // Provision an active Installation tracker
    const trackerId = `inst-${uuidv4().slice(0, 8)}`;
    await dbPool.query(
      `INSERT INTO installations (
        id, requestId, serialNumber, status, customerName, brand, model, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        trackerId, requestId, request.serialNumber, 'Assigned', request.customerName, request.brand, request.model, new Date().toISOString()
      ]
    );

    return assignment;
  }

  async getRequestDetails(requestId: string) {
    const rows = await dbPool.query('SELECT * FROM installation_requests WHERE id = ?', [requestId]);
    if (!rows || rows.length === 0) throw new Error('Request not found');
    return rows[0];
  }

  async advanceStatus(requestId: string, status: string, remarks: string, actorId: string, actorName: string, actorRole: string) {
    const requestRows = await dbPool.query('SELECT * FROM installation_requests WHERE id = ?', [requestId]);
    if (!requestRows || requestRows.length === 0) throw new Error('Request not found');
    const request = requestRows[0];

    // Update request status
    await dbPool.query('UPDATE installation_requests SET status = ?, updatedAt = ? WHERE id = ?', [status, new Date().toISOString(), requestId]);
    request.status = status;

    // If advanced to 'Scheduled', update tracker to 'In Progress'
    if (status === 'Scheduled') {
      await dbPool.query('UPDATE installations SET status = "In Progress" WHERE requestId = ?', [requestId]);
    }

    return request;
  }

  async updateInstallation(trackerId: string, data: any, actorId: string, actorName: string, actorRole: string) {
    const trackerRows = await dbPool.query('SELECT * FROM installations WHERE id = ?', [trackerId]);
    if (!trackerRows || trackerRows.length === 0) throw new Error('Tracker not found');
    const tracker = trackerRows[0];

    // Update tracker status and warranty card
    await dbPool.query(
      `UPDATE installations SET status = ?, warrantyCardUpdated = ?, warrantyCardNumber = ?,
       warrantyStart = ?, warrantyExpiry = ?, reportNotes = ? WHERE id = ?`,
      [
        data.status, data.warrantyCardUpdated, data.warrantyCardNumber,
        data.warrantyStart, data.warrantyExpiry, data.reportNotes, trackerId
      ]
    );
    tracker.status = data.status;

    // Propagate warranty dates to instrument_assets
    await dbPool.query(
      'UPDATE instrument_assets SET installationDate = ?, warrantyCardNumber = ? WHERE serialNumber = ?',
      [data.warrantyStart, data.warrantyCardNumber, tracker.serialNumber]
    );

    // Close out the installation request (status = 'Closed')
    await dbPool.query('UPDATE installation_requests SET status = "Closed" WHERE id = ?', [tracker.requestId]);

    // Close out the associated service job (status = 'Closed')
    await dbPool.query('UPDATE service_jobs SET status = "Closed" WHERE serialNumber = ? AND jobType = "Installation"', [tracker.serialNumber]);

    return tracker;
  }
}

export const installationService = new InstallationService();
export default installationService;
