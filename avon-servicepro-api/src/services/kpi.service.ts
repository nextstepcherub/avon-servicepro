import { kpiRepository, KpiMasterEntity, EmployeeKpiAssignmentEntity } from '../repositories/kpi.repository';
import { auditRepository } from '../repositories/audit.repository';
import { jobRepository } from '../repositories/job.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';

export class KpiService {
  async createKpi(kpiData: Omit<KpiMasterEntity, 'id'>, userId: string, userName: string, userRole: string): Promise<KpiMasterEntity> {
    logger.info(`KpiService: Creating new master KPI definition: ${kpiData.name}`);
    const kpi = await kpiRepository.create(kpiData);

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'CREATE_KPI_MASTER',
      newValue: kpi.id,
      remarks: `Defined master KPI "${kpi.name}" for role ${kpi.roleType}`
    });

    return kpi;
  }

  async evaluateEmployeeKpis(employeeId: string, financialYearId: string): Promise<any[]> {
    logger.info(`KpiService: Triggering automated KPI evaluation and measurement rules for employee ${employeeId}`);
    
    const assignments = await kpiRepository.getEmployeeKpiAssignments(employeeId, financialYearId);
    
    // We calculate current scores dynamically from operational tables (SLA, jobs completed, feedback)
    const { data: employeeJobs } = await jobRepository.findAll({
      filters: { assignedEngineerId: employeeId },
      limit: 1000
    });

    const evaluatedAssignments = [];

    for (const assignment of assignments) {
      let calculatedScore = assignment.score;
      let calculatedValue = assignment.currentValue;

      // Rule calculation engines based on KPI Master names
      if (assignment.name.includes('SLA') || assignment.name.includes('Response Time')) {
        const metSlaCount = employeeJobs.filter(j => j.status === 'Completed' || j.status === 'Closed').length; 
        const score = employeeJobs.length > 0 ? Math.round((metSlaCount / employeeJobs.length) * 100) : 100;
        calculatedScore = score;
        calculatedValue = `${score}% SLA Met (${metSlaCount}/${employeeJobs.length} Jobs)`;
      } 
      
      else if (assignment.name.includes('Satisfaction') || assignment.name.includes('Feedback')) {
        const ratingJobs = employeeJobs.filter(j => j.feedback);
        if (ratingJobs.length > 0) {
          const ratings = ratingJobs.map(j => {
            try {
              const fb = JSON.parse(j.feedback!);
              return fb.nps || 10;
            } catch (e) {
              return 10;
            }
          });
          const avgNps = ratings.reduce((a, b) => a + b, 0) / ratings.length;
          calculatedScore = Math.round((avgNps / 10) * 100);
          calculatedValue = `${avgNps.toFixed(1)}/10 NPS Average Rating`;
        } else {
          calculatedScore = 100;
          calculatedValue = 'No client reviews yet';
        }
      }

      else if (assignment.name.includes('Accuracy') || assignment.name.includes('Reporting')) {
        const errors = assignment.errorsCount || 0;
        // penalty: 10% penalty per administrative error
        const score = Math.max(0, 100 - (errors * 10));
        calculatedScore = score;
        calculatedValue = `${errors} Admin Errors (${score}% Accuracy Rating)`;
      }

      // Record calculated measurement in KPI History
      await kpiRepository.createKpiMeasurement({
        kpiAssignmentId: assignment.assignmentId,
        measuredValue: calculatedValue,
        scoreCalculated: calculatedScore,
        recordedAt: new Date().toISOString(),
        remarks: 'System automated cron calculation'
      });

      // Update current score and value in employee_kpi_assignments table
      await kpiRepository.updateAssignmentScore(
        assignment.assignmentId,
        calculatedValue,
        calculatedScore,
        assignment.errorsCount
      );

      evaluatedAssignments.push({
        ...assignment,
        currentValue: calculatedValue,
        score: calculatedScore
      });
    }

    return evaluatedAssignments;
  }

  async createOverallEvaluation(
    employeeId: string, 
    financialYearId: string, 
    evaluatedBy: string, 
    comments?: string
  ): Promise<any> {
    logger.info(`KpiService: Generating overall weighted KPI evaluation for employee ${employeeId}`);
    
    // 1. Evaluate/Calculate latest scores for all assignments
    const evaluated = await this.evaluateEmployeeKpis(employeeId, financialYearId);
    if (evaluated.length === 0) {
      throw new BadRequestError('Cannot evaluate employee with no KPI assignments.');
    }
    
    // 2. Compute weighted score
    let totalWeight = 0;
    let weightedScoreSum = 0;
    
    for (const item of evaluated) {
      totalWeight += item.weight;
      weightedScoreSum += item.score * item.weight;
    }
    
    const overallScore = totalWeight > 0 ? Math.round(weightedScoreSum / totalWeight) : 0;
    
    // 3. Persist evaluation record
    const evaluation = await kpiRepository.createEvaluation({
      employeeId,
      financialYearId,
      overallScore,
      evaluatedBy,
      evaluatedAt: new Date().toISOString(),
      status: 'Finalized',
      comments: comments || `Weighted summary across ${evaluated.length} KPIs.`
    });
    
    return {
      evaluation,
      components: evaluated
    };
  }

  async getEmployeeEvaluations(employeeId: string): Promise<any[]> {
    logger.info(`KpiService: Retrieving overall KPI evaluation history for employee ${employeeId}`);
    return kpiRepository.getEmployeeEvaluations(employeeId);
  }
}

export const kpiService = new KpiService();
export default kpiService;
