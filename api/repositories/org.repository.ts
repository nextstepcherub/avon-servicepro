export class OrgRepository {
  async findById(id: string): Promise<any> {
    return null;
  }
  async findByCode(code: string): Promise<any> {
    return null;
  }
  async hasChildren(id: string): Promise<boolean> {
    return false;
  }
  async create(entity: any): Promise<any> {
    return { id: 'generated_id', ...entity };
  }
}

export const orgRepository = new OrgRepository();
