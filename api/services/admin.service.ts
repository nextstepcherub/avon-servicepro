export class AdminService {
  async createUser(data: any) {
    return { id: 'usr_new', ...data };
  }
}

export const adminService = new AdminService();
