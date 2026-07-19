export class DashboardService {
  async getDashboardAnalytics() {
    return {
      activeTickets: 5,
      pendingInstallations: 2,
      complianceRate: 98,
    };
  }

  async getDashboardStats() {
    return {
      currentMonth: {
        totalRequests: 42,
        completedRequests: 35,
      },
      financialYear: {
        financialYearId: 'FY26-27',
        targetRevenue: 5000000,
        actualRevenue: 4200000,
      },
      trends: {
        months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        serviceRequestsCreated: [10, 15, 20, 25, 30, 35],
        serviceRequestsCompleted: [8, 12, 18, 22, 28, 32],
        installationsCompleted: [2, 3, 4, 3, 5, 4],
        revenue: [10000, 15000, 20000, 25000, 30000, 35000],
      },
      rankings: [
        {
          employeeId: 'emp-1',
          employeeName: 'Alice Johnson',
          compositeKpiScore: 92.5,
          rank: 1,
        }
      ],
      topPerformers: [
        { employeeId: 'emp-1', employeeName: 'Alice Johnson', score: 92.5 }
      ],
      bottomPerformers: [
        { employeeId: 'emp-3', employeeName: 'Bob Smith', score: 65.0 }
      ],
    };
  }
}

export const dashboardService = new DashboardService();
