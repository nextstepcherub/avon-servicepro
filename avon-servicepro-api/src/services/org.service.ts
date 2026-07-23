import { orgRepository, OrgUnitEntity } from '../repositories/org.repository';
import { userRepository } from '../repositories/user.repository';
import { logger } from '../config/logger';
import { BadRequestError, NotFoundError } from '../utils/apiError';
import { QueryOptions } from '../repositories/base.repository';
import { dbPool } from '../config/database';

export interface OrgTreeNode extends OrgUnitEntity {
  managerName?: string;
  parentName?: string;
  children: OrgTreeNode[];
}

export class OrgService {
  /**
   * Validates structural and hierarchical rules for an organizational unit.
   */
  private async validateOrgStructure(
    type: 'COMPANY' | 'BRANCH' | 'DEPARTMENT' | 'UNIT',
    parentId?: string,
    managerId?: string,
    currentId?: string
  ): Promise<void> {
    // 1. Validate Manager ID if provided
    if (managerId) {
      const manager = await userRepository.findById(managerId);
      if (!manager) {
        throw new BadRequestError(`Manager with ID '${managerId}' does not exist`);
      }
    }

    // 2. Validate Parent ID rules
    if (!parentId) {
      if (type !== 'COMPANY') {
        throw new BadRequestError(`Parent ID is required for organization units of type '${type}'`);
      }
      return; // COMPANY with no parent is valid
    }

    // A unit cannot be its own parent
    if (currentId && parentId === currentId) {
      throw new BadRequestError('An organizational unit cannot be its own parent');
    }

    // Retrieve parent unit
    const parent = await orgRepository.findById(parentId);
    if (!parent) {
      throw new NotFoundError(`Parent organizational unit with ID '${parentId}' not found`);
    }

    // 3. Prevent Circular Reference (only applicable during updates)
    if (currentId) {
      let ancestorId = parent.parentId;
      let depth = 0;
      const maxDepth = 100; // prevent infinite loops
      
      while (ancestorId) {
        if (ancestorId === currentId) {
          throw new BadRequestError(`Circular reference detected: Parent unit '${parentId}' is a descendant of '${currentId}'`);
        }
        
        depth++;
        if (depth > maxDepth) {
          throw new BadRequestError('Hierarchy depth limit exceeded (possible loop)');
        }

        const ancestor = await orgRepository.findById(ancestorId);
        ancestorId = ancestor?.parentId;
      }
    }

    // 4. Enforce strict hierarchy type constraints
    if (type === 'COMPANY') {
      throw new BadRequestError('A top-level COMPANY cannot have a parent unit');
    }

    if (type === 'BRANCH') {
      if (parent.type !== 'COMPANY') {
        throw new BadRequestError('A BRANCH parent unit must be of type COMPANY');
      }
    }

    if (type === 'DEPARTMENT') {
      if (!['COMPANY', 'BRANCH', 'DEPARTMENT'].includes(parent.type)) {
        throw new BadRequestError('A DEPARTMENT parent unit must be a COMPANY, BRANCH, or another DEPARTMENT');
      }
    }

    if (type === 'UNIT') {
      if (!['DEPARTMENT', 'UNIT'].includes(parent.type)) {
        throw new BadRequestError('An organizational UNIT parent must be a DEPARTMENT or another UNIT');
      }
    }
  }

  /**
   * Create a new organizational unit.
   */
  async createOrgUnit(data: {
    name: string;
    code: string;
    type: 'COMPANY' | 'BRANCH' | 'DEPARTMENT' | 'UNIT';
    parentId?: string;
    managerId?: string;
  }): Promise<OrgUnitEntity> {
    logger.info(`OrgService: Creating org unit '${data.name}' of type '${data.type}'`);

    const trimmedCode = data.code.trim().toUpperCase();
    const existing = await orgRepository.findByCode(trimmedCode);
    if (existing) {
      throw new BadRequestError(`An organizational unit with code '${trimmedCode}' already exists`);
    }

    await this.validateOrgStructure(data.type, data.parentId, data.managerId);

    const created = await orgRepository.create({
      name: data.name,
      code: trimmedCode,
      type: data.type,
      parentId: data.parentId || undefined,
      managerId: data.managerId || undefined,
    });

    return created;
  }

  /**
   * Get an organizational unit by ID.
   */
  async getOrgUnitById(id: string): Promise<OrgUnitEntity & { managerName?: string; parentName?: string }> {
    logger.info(`OrgService: Getting org unit details for '${id}'`);
    const unit = await orgRepository.findById(id);
    if (!unit) {
      throw new NotFoundError(`Organizational unit with ID '${id}' not found`);
    }

    let managerName: string | undefined;
    if (unit.managerId) {
      const manager = await userRepository.findById(unit.managerId);
      if (manager) {
        managerName = manager.name;
      }
    }

    let parentName: string | undefined;
    if (unit.parentId) {
      const parent = await orgRepository.findById(unit.parentId);
      if (parent) {
        parentName = parent.name;
      }
    }

    return {
      ...unit,
      managerName,
      parentName,
    };
  }

