import { dbPool } from '../config/database';
import { logger } from '../config/logger';

export interface MonthOverMonthMetric {
  currentValue: number;
  previousValue: number;
  percentageChange: number; // e.g. 15.4 means +15.4%
}

export interface DashboardStatsResponse {
  currentMonth: {
    monthName: string;
    metrics: {
      serviceRequestsCreated: MonthOverMonthMetric;
      serviceRequestsCompleted: MonthOverMonthMetric;
      slaComplianceRate: MonthOverMonthMetric;
      averageDowntimeHours: MonthOverMonthMetric;
      installationsCompleted: MonthOverMonthMetric;
      revenueEstimated: MonthOverMonthMetric;
    };
  };
  financialYear: {
    financialYearId: string;
    serviceRequestsCreated: number;
    serviceRequestsCompleted: number;
    installationsCompleted: number;
    totalRevenue: number;
    slaComplianceRate: number;
    averageDowntimeHours: number;
  };
  trends: {
    months: string[];
    serviceRequestsCreated: number[];
    serviceRequestsCompleted: number[];
    installationsCompleted: number[];
    revenue: number[];
  };
  rankings: {
    employeeId: string;
    employeeName: string;
    employeeEmail: string;
    employeeRole: string;
    avatarUrl?: string;
    compositeKpiScore: number;
    totalErrors: number;
    assignedKpiCount: number;
    rank: number;
  }[];
  topPerformers: any[];
  bottomPerformers: any[];
}

export class DashboardService {
  private getMonthStrings(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    
    const prevDate = new Date(date);
    prevDate.setMonth(date.getMonth() - 1);
    const prevYyyy = prevDate.getFullYear();
    const prevMm = String(prevDate.getMonth() + 1).padStart(2, '0');
    
    return {
      current: `${yyyy}-${mm}`,
      previous: `${prevYyyy}-${prevMm}`
    };
  }

  private getFinancialYearDates(date: Date) {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth(); // 0-indexed
    
    let fyStartYear: number;
    let fyEndYear: number;
    
    if (currentMonth < 3) { // Jan, Feb, Mar
      fyStartYear = currentYear - 1;
      fyEndYear = currentYear;
    } else {
      fyStartYear = currentYear;
      fyEndYear = currentYear + 1;
    }
    
    return {
      fyId: `FY${String(fyStartYear).substring(2)}-${String(fyEndYear).substring(2)}`,
      startDate: `${fyStartYear}-04-01T00:00:00Z`,
      endDate: `${fyEndYear}-03-31T23:59:59Z`
    };
  }

  private getLast6Months(date: Date) {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(date);
      d.setMonth(date.getMonth() - i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      months.push(`${yyyy}-${mm}`);
    }
    return months;
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
  }

  async getDashboardStats(referenceDateStr?: string): Promise<DashboardStatsResponse> {
    const referenceDate = referenceDateStr ? new Date(referenceDateStr) : new Date();
    logger.info(`DashboardService: Calculating analytics using reference date ${referenceDate.toISOString()}`);

    const { current: curMonth, previous: prevMonth } = this.getMonthStrings(referenceDate);
    const { fyId, startDate: fyStart, endDate: fyEnd } = this.getFinancialYearDates(referenceDate);
    const trendsMonths = this.getLast6Months(referenceDate);

    // --- 1. CURRENT MONTH METRICS ---
    // Service Requests Created
    const curCreatedRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE createdAt LIKE ?`,
      [`${curMonth}%`]
    );
    const prevCreatedRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE createdAt LIKE ?`,
      [`${prevMonth}%`]
    );
    const curCreated = curCreatedRows[0]?.count || 0;
    const prevCreated = prevCreatedRows[0]?.count || 0;

