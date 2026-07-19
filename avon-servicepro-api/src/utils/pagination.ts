import { QueryOptions } from '../repositories/base.repository';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
  currentPage: number;
}

export const paginationHelper = {
  /**
   * Extract limit and offset options from generic QueryOptions, with defaults.
   */
  getPaginationOptions(options?: QueryOptions) {
    const limit = options?.limit !== undefined ? Math.max(1, options.limit) : 50;
    const offset = options?.offset !== undefined ? Math.max(0, options.offset) : 0;
    const sortBy = options?.sortBy || 'id';
    const sortOrder = options?.sortOrder || 'ASC';
    
    return {
      limit,
      offset,
      sortBy,
      sortOrder,
    };
  },

  /**
   * Standardizes the shape of paginated responses returned from APIs.
   */
  formatResult<T>(data: T[], total: number, limit: number, offset: number): PaginatedResult<T> {
    const currentPage = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    
    return {
      data,
      total,
      limit,
      offset,
      totalPages,
      currentPage,
    };
  }
};