  /**
   * List organizational units.
   */
  async listOrgUnits(options?: QueryOptions): Promise<{ data: OrgUnitEntity[]; total: number }> {
    logger.info(`OrgService: Listing org units with options: ${JSON.stringify(options)}`);
    return orgRepository.findAll(options);
  }

  /**
   * Update an organizational unit.
   */
  async updateOrgUnit(
    id: string,
    updates: {
      name?: string;
      code?: string;
      type?: 'COMPANY' | 'BRANCH' | 'DEPARTMENT' | 'UNIT';
      parentId?: string;
      managerId?: string;
    }
  ): Promise<OrgUnitEntity> {
    logger.info(`OrgService: Updating org unit '${id}'`);

    const existingUnit = await orgRepository.findById(id);
    if (!existingUnit) {
      throw new NotFoundError(`Organizational unit with ID '${id}' not found`);
    }

    const finalType = updates.type || existingUnit.type;
    const finalParentId = updates.parentId !== undefined ? updates.parentId : existingUnit.parentId;
    const finalManagerId = updates.managerId !== undefined ? updates.managerId : existingUnit.managerId;

    // Validate code uniqueness if changing code
    if (updates.code && updates.code.trim().toUpperCase() !== existingUnit.code) {
      const trimmedCode = updates.code.trim().toUpperCase();
      const codeConflict = await orgRepository.findByCode(trimmedCode);
      if (codeConflict) {
        throw new BadRequestError(`An organizational unit with code '${trimmedCode}' already exists`);
      }
    }

    // Validate structural rules
    await this.validateOrgStructure(finalType, finalParentId || undefined, finalManagerId || undefined, id);

    const payload: Partial<OrgUnitEntity> = {};
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.code !== undefined) payload.code = updates.code.trim().toUpperCase();
    if (updates.type !== undefined) payload.type = updates.type;
    
    // Explicitly handle unsetting parentId or managerId if passed as empty strings or null
    if (updates.parentId !== undefined) {
      payload.parentId = updates.parentId || undefined;
    }
    if (updates.managerId !== undefined) {
      payload.managerId = updates.managerId || undefined;
    }

    const updated = await orgRepository.update(id, payload);
    return updated;
  }

  /**
   * Delete an organizational unit.
   */
  async deleteOrgUnit(id: string): Promise<boolean> {
    logger.info(`OrgService: Deleting org unit '${id}'`);

    const existingUnit = await orgRepository.findById(id);
    if (!existingUnit) {
      throw new NotFoundError(`Organizational unit with ID '${id}' not found`);
    }

    const hasChildren = await orgRepository.hasChildren(id);
    if (hasChildren) {
      throw new BadRequestError(`Cannot delete organizational unit '${existingUnit.name}' as it has dependent sub-units (branches, departments or units)`);
    }

    return orgRepository.delete(id);
  }

  /**
   * Get the complete recursive department tree.
   */
  async getOrgTree(): Promise<OrgTreeNode[]> {
    logger.info('OrgService: Building recursive organizational structure tree');
    const { data: units } = await orgRepository.findAll({ limit: 1000 });
    
    // Fetch users to map manager names efficiently in-memory
    let userMap = new Map<string, string>();
    try {
      const users = await dbPool.query('SELECT id, name FROM users LIMIT 1000') as any[];
      userMap = new Map(users.map(u => [u.id, u.name]));
    } catch (e) {
      logger.warn(`OrgService: Failed to load user profiles for tree mapping. Error: ${(e as Error).message}`);
    }

    // Map parent names as well
    const unitMap = new Map<string, OrgUnitEntity>();
    for (const u of units) {
      unitMap.set(u.id, u);
    }

    const nodes: OrgTreeNode[] = units.map(u => ({
      ...u,
      managerName: u.managerId ? userMap.get(u.managerId) : undefined,
      parentName: u.parentId ? unitMap.get(u.parentId)?.name : undefined,
      children: [],
    }));

    const nodeMap = new Map<string, OrgTreeNode>();
    for (const node of nodes) {
      nodeMap.set(node.id, node);
    }

    const rootNodes: OrgTreeNode[] = [];

    for (const node of nodes) {
      if (node.parentId && nodeMap.has(node.parentId)) {
        const parentNode = nodeMap.get(node.parentId)!;
        parentNode.children.push(node);
      } else {
        rootNodes.push(node);
      }
    }

    return rootNodes;
  }
}

export const orgService = new OrgService();
export default orgService;
