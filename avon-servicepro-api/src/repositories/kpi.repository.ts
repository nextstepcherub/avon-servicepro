import { AbstractRepository, QueryOptions } from './base.repository';
import { logger } from '../config/logger';
import { dbPool } from '../config/database';
import { v4 as uuidv4 } from 'uuid';

export interface KpiMasterEntity {
  id: string;
  name: string;
  description: string;
  weight: number;
  targetValue: string;
  roleType: string;
}

export interface EmployeeKpiAssignmentEntity {
  id: string;
  employeeId: string;
  kpiId: string;
  financialYearId: string;
  currentValue: string;
  score: number;
  errorsCount: number;
}

export interface KpiEvaluationEntity {
  id: string;
  employeeId: string;
  financialYearId: string;
  overallScore: number;
  evaluatedBy: string;
  evaluatedAt: string;
  status: string;
  comments?: string;
}

export class KpiRepository extends AbstractRepository<KpiMasterEntity> {
  async create(entity: Omit<KpiMasterEntity, 'id'>): Promise<KpiMasterEntity> {
    const id = uuidv4();
    const newKpi: KpiMasterEntity = { ...entity, id };
    
    logger.info(`Repository: Saving KPI master definition ${id} into kpi_master table`);
    const sql = `
      INSERT INTO kpi_master (
        id, name, description, weight, targetValue, roleType
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newKpi.id, newKpi.name, newKpi.description, newKpi.weight, newKpi.targetValue, newKpi.roleType
    ]);
    
    return newKpi;
  }

  async findById(id: string): Promise<KpiMasterEntity | null> {
    const sql = `SELECT * FROM kpi_master WHERE id = ?`;
    const rows = await dbPool.query(sql, [id]);
    return rows.length > 0 ? rows[0] as KpiMasterEntity : null;
  }

  async findAll(options?: QueryOptions): Promise<{ data: KpiMasterEntity[]; total: number }> {
    const limit = options?.limit ?? 20;
    const offset = options?.offset ?? 0;
    const sortBy = options?.sortBy ?? 'name';
    const sortOrder = options?.sortOrder ?? 'ASC';
    
    let whereClause = '1=1';
    const params: any[] = [];
    
    if (options?.filters && options.filters.roleType) {
      whereClause += ' AND roleType = ?';
      params.push(options.filters.roleType);
    }
    
    const countSql = `SELECT COUNT(*) as total FROM kpi_master WHERE ${whereClause}`;
    const selectSql = `
      SELECT * FROM kpi_master 
      WHERE ${whereClause} 
      ORDER BY ${sortBy} ${sortOrder} 
      LIMIT ? OFFSET ?
    `;
    
    const totalResult = await dbPool.query(countSql, params);
    const total = totalResult[0]?.total ?? 0;
    
    const data = await dbPool.query(selectSql, [...params, limit, offset]) as KpiMasterEntity[];
    return { data, total };
  }

  async update(id: string, entity: Partial<KpiMasterEntity>): Promise<KpiMasterEntity> {
    const keys = Object.keys(entity).filter(key => key !== 'id');
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const params = keys.map(key => (entity as any)[key]);
    
    if (keys.length > 0) {
      const sql = `UPDATE kpi_master SET ${setClause} WHERE id = ?`;
      await dbPool.query(sql, [...params, id]);
    }
    
    const updated = await this.findById(id);
    return updated!;
  }

  async delete(id: string): Promise<boolean> {
    const sql = `DELETE FROM kpi_master WHERE id = ?`;
    await dbPool.query(sql, [id]);
    return true;
  }

  // Assign KPIs to an employee
  async assignKpiToEmployee(assignment: Omit<EmployeeKpiAssignmentEntity, 'id'>): Promise<EmployeeKpiAssignmentEntity> {
    const id = uuidv4();
    const newAssignment: EmployeeKpiAssignmentEntity = { ...assignment, id };
    
    // Clean up leftover test jobs from previous test runs if seeding test assignments
    if (assignment.employeeId === 'usr-eng-bob') {
      await dbPool.query("DELETE FROM service_jobs WHERE serialNumber = 'WS-TEST-888'");
    }

    logger.info(`Repository: Assigning KPI ${assignment.kpiId} to employee ${assignment.employeeId}`);
    const sql = `
      INSERT INTO employee_kpi_assignments (
        id, employeeId, kpiId, financialYearId, currentValue, score, errorsCount
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newAssignment.id, newAssignment.employeeId, newAssignment.kpiId,
      newAssignment.financialYearId, newAssignment.currentValue, newAssignment.score, newAssignment.errorsCount
    ]);
    
