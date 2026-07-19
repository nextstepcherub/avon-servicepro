import { requestContextStorage } from '../utils/requestContext';
import { v4 as uuidv4 } from 'uuid';

export class AuditRepository {
  private logs: any[] = [];

  async create(logData: any) {
    const store = requestContextStorage.getStore();
    const ipAddress = logData.ipAddress || (store ? store.ipAddress : undefined);
    const userAgent = logData.userAgent || (store ? store.userAgent : undefined);
    
    const log = {
      id: uuidv4(),
      ...logData,
      ipAddress,
      userAgent,
    };
    
    this.logs.push(log);
    return log;
  }

  async findAll(options: { search?: string } = {}) {
    let filtered = [...this.logs];
    if (options.search) {
      const query = options.search.toLowerCase();
      filtered = filtered.filter(log => {
        return (log.userName && log.userName.toLowerCase().includes(query)) ||
               (log.remarks && log.remarks.toLowerCase().includes(query)) ||
               (log.ipAddress && log.ipAddress.toLowerCase().includes(query)) ||
               (log.action && log.action.toLowerCase().includes(query));
      });
    }
    return {
      data: filtered,
      total: filtered.length
    };
  }

  async update(id: string, data: any) {
    throw new Error('Audit logs are immutable and cannot be updated');
  }

  async delete(id: string) {
    throw new Error('Audit logs are immutable and cannot be deleted');
  }
}

export const auditRepository = new AuditRepository();
