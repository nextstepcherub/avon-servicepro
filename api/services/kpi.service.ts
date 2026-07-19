import { dbPool } from '../config/database';

export class KpiService {
  async evaluateEmployeeKpis(employeeId: string, financialYearId: string): Promise<any[]> {
    // 1. Fetch assignments for this employee
    const assignments = await dbPool.query(
      'SELECT * FROM employee_kpi_assignments WHERE employeeId = ? AND financialYearId = ?',
      [employeeId, financialYearId]
    );

    if (!assignments || assignments.length === 0) {
      return [];
    }

    // 2. Fetch all KPI definitions
    const kpiDefinitions = await dbPool.query('SELECT * FROM kpi_master');

    // 3. Fetch jobs for this employee to evaluate SLA
    const jobs = await dbPool.query('SELECT * FROM service_jobs WHERE assignedEngineerId = ?', [employeeId]);
    const completedJobs = jobs ? jobs.filter((j: any) => j.status === 'Completed' || j.status === 'Closed') : [];

    const evaluated = [];

    for (const assignment of assignments) {
      const def = kpiDefinitions.find((k: any) => k.id === assignment.kpiId);
      if (!def) continue;

      let score = assignment.score || 0;
      let currentValue = assignment.currentValue || '';

      if (def.name === 'Service SLA Compliance') {
        if (completedJobs.length > 0) {
          score = 100;
          currentValue = `${completedJobs.length}/${jobs.length} Jobs met`;
        } else {
          score = 0;
          currentValue = `0/${jobs.length || 1} Jobs met`;
        }
      }

      evaluated.push({
        id: assignment.id,
        kpiId: assignment.kpiId,
        employeeId: assignment.employeeId,
        financialYearId: assignment.financialYearId,
        name: def.name,
        description: def.description,
        weight: def.weight,
        targetValue: def.targetValue,
        roleType: def.roleType,
        score,
        currentValue,
        errorsCount: assignment.errorsCount || 0
      });
    }

    return evaluated;
  }
}

export const kpiService = new KpiService();
export default kpiService;