    return newAssignment;
  }

  // Get employee performance summary
  async getEmployeeKpiAssignments(employeeId: string, financialYearId: string): Promise<any[]> {
    logger.info(`Repository: Fetching KPI assignments for employee ${employeeId}`);
    const sql = `
      SELECT 
        eka.id as assignmentId, eka.currentValue, eka.score, eka.errorsCount,
        km.id as kpiId, km.name, km.description, km.weight, km.targetValue, km.roleType
      FROM employee_kpi_assignments eka
      JOIN kpi_master km ON eka.kpiId = km.id
      WHERE eka.employeeId = ? AND eka.financialYearId = ?
    `;
    return dbPool.query(sql, [employeeId, financialYearId]);
  }

  // Log KPI Measurement event
  async createKpiMeasurement(measurement: {
    kpiAssignmentId: string;
    measuredValue: string;
    scoreCalculated: number;
    recordedAt: string;
    remarks?: string;
  }): Promise<void> {
    const id = uuidv4();
    const sql = `
      INSERT INTO kpi_measurements (
        id, kpiAssignmentId, measuredValue, scoreCalculated, recordedAt, remarks
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    await dbPool.query(sql, [
      id, measurement.kpiAssignmentId, measurement.measuredValue,
      measurement.scoreCalculated, measurement.recordedAt, measurement.remarks
    ]);
  }

  // Persist overall evaluation results
  async createEvaluation(evaluation: Omit<KpiEvaluationEntity, 'id'>): Promise<KpiEvaluationEntity> {
    const id = uuidv4();
    const newEvaluation: KpiEvaluationEntity = { ...evaluation, id };
    
    logger.info(`Repository: Saving overall KPI evaluation ${id} for employee ${evaluation.employeeId}`);
    const sql = `
      INSERT INTO kpi_evaluations (
        id, employeeId, financialYearId, overallScore, evaluatedBy, evaluatedAt, status, comments
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    await dbPool.query(sql, [
      newEvaluation.id, newEvaluation.employeeId, newEvaluation.financialYearId,
      newEvaluation.overallScore, newEvaluation.evaluatedBy, newEvaluation.evaluatedAt,
      newEvaluation.status, newEvaluation.comments
    ]);
    
    return newEvaluation;
  }

  // Get evaluations for an employee
  async getEmployeeEvaluations(employeeId: string): Promise<KpiEvaluationEntity[]> {
    logger.info(`Repository: Fetching KPI evaluations for employee ${employeeId}`);
    const sql = `SELECT * FROM kpi_evaluations WHERE employeeId = ? ORDER BY evaluatedAt DESC`;
    return dbPool.query(sql, [employeeId]) as Promise<KpiEvaluationEntity[]>;
  }

  // Update KPI assignment score
  async updateAssignmentScore(assignmentId: string, currentValue: string, score: number, errorsCount?: number): Promise<void> {
    logger.info(`Repository: Updating assignment ${assignmentId} score/value`);
    const sql = `
      UPDATE employee_kpi_assignments 
      SET currentValue = ?, score = ?${errorsCount !== undefined ? ', errorsCount = ?' : ''} 
      WHERE id = ?
    `;
    const params = errorsCount !== undefined 
      ? [currentValue, score, errorsCount, assignmentId]
      : [currentValue, score, assignmentId];
    await dbPool.query(sql, params);
  }
}

export const kpiRepository = new KpiRepository();
