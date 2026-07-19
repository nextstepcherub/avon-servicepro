import { customerRepository, CustomerEntity } from '../repositories/customer.repository';
import { auditRepository } from '../repositories/audit.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';

export class CustomerService {
  async createCustomer(customerData: Omit<CustomerEntity, 'id' | 'totalRevenue' | 'installedEquipmentCount' | 'feedbackNpsAverage'>, userId: string, userName: string, userRole: string): Promise<CustomerEntity> {
    logger.info(`CustomerService: Registering hospital account ${customerData.name}`);

    const existing = await customerRepository.findByName(customerData.name);
    if (existing) {
      throw new BadRequestError(`Customer account with name "${customerData.name}" already exists.`);
    }

    const customer = await customerRepository.create({
      ...customerData,
      installedEquipmentCount: 0,
      totalRevenue: 0,
      feedbackNpsAverage: 10.0, // Start with maximum NPS 10 as baseline
    });

    await auditRepository.create({
      timestamp: new Date().toISOString(),
      userId,
      userName,
      userRole,
      action: 'CREATE_CUSTOMER',
      newValue: customer.id,
      remarks: `Created client hospital profile for ${customer.name}.`
    });

    return customer;
  }

  async getCustomerProfile(id: string): Promise<CustomerEntity> {
    const customer = await customerRepository.findById(id);
    if (!customer) {
      throw new NotFoundError(`Customer with ID ${id} not found`);
    }
    return customer;
  }
}

export const customerService = new CustomerService();
export default customerService;
