export class ReportService {
  async getOperationalReport() {
    return {
      timestamp: new Date().toISOString(),
      tickets: {
        total: 10,
        byStatus: { RECEIVED: 2, ASSIGNED: 5, CLOSED: 3 },
        byPriority: { LOW: 1, MEDIUM: 5, HIGH: 4 },
        averageDowntimeHours: 4.5,
        slaComplianceRate: 94.2
      },
      installations: {
        totalRequests: 5,
        byStatus: { Assigned: 2, Completed: 3 },
        completedCount: 3,
        totalInvoiceValue: 120000
      },
      jobs: {
        totalActive: 4,
        byType: { Installation: 2, Calibration: 2 },
        byStatus: { Assigned: 3, Scheduled: 1 },
        outstandingEmergencyCount: 1
      }
    };
  }

  async getKpiReport(fy: string) {
    return {
      timestamp: new Date().toISOString(),
      overallAverageKpiScore: 85.5,
      rankings: [
        { name: 'Alice Johnson', compositeScore: 92 },
        { name: 'Bob Smith', compositeScore: 78 }
      ],
      performers: {
        top: [{ name: 'Alice Johnson', score: 92 }],
        needsImprovement: [{ name: 'Bob Smith', score: 78 }]
      }
    };
  }

  async getExecutiveReport() {
    const billingApprovedEstimatedCost = 250000;
    const activeAmcValue = 500000;
    const completedInstallationsValue = 150000;
    const totalEnterpriseRevenuePotential = billingApprovedEstimatedCost + activeAmcValue + completedInstallationsValue;

    return {
      timestamp: new Date().toISOString(),
      financials: {
        billingApprovedEstimatedCost,
        activeAmcValue,
        completedInstallationsValue,
        totalEnterpriseRevenuePotential
      },
      slaCompliance: {
        overallRate: 95.8,
        bySlaTier: { Gold: 98, Silver: 92 }
      },
      contracts: {
        totalContracts: 20,
        activeContracts: 18,
        expiredContracts: 2,
        averageUptimeGuarantee: 99.5,
        averageResponseTimeHours: 4
      }
    };
  }
}

export const reportService = new ReportService();
export default reportService;
