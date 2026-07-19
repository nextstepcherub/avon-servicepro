import { orgRepository } from '../repositories/org.repository';

export class OrgService {
  async createOrgUnit(data: any) {
    if (data.parentId) {
      const parent = await orgRepository.findById(data.parentId);
      if (parent) {
        if (data.type === 'BRANCH' && parent.type !== 'COMPANY') {
          throw new Error('BRANCH parent unit must be of type COMPANY');
        }
        if (data.type === 'DEPARTMENT' && parent.type !== 'COMPANY' && parent.type !== 'BRANCH') {
          throw new Error('DEPARTMENT parent unit must be of type COMPANY or BRANCH');
        }
      }
    }
    return await orgRepository.create(data);
  }

  async updateOrgUnit(id: string, data: any) {
    if (data.parentId) {
      if (data.parentId === id) {
        throw new Error('Circular reference detected');
      }
      
      // Follow parent chain to detect loop
      let currentParentId = data.parentId;
      const visited = new Set<string>([id]);
      while (currentParentId) {
        if (visited.has(currentParentId)) {
          throw new Error('Circular reference detected');
        }
        visited.add(currentParentId);
        const parent = await orgRepository.findById(currentParentId);
        currentParentId = parent ? parent.parentId : null;
      }
    }
    return { id, ...data };
  }

  async deleteOrgUnit(id: string) {
    const hasKids = await orgRepository.hasChildren(id);
    if (hasKids) {
      throw new Error('Unit has dependent sub-units');
    }
    return true;
  }
}

export const orgService = new OrgService();
