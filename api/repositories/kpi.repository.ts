import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export class KpiRepository {
  async create(data: any): Promise<any> {
    const id = `kpi-${uuidv4().slice(0, 8)}`;
    const kpi = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    await dbPool.query(
      `INSERT INTO kpi_master (id, name, description, weight, targetValue, roleType) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, kpi.name, kpi.description, kpi.weight, kpi.targetValue, kpi.roleType]
    );
    return kpi;
  }

  async assignKpiToEmployee(data: any): Promise<any> {
    const id = `eka-${uuidv4().slice(0, 8)}`;
    const assignment = {
      id,
      ...data,
      createdAt: new Date().toISOString()
    };
    await dbPool.query(
      `INSERT INTO employee_kpi_assignments (id, employeeId, kpiId, financialYearId, currentValue, score, errorsCount) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, assignment.employeeId, assignment.kpiId, assignment.financialYearId, assignment.currentValue, assignment.score, assignment.errorsCount]
    );
    return assignment;
  }
}

export const kpiRepository = new KpiRepository();
export default kpiRepository;