    // Service Requests Completed
    const curCompletedRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt LIKE ?`,
      [`${curMonth}%`]
    );
    const prevCompletedRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt LIKE ?`,
      [`${prevMonth}%`]
    );
    const curCompleted = curCompletedRows[0]?.count || 0;
    const prevCompleted = prevCompletedRows[0]?.count || 0;

    // SLA Compliance Rate
    const curSlaCompliantRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt LIKE ? AND slaStatus = 'IN_COMPLIANCE'`,
      [`${curMonth}%`]
    );
    const prevSlaCompliantRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt LIKE ? AND slaStatus = 'IN_COMPLIANCE'`,
      [`${prevMonth}%`]
    );
    const curSlaCompliant = curSlaCompliantRows[0]?.count || 0;
    const prevSlaCompliant = prevSlaCompliantRows[0]?.count || 0;

    const curSlaRate = curCompleted > 0 ? parseFloat(((curSlaCompliant / curCompleted) * 100).toFixed(1)) : 100.0;
    const prevSlaRate = prevCompleted > 0 ? parseFloat(((prevSlaCompliant / prevCompleted) * 100).toFixed(1)) : 100.0;

    // Average Downtime Hours
    const curDowntimeRows: any = await dbPool.query(
      `SELECT AVG(downTimeHours) as avgDowntime FROM service_requests WHERE resolvedAt LIKE ?`,
      [`${curMonth}%`]
    );
    const prevDowntimeRows: any = await dbPool.query(
      `SELECT AVG(downTimeHours) as avgDowntime FROM service_requests WHERE resolvedAt LIKE ?`,
      [`${prevMonth}%`]
    );
    const curDowntime = parseFloat(curDowntimeRows[0]?.avgDowntime || 0).toFixed(1);
    const prevDowntime = parseFloat(prevDowntimeRows[0]?.avgDowntime || 0).toFixed(1);

    // Installations Completed
    const curInstRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM installations WHERE status = 'Completed' AND completedAt LIKE ?`,
      [`${curMonth}%`]
    );
    const prevInstRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM installations WHERE status = 'Completed' AND completedAt LIKE ?`,
      [`${prevMonth}%`]
    );
    const curInst = curInstRows[0]?.count || 0;
    const prevInst = prevInstRows[0]?.count || 0;

    // Revenue / Billings Estimated
    const curRevenueRequests: any = await dbPool.query(
      `SELECT SUM(estimatedCost) as total FROM service_requests WHERE resolvedAt LIKE ?`,
      [`${curMonth}%`]
    );
    const prevRevenueRequests: any = await dbPool.query(
      `SELECT SUM(estimatedCost) as total FROM service_requests WHERE resolvedAt LIKE ?`,
      [`${prevMonth}%`]
    );
    const curRevenueInst: any = await dbPool.query(
      `SELECT SUM(ir.invoiceValue) as total FROM installations i JOIN installation_requests ir ON i.serialNumber = ir.serialNumber WHERE i.status = 'Completed' AND i.completedAt LIKE ?`,
      [`${curMonth}%`]
    );
    const prevRevenueInst: any = await dbPool.query(
      `SELECT SUM(ir.invoiceValue) as total FROM installations i JOIN installation_requests ir ON i.serialNumber = ir.serialNumber WHERE i.status = 'Completed' AND i.completedAt LIKE ?`,
      [`${prevMonth}%`]
    );
    const curRevenue = parseFloat((curRevenueRequests[0]?.total || 0) + (curRevenueInst[0]?.total || 0));
    const prevRevenue = parseFloat((prevRevenueRequests[0]?.total || 0) + (prevRevenueInst[0]?.total || 0));

    // --- 2. FINANCIAL YEAR METRICS ---
    const fyCreatedRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE createdAt >= ? AND createdAt <= ?`,
      [fyStart, fyEnd]
    );
    const fyCompletedRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt >= ? AND resolvedAt <= ?`,
      [fyStart, fyEnd]
    );
    const fySlaCompliantRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt >= ? AND resolvedAt <= ? AND slaStatus = 'IN_COMPLIANCE'`,
      [fyStart, fyEnd]
    );
    const fyDowntimeRows: any = await dbPool.query(
      `SELECT AVG(downTimeHours) as avgDowntime FROM service_requests WHERE resolvedAt >= ? AND resolvedAt <= ?`,
      [fyStart, fyEnd]
    );
    const fyInstRows: any = await dbPool.query(
      `SELECT COUNT(*) as count FROM installations WHERE status = 'Completed' AND completedAt >= ? AND completedAt <= ?`,
      [fyStart, fyEnd]
    );
    const fyRevRequests: any = await dbPool.query(
      `SELECT SUM(estimatedCost) as total FROM service_requests WHERE resolvedAt >= ? AND resolvedAt <= ?`,
      [fyStart, fyEnd]
    );
    const fyRevInst: any = await dbPool.query(
      `SELECT SUM(ir.invoiceValue) as total FROM installations i JOIN installation_requests ir ON i.serialNumber = ir.serialNumber WHERE i.status = 'Completed' AND i.completedAt >= ? AND i.completedAt <= ?`,
      [fyStart, fyEnd]
    );

    const fyCreated = fyCreatedRows[0]?.count || 0;
    const fyCompleted = fyCompletedRows[0]?.count || 0;
    const fySlaCompliant = fySlaCompliantRows[0]?.count || 0;
    const fySlaRate = fyCompleted > 0 ? parseFloat(((fySlaCompliant / fyCompleted) * 100).toFixed(1)) : 100.0;
    const fyDowntime = parseFloat(fyDowntimeRows[0]?.avgDowntime || 0).toFixed(1);
    const fyInst = fyInstRows[0]?.count || 0;
    const fyRevenue = parseFloat((fyRevRequests[0]?.total || 0) + (fyRevInst[0]?.total || 0));

    // --- 3. TRENDS (6-MONTH HISTORY) ---
    const trendsCreated: number[] = [];
    const trendsCompleted: number[] = [];
    const trendsInstCompleted: number[] = [];
    const trendsRevenue: number[] = [];

    for (const monthStr of trendsMonths) {
      const cr: any = await dbPool.query(`SELECT COUNT(*) as count FROM service_requests WHERE createdAt LIKE ?`, [`${monthStr}%`]);
      const co: any = await dbPool.query(`SELECT COUNT(*) as count FROM service_requests WHERE resolvedAt LIKE ?`, [`${monthStr}%`]);
      const ins: any = await dbPool.query(`SELECT COUNT(*) as count FROM installations WHERE status = 'Completed' AND completedAt LIKE ?`, [`${monthStr}%`]);
      
      const revReq: any = await dbPool.query(`SELECT SUM(estimatedCost) as total FROM service_requests WHERE resolvedAt LIKE ?`, [`${monthStr}%`]);
      const revIns: any = await dbPool.query(`SELECT SUM(ir.invoiceValue) as total FROM installations i JOIN installation_requests ir ON i.serialNumber = ir.serialNumber WHERE i.status = 'Completed' AND i.completedAt LIKE ?`, [`${monthStr}%`]);
      const rev = parseFloat((revReq[0]?.total || 0) + (revIns[0]?.total || 0));

      trendsCreated.push(cr[0]?.count || 0);
      trendsCompleted.push(co[0]?.count || 0);
      trendsInstCompleted.push(ins[0]?.count || 0);
      trendsRevenue.push(rev);
    }

    // --- 4. RANKINGS AND PERFORMERS ---
    const rankingsSql = `
      SELECT 
        up.id AS employeeId,
        up.name AS employeeName,
        up.email AS employeeEmail,
        up.role AS employeeRole,
        up.avatarUrl,
        SUM(eka.score * km.weight) / SUM(km.weight) AS rawCompositeScore,
        SUM(eka.errorsCount) AS totalErrors,
        COUNT(eka.id) AS assignedKpiCount
      FROM user_profiles up
      JOIN employee_kpi_assignments eka ON up.id = eka.employeeId
      JOIN kpi_master km ON eka.kpiId = km.id
      GROUP BY up.id, up.name, up.email, up.role, up.avatarUrl
      HAVING assignedKpiCount > 0
      ORDER BY rawCompositeScore DESC
    `;

    const rankingRows = await dbPool.query(rankingsSql) as any[];

    const rankings = rankingRows.map((row, index) => ({
      employeeId: row.employeeId,
      employeeName: row.employeeName,
      employeeEmail: row.employeeEmail,
      employeeRole: row.employeeRole,
      avatarUrl: row.avatarUrl || undefined,
      compositeKpiScore: Math.round(parseFloat(row.rawCompositeScore || 0)),
      totalErrors: parseInt(row.totalErrors || 0),
      assignedKpiCount: parseInt(row.assignedKpiCount || 0),
      rank: index + 1
    }));

    // Slicing top and bottom performers
    const topPerformers = rankings.slice(0, 3);
    // For bottom performers, sort in ascending order
    const bottomPerformers = [...rankings]
      .sort((a, b) => a.compositeKpiScore - b.compositeKpiScore)
      .slice(0, 3);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const monthName = monthNames[referenceDate.getMonth()];

    return {
      currentMonth: {
        monthName,
        metrics: {
          serviceRequestsCreated: {
            currentValue: curCreated,
            previousValue: prevCreated,
            percentageChange: this.calculatePercentageChange(curCreated, prevCreated)
          },
          serviceRequestsCompleted: {
            currentValue: curCompleted,
            previousValue: prevCompleted,
            percentageChange: this.calculatePercentageChange(curCompleted, prevCompleted)
          },
          slaComplianceRate: {
            currentValue: curSlaRate,
            previousValue: prevSlaRate,
            percentageChange: this.calculatePercentageChange(curSlaRate, prevSlaRate)
          },
          averageDowntimeHours: {
            currentValue: parseFloat(curDowntime),
            previousValue: parseFloat(prevDowntime),
            percentageChange: this.calculatePercentageChange(parseFloat(curDowntime), parseFloat(prevDowntime))
          },
          installationsCompleted: {
            currentValue: curInst,
            previousValue: prevInst,
            percentageChange: this.calculatePercentageChange(curInst, prevInst)
          },
          revenueEstimated: {
            currentValue: curRevenue,
            previousValue: prevRevenue,
            percentageChange: this.calculatePercentageChange(curRevenue, prevRevenue)
          }
        }
      },
      financialYear: {
        financialYearId: fyId,
        serviceRequestsCreated: fyCreated,
        serviceRequestsCompleted: fyCompleted,
        installationsCompleted: fyInst,
        totalRevenue: fyRevenue,
        slaComplianceRate: fySlaRate,
        averageDowntimeHours: parseFloat(fyDowntime)
      },
      trends: {
        months: trendsMonths,
        serviceRequestsCreated: trendsCreated,
        serviceRequestsCompleted: trendsCompleted,
        installationsCompleted: trendsInstCompleted,
        revenue: trendsRevenue
      },
      rankings,
      topPerformers,
      bottomPerformers
    };
  }
}

export const dashboardService = new DashboardService();
